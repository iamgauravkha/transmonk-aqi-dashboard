import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import deviceModel from "./models/device.js";
import AverageModel from "./models/average.js";
import mqtt from "mqtt";
import morgan from "morgan";
import routes from "./routes/index.js";
dotenv.config();
import { databaseConnection } from "./config/database.js";
import trackModel from "./models/track.js";

const app = express();
app.use(cors({ origin: true }));
app.use(morgan("tiny"));
const PORT = process.env.PORT || 5500;
app.use(express.json());
databaseConnection();

export const mqttClient = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});

mqttClient.on("connect", () => {
  // to recive data from all other devices except balance air
  mqttClient.subscribe("transmonk/hvac/demo/data", (err) => {
    if (err) {
      console.error("Error in subscription of devices", err);
    } else {
      console.log("Subscribed to topic: 'transmonk/hvac/demo/data'");
    }
  });
  // to recive data from balance air
  mqttClient.subscribe("transmonk/balanceair/site1/data", (err) => {
    if (err) {
      console.error("Error in subscription of balance air devices", err);
    } else {
      console.log("Subscribed to topic: 'transmonk/balanceair/site1/data'");
    }
  });
});

// MQTT message handler
mqttClient.on("message", async (topic, message) => {
  console.log("Msg from all devices");
  console.log(message);
  if (topic === "transmonk/hvac/demo/data") {
    try {
      const data = JSON.parse(message.toString());
      const deviceId = data.Deviceid;
      const timestamp = new Date();
      const extractedData = {
        deviceId,
        auto: data.Data[1],
        setVoltOne: data.Data[2],
        minVoltFan: data.Data[3],
        maxVoltFan: data.Data[4],
        minTempOne: data.Data[5],
        maxTempOne: data.Data[6],
        minVoltDamper: data.Data[9],
        maxVoltDamper: data.Data[10],
        minCO2: data.Data[11],
        maxCO2: data.Data[12],
        cO2: { value: parseInt(data.Data[13]), timestamp },
        dP: data.Data[14],
        pM25: data.Data[15],
        pM10: data.Data[16],
        vocIndex: data.Data[17],
        ambientHumidity: data.Data[18],
        ambientTemperature: { value: parseInt(data.Data[19]), timestamp },
        avgTemperature: data.Data[20],
        fanRPM: data.Data[21],
        fanACVoltage: data.Data[22],
        averageACC: data.Data[23],
        setVoltTwo: data.Data[24],
        controlBy: data.Data[25],
      };
      console.log(extractedData);

      // Check if document with the same deviceId exists
      const existingEntry = await deviceModel.findOne({ deviceId });

      console.log(existingEntry);
      if (existingEntry) {
        existingEntry.auto = extractedData.auto;
        existingEntry.setVoltOne = extractedData.setVoltOne;
        existingEntry.minVoltFan = extractedData.minVoltFan;
        existingEntry.maxVoltFan = extractedData.maxVoltFan;
        existingEntry.minTempOne = extractedData.minTempOne;
        existingEntry.maxTempOne = extractedData.maxTempOne;
        existingEntry.minVoltDamper = extractedData.minVoltDamper;
        existingEntry.maxVoltDamper = extractedData.maxVoltDamper;
        existingEntry.minCO2 = extractedData.minCO2;
        existingEntry.maxCO2 = extractedData.maxCO2;
        existingEntry.cO2.push({
          value: extractedData.cO2.value,
          timestamp: extractedData.cO2.timestamp,
        });
        existingEntry.dP = extractedData.dP;
        existingEntry.pM25 = extractedData.pM25;
        existingEntry.pM10 = extractedData.pM10;
        existingEntry.vocIndex = extractedData.vocIndex;
        existingEntry.ambientHumidity = extractedData.ambientHumidity;
        existingEntry.ambientTemperature.push({
          value: extractedData.ambientTemperature.value,
          timestamp: extractedData.ambientTemperature.timestamp,
        });
        existingEntry.avgTemperature = extractedData.avgTemperature;
        existingEntry.fanRPM = extractedData.fanRPM;
        existingEntry.fanACVoltage = extractedData.fanACVoltage;
        existingEntry.averageACC = extractedData.averageACC;
        existingEntry.setVoltTwo = extractedData.setVoltTwo;
        existingEntry.controlBy = extractedData.controlBy;
        // Save the updated entry
        await existingEntry.save();
        console.log("Existing entry updated in database");
      } else {
        // Create a new entry if no existing entry with the same deviceId
        const newSensorData = new deviceModel(extractedData);
        await newSensorData.save();
        console.log("New data inserted into database");
      }
    } catch (error) {
      console.error("Error processing MQTT message from all devices:", error);
    }
  } else if (topic === "transmonk/balanceair/site1/data") {
    console.log("Msg from balance air device");
    try {
      const data = JSON.parse(message.toString());
      const deviceId = "BAD-191073";
      const timestamp = new Date();
      const extractedData = {
        deviceId,
        auto: data.Data[1],
        setVoltOne: data.Data[2],
        minVoltFan: data.Data[3],
        maxVoltFan: data.Data[4],
        minTempOne: data.Data[5],
        maxTempOne: data.Data[6],
        minVoltDamper: data.Data[9],
        maxVoltDamper: data.Data[10],
        minCO2: data.Data[11],
        maxCO2: data.Data[12],
        cO2: { value: parseInt(data.Data[13]), timestamp },
        dP: data.Data[14],
        pM25: data.Data[15],
        pM10: data.Data[16],
        vocIndex: data.Data[17],
        ambientHumidity: data.Data[18],
        ambientTemperature: { value: parseInt(data.Data[19]), timestamp },
        avgTemperature: data.Data[20],
        fanRPM: data.Data[21],
        fanACVoltage: data.Data[22],
        averageACC: data.Data[23],
        setVoltTwo: data.Data[24],
        controlBy: data.Data[25],
      };
      console.log(extractedData);

      // Check if document with the same deviceId exists
      const existingEntry = await deviceModel.findOne({ deviceId });

      console.log(existingEntry);
      if (existingEntry) {
        existingEntry.auto = extractedData.auto;
        existingEntry.setVoltOne = extractedData.setVoltOne;
        existingEntry.minVoltFan = extractedData.minVoltFan;
        existingEntry.maxVoltFan = extractedData.maxVoltFan;
        existingEntry.minTempOne = extractedData.minTempOne;
        existingEntry.maxTempOne = extractedData.maxTempOne;
        existingEntry.minVoltDamper = extractedData.minVoltDamper;
        existingEntry.maxVoltDamper = extractedData.maxVoltDamper;
        existingEntry.minCO2 = extractedData.minCO2;
        existingEntry.maxCO2 = extractedData.maxCO2;
        existingEntry.cO2.push({
          value: extractedData.cO2.value,
          timestamp: extractedData.cO2.timestamp,
        });
        existingEntry.dP = extractedData.dP;
        existingEntry.pM25 = extractedData.pM25;
        existingEntry.pM10 = extractedData.pM10;
        existingEntry.vocIndex = extractedData.vocIndex;
        existingEntry.ambientHumidity = extractedData.ambientHumidity;
        existingEntry.ambientTemperature.push({
          value: extractedData.ambientTemperature.value,
          timestamp: extractedData.ambientTemperature.timestamp,
        });
        existingEntry.avgTemperature = extractedData.avgTemperature;
        existingEntry.fanRPM = extractedData.fanRPM;
        existingEntry.fanACVoltage = extractedData.fanACVoltage;
        existingEntry.averageACC = extractedData.averageACC;
        existingEntry.setVoltTwo = extractedData.setVoltTwo;
        existingEntry.controlBy = extractedData.controlBy;
        // Save the updated entry
        await existingEntry.save();
        console.log("Existing entry updated in database");
      } else {
        // Create a new entry if no existing entry with the same deviceId
        const newSensorData = new deviceModel(extractedData);
        await newSensorData.save();
        console.log("New data inserted for balance air into database");
      }
    } catch (error) {
      console.error("Error processing MQTT message from balance air:", error);
    }
  }
});

