import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import deviceModel from "./models/sensor.js";
import daywiseEntries from "./models/average.js";
import mqtt from "mqtt";
import morgan from "morgan";
import routes from "./routes/index.js";
dotenv.config();
import { databaseConnection } from "./config/database.js";
import minuteWiseData from "./models/minutes.js";

const app = express();
app.use(cors({ origin: true }));
app.use(morgan("tiny"));
const PORT = process.env.PORT || 5500;
const MAX_ENTRIES = 1000;

databaseConnection();

const mqttClient = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});

mqttClient.on("connect", () => {
  // console.log("MQTT client connected");
  mqttClient.subscribe("transmonk/hvac/demo/data", (err) => {
    if (err) {
      // console.error("Error subscribing to topic:", err);
    } else {
      // console.log("Subscribed to topic: transmonk/hvac/demo/data");
    }
  });
});

// MQTT message handler
mqttClient.on("message", async (topic, message) => {
  if (topic === "transmonk/hvac/demo/data") {
    try {
      const data = JSON.parse(message.toString());
      const deviceId = data.Deviceid;
      const [
        cO2,
        massConcentrationPm2p5,
        massConcentrationPm10p0,
        vocIndex,
        ambientHumidity,
        ambientTemperature,
      ] = data.Data;

      const timestamp = new Date();

      const extractedData = {
        deviceId,
        cO2: { value: parseInt(cO2), timestamp },
        massConcentrationPm2p5: {
          value: parseInt(massConcentrationPm2p5),
          timestamp,
        },
        massConcentrationPm10p0: {
          value: parseInt(massConcentrationPm10p0),
          timestamp,
        },
        vocIndex: { value: parseInt(vocIndex), timestamp },
        ambientHumidity: { value: parseInt(ambientHumidity), timestamp },
        ambientTemperature: { value: parseInt(ambientTemperature), timestamp },
      };

      // console.log(extractedData);

      // Check if document with the same deviceId exists
      const existingEntry = await deviceModel.findOne({ deviceId });

      console.log(existingEntry);
      if (existingEntry) {
        // Update the existing entry by pushing the new object with value and timestamp
        // existingEntry.cO2 = [
        //   ...existingEntry.cO2,
        //   {
        //     value: extractedData.cO2.value,
        //     timestamp: extractedData.cO2.timestamp,
        //   },
        // ];
        existingEntry.cO2.push({
          value: extractedData.cO2.value,
          timestamp: extractedData.cO2.timestamp,
        });
        // existingEntry.dP.push({
        //   value: extractedData.dP.value,
        //   timestamp: extractedData.dP.timestamp,
        // });
        existingEntry.massConcentrationPm2p5.push({
          value: extractedData.massConcentrationPm2p5.value,
          timestamp: extractedData.massConcentrationPm2p5.timestamp,
        });
        existingEntry.massConcentrationPm10p0.push({
          value: extractedData.massConcentrationPm10p0.value,
          timestamp: extractedData.massConcentrationPm10p0.timestamp,
        });
        existingEntry.vocIndex.push({
          value: extractedData.vocIndex.value,
          timestamp: extractedData.vocIndex.timestamp,
        });
        existingEntry.ambientHumidity.push({
          value: extractedData.ambientHumidity.value,
          timestamp: extractedData.ambientHumidity.timestamp,
        });
        existingEntry.ambientTemperature.push({
          value: extractedData.ambientTemperature.value,
          timestamp: extractedData.ambientTemperature.timestamp,
        });
        // Save the updated entry
        await existingEntry.save();
        // console.log("Existing entry updated in database");
      } else {
        // Create a new entry if no existing entry with the same deviceId
        const newSensorData = new deviceModel(extractedData);
        await newSensorData.save();
        // console.log("New data inserted into database");
      }
    } catch (error) {
      console.error("Error processing MQTT message:", error);
    }
  }
});

