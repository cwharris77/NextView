import express from "express";
import { isVideoNew, setVideo } from "./firestore";
import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setupDirectories,
  uploadProcessedVideo,
} from "./storage";

// Initialize directories
setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // get the bucket and filename from the cloud pub/sub message
  let data;

  try {
    const message = Buffer.from(req.body.message.data, "base64").toString(
      "utf8"
    );
    data = JSON.parse(message);

    if (!data.name) {
      throw new Error("Invalid message payload received");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send("Bad Request: Missing filename.");
  }

  const inputFileName = data.name; // Format of <UID>-<DATE>.<EXTENSION>
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split(".")[0];

  if (!isVideoNew(videoId)) {
    return res
      .status(400)
      .send("Bad request: video already processing or processed");
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: videoId.split("-")[0],
      status: "processing",
    });
  }

  // Download the raw video from Cloud Storage
  await downloadRawVideo(inputFileName);

  try {
    // Convert video to 360p
    await convertVideo(inputFileName, outputFileName);
  } catch (error) {
    console.error("Video conversion failed:", error);
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);
    return res
      .status(500)
      .send("Internal Server Error: Video conversion failed.");
  }

  // Upload the processed video back to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: "processed",
    filename: outputFileName,
  });

  // clean up local files
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  res.status(200).send("Processing completed successfully.");
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
app.listen(PORT, () => {
  console.log(
    `Video Processing Service is running on http://localhost:${PORT}`
  );
});
