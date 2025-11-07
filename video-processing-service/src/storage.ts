import { Storage } from "@google-cloud/storage";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";

const storage = new Storage();

const rawVideoBucketName = "next-view-raw-videos";
const processedVideoBucketName = "next-view-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

/**
 * Sets up local directories for raw and processed videos
 */
export function setupDirectories() {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
}

/**
 * @param rawVideoName - name of the raw video file
 * @param processedVideoName - name of file to convert to
 * @returns Promise that resolves when conversion is complete
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Video processing completed successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error processing video:", err);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * Downloads a raw video file from Google Cloud Storage
 * @param fileName - name of the raw video file
 * @returns Promise that resolves when download is complete
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localRawVideoPath}/${fileName}`,
    });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
  );
}

/**
 * Uploads a processed video file to Google Cloud Storage
 * @param fileName - name of the processed video file
 * @returns Promise that resolves when upload is complete
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  await bucket.file(fileName).makePublic();

  console.log(
    `Processed video uploaded to gs://${processedVideoBucketName}/${fileName} and made public.`
  );
}

/**
 * Deletes a file from the local filesystem
 * @param filePath - path to the file to delete
 * @returns Promise that resolves when the file is deleted
 */
function deleteFile(filePath: string) {
  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(`File at path ${filePath} does not exist.`);
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error deleting file at path ${filePath}:`, err);
          reject(err);
        } else {
          console.log(`File at path ${filePath} deleted successfully.`);
          resolve();
        }
      });
    }
  });
}

/**
 * Deletes a raw video file from the local filesystem
 * @param fileName - name of the raw video file
 * @returns Promise that resolves when the file is deleted
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * Deletes a processed video file from the local filesystem
 * @param fileName - name of the processed video file
 * @returns Promise that resolves when the file is deleted
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * Ensures that a directory exists at the specified path
 * @param dirPath - path to the directory
 */
function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created at path: ${dirPath}`);
  }
}