// const processMinuteAverages = async () => {
//   try {
//     const now = new Date();
//     const oneMinuteAgo = new Date(now.getTime() - 60 * 1000); // 1 minute ago

//     const devices = await deviceModel.distinct("deviceId"); // Get all unique device IDs

//     for (const deviceId of devices) {
//       // Fetch all entries from the last 1 minute for ALL sensors
//       const deviceData = await deviceModel.find({
//         deviceId,
//         $or: [
//           { "cO2.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           {
//             "massConcentrationPm2p5.timestamp": {
//               $gte: oneMinuteAgo,
//               $lt: now,
//             },
//           },
//           {
//             "massConcentrationPm10p0.timestamp": {
//               $gte: oneMinuteAgo,
//               $lt: now,
//             },
//           },
//           { "vocIndex.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           { "ambientHumidity.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           { "ambientTemperature.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//         ],
//       });

//       if (deviceData.length === 0) continue; // Skip if no data found

//       const average = (arr) =>
//         arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : null;

//       // Extract sensor values
//       const cO2Values = [];
//       const massConcentrationPm2p5Values = [];
//       const massConcentrationPm10p0Values = [];
//       const vocIndexValues = [];
//       const ambientHumidityValues = [];
//       const ambientTemperatureValues = [];

//       deviceData.forEach((entry) => {
//         if (entry.cO2) entry.cO2.forEach((d) => cO2Values.push(d.value));
//         if (entry.massConcentrationPm2p5)
//           entry.massConcentrationPm2p5.forEach((d) =>
//             massConcentrationPm2p5Values.push(d.value)
//           );
//         if (entry.massConcentrationPm10p0)
//           entry.massConcentrationPm10p0.forEach((d) =>
//             massConcentrationPm10p0Values.push(d.value)
//           );
//         if (entry.vocIndex)
//           entry.vocIndex.forEach((d) => vocIndexValues.push(d.value));
//         if (entry.ambientHumidity)
//           entry.ambientHumidity.forEach((d) =>
//             ambientHumidityValues.push(d.value)
//           );
//         if (entry.ambientTemperature)
//           entry.ambientTemperature.forEach((d) =>
//             ambientTemperatureValues.push(d.value)
//           );
//       });

//       const minuteData = {
//         minute: now.getMinutes(),
//         cO2: average(cO2Values),
//         massConcentrationPm2p5: average(massConcentrationPm2p5Values),
//         massConcentrationPm10p0: average(massConcentrationPm10p0Values),
//         vocIndex: average(vocIndexValues),
//         ambientHumidity: average(ambientHumidityValues),
//         ambientTemperature: average(ambientTemperatureValues),
//       };

//       // Find or create a minute-wise data document for today
//       const existingData = await minuteWiseData.findOne({
//         deviceId,
//         date: now.toDateString(),
//       });

//       if (existingData) {
//         existingData.minutes.push(minuteData);
//         await existingData.save();
//       } else {
//         await new minuteWiseData({
//           deviceId,
//           date: now.toDateString(),
//           minutes: [minuteData],
//         }).save();
//       }

//       // Delete processed entries
//       await deviceModel.deleteMany({
//         deviceId,
//         $or: [
//           { "cO2.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           {
//             "massConcentrationPm2p5.timestamp": {
//               $gte: oneMinuteAgo,
//               $lt: now,
//             },
//           },
//           {
//             "massConcentrationPm10p0.timestamp": {
//               $gte: oneMinuteAgo,
//               $lt: now,
//             },
//           },
//           { "vocIndex.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           { "ambientHumidity.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//           { "ambientTemperature.timestamp": { $gte: oneMinuteAgo, $lt: now } },
//         ],
//       });

//       console.log(`Processed minute-wise average for device ${deviceId}`);
//     }
//   } catch (error) {
//     console.error("Error processing minute-wise averages:", error);
//   }
// };

// Run the function every minute
setInterval(processMinuteAverages, 60 * 1000);

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
