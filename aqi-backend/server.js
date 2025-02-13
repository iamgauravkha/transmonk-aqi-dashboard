import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import deviceModel from "./models/sensor.js";
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

databaseConnection();

const mqttClient = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASSWORD,
});

mqttClient.on("connect", () => {
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
  console.log(message);
  if (topic === "transmonk/hvac/demo/data") {
    try {
      const data = JSON.parse(message.toString());
      const deviceId = data.Deviceid;

      const timestamp = new Date();

      const extractedData = {
        deviceId,
        cO2: { value: parseInt(data.Data[13]), timestamp },
        massConcentrationPm2p5: {
          value: parseInt(data.Data[15]),
          timestamp,
        },
        massConcentrationPm10p0: {
          value: parseInt(data.Data[16]),
          timestamp,
        },
        vocIndex: { value: parseInt(data.Data[17]), timestamp },
        ambientHumidity: { value: parseInt(data.Data[18]), timestamp },
        ambientTemperature: { value: parseInt(data.Data[19]), timestamp },
      };

      // console.log(extractedData);

      // Check if document with the same deviceId exists
      const existingEntry = await deviceModel.findOne({ deviceId });

      // console.log(existingEntry);
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
//         massConcentrationPm2p5: 0,
//         massConcentrationPm10p0: 0,
//         vocIndex: 0,
//         ambientHumidity: 0,
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
//           massConcentrationPm2p5: 0,
//           massConcentrationPm10p0: 0,
//           vocIndex: 0,
//           ambientHumidity: 0,
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
        massConcentrationPm2p5: 0,
        massConcentrationPm10p0: 0,
        vocIndex: 0,
        ambientHumidity: 0,
        ambientTemperature: 0,
      };
      let count = 0;

      // Store entries that will be used for average calculation
      const entriesToProcess = {
        cO2: [],
        massConcentrationPm2p5: [],
        massConcentrationPm10p0: [],
        vocIndex: [],
        ambientHumidity: [],
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
          massConcentrationPm2p5: 0,
          massConcentrationPm10p0: 0,
          vocIndex: 0,
          ambientHumidity: 0,
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
  console.log("Cron scheduled");
  calculateHourlyAverages();
});

// Schedule the task to run every day at 00:00 (midnight)
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running daily cleanup job...");

    // Delete all records from the collection
    await AverageModel.deleteMany({});

    console.log("All records deleted. Fresh start for the new day.");
  } catch (error) {
    console.error("Error running cleanup job:", error);
  }
});

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