// Function to calculate and store hourly averages

// const calculateHourlyAverages = async () => {
//   console.log("Running hourly average calculation...");

//   const currentTime = new Date();
//   const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
//   const currentHour = currentTime.getHours();
//   const currentDay = currentTime.toISOString().split("T")[0]; // YYYY-MM-DD format

//   try {
//     // Get all devices
//     const devices = await deviceModel.find();

//     for (const device of devices) {
//       let avgData = {
//         cO2: 0,
//         ambientTemperature: 0,
//       };
//       let count = 0;

//       // Process each sensor to calculate averages
//       for (const sensorType of Object.keys(avgData)) {
//         const sensorValues = device[sensorType].filter(
//           (entry) => entry.timestamp >= oneHourAgo
//         );

//         if (sensorValues.length > 0) {
//           avgData[sensorType] =
//             sensorValues.reduce((sum, entry) => sum + entry.value, 0) /
//             sensorValues.length;
//           count++;
//         }
//       }

//       // If no data received, mark values as 0
//       if (count === 0) {
//         avgData = {
//           cO2: 0,
//           ambientTemperature: 0,
//         };
//       }

//       // Check if an entry for the current day already exists
//       let averageEntry = await AverageModel.findOne({
//         deviceId: device.deviceId,
//         currentDay,
//       });

