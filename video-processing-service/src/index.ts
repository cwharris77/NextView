import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/process-video", (req, res) => {
  // get path of the input video
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    return res
      .status(400)
      .send("Bad Request: Input and output file paths are required.");
  }

  ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      console.log("Video processing completed successfully.");
      res.status(200).send("Video processing completed successfully.");
    })
    .on("error", (err) => {
      console.error("Error processing video:", err);
      res.status(500).send("Internal Server Error: Video processing failed.");
    })
    .save(outputFilePath);
});

app.listen(PORT, () => {
  console.log(
    `Video Processing Service is running on http://localhost:${PORT}`
  );
});