//       if (!averageEntry) {
//         averageEntry = new AverageModel({
//           deviceId: device.deviceId,
//           currentDay,
//           hours: [],
//         });
//       }

//       // Add or update the hourly data
//       const hourIndex = averageEntry.hours.findIndex(
//         (h) => h.hour === currentHour
//       );
//       if (hourIndex === -1) {
//         averageEntry.hours.push({ hour: currentHour, ...avgData });
//       } else {
//         averageEntry.hours[hourIndex] = { hour: currentHour, ...avgData };
//       }

//       // Save the updated averages
//       await averageEntry.save();

//       // Delete processed sensor data from the device collection
//       for (const sensorType of Object.keys(avgData)) {
//         device[sensorType] = device[sensorType].filter(
//           // yaha kuch gadbad hai check karna badd mai -----
//           (entry) => entry.timestamp < oneHourAgo
//         );
//       }

//       await device.save();
//     }

//     await trackModel.create({
//       average: `Average calculated for ${currentDay} and ${currentHour} successfully.`,
//     });

//     console.log("Hourly averages calculated and stored successfully.");
//   } catch (error) {
//     console.error("Error in calculating hourly averages:", error);
//   }
// };

const calculateHourlyAverages = async () => {
  console.log("Running hourly average calculation...");

  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
  const currentHour = currentTime.getHours();
  const currentDay = currentTime.toISOString().split("T")[0]; // YYYY-MM-DD format

  try {
    // Get all devices
    const devices = await deviceModel.find();

    for (const device of devices) {
      let avgData = {
        cO2: 0,
        ambientTemperature: 0,
      };
      let count = 0;

      // Store entries that will be used for average calculation
      const entriesToProcess = {
        cO2: [],
        ambientTemperature: [],
      };

      // First identify entries within the last hour
      for (const sensorType of Object.keys(avgData)) {
        entriesToProcess[sensorType] = device[sensorType].filter(
          (entry) => entry.timestamp >= oneHourAgo
        );

        if (entriesToProcess[sensorType].length > 0) {
          avgData[sensorType] =
            entriesToProcess[sensorType].reduce(
              (sum, entry) => sum + entry.value,
              0
            ) / entriesToProcess[sensorType].length;
          count++;
        }
      }

      // If no data received, mark values as 0
      if (count === 0) {
        avgData = {
          cO2: 0,
          ambientTemperature: 0,
        };
      }

      // Check if an entry for the current day already exists
      let averageEntry = await AverageModel.findOne({
        deviceId: device.deviceId,
        currentDay,
      });

      if (!averageEntry) {
        averageEntry = new AverageModel({
          deviceId: device.deviceId,
          currentDay,
          hours: [],
        });
      }

      // Add or update the hourly data
      const hourIndex = averageEntry.hours.findIndex(
        (h) => h.hour === currentHour
      );
      if (hourIndex === -1) {
        averageEntry.hours.push({ hour: currentHour, ...avgData });
      } else {
        averageEntry.hours[hourIndex] = { hour: currentHour, ...avgData };
      }

      // Save the updated averages
      await averageEntry.save();

      // Enhanced deletion logic:
      // 1. Delete processed entries
      // 2. Delete any entries older than the processing window
      for (const sensorType of Object.keys(avgData)) {
        // Find the oldest timestamp among the processed entries to use as a threshold
        const oldestProcessedTimestamp =
          entriesToProcess[sensorType].length > 0
            ? Math.min(
                ...entriesToProcess[sensorType].map((entry) =>
                  entry.timestamp.getTime()
                )
              )
            : oneHourAgo.getTime();

        // Keep only entries that are:
        // - Newer than the processing window (oneHourAgo)
        // - AND were not part of the processed set
        const processedTimestamps = new Set(
          entriesToProcess[sensorType].map((entry) => entry.timestamp.getTime())
        );

        device[sensorType] = device[sensorType].filter((entry) => {
          const entryTime = entry.timestamp.getTime();
          return (
            entryTime > oneHourAgo.getTime() && // Keep only entries newer than processing window
            !processedTimestamps.has(entryTime) // Remove processed entries
          );
        });
      }

      await device.save();
    }

    await trackModel.create({
      average: `Average calculated for ${currentDay} and ${currentHour} successfully.`,
    });

    console.log("Hourly averages calculated and stored successfully.");
  } catch (error) {
    console.error("Error in calculating hourly averages:", error);
  }
};

// Schedule the cron job to run at the start of every hour

cron.schedule("0 * * * *", () => {
  calculateHourlyAverages();
});

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
