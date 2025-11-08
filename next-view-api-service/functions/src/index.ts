import { Storage } from "@google-cloud/storage";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import { GetVideosResponse, Video } from "./types";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 1 });

initializeApp();
const firestore = getFirestore();
const storage = new Storage();

const rawVideoBucketName = "next-view-raw-videos";
const videoCollectionId = "videos";

export const createUser = functions.auth.user().onCreate(async (user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  try {
    await firestore.collection("users").doc(user.uid).set(userInfo);
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  } catch (err) {
    logger.error("Error writing user to Firestore:", err);
  }
});

export const generateUploadUrl = onCall(
  { maxInstances: 10 },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated"
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique file name
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // get a v4 signed URL for uploading file
    const [url] = await bucket.file(fileName).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { url, fileName };
  }
);

export const getVideos = onCall(
  { maxInstances: 1 },
  async (request): Promise<GetVideosResponse> => {
    try {
      const pageSize = 10;
      const { lastDoc } = request.data ?? {}; // Cursor for pagination

      // Order your data
      let query = firestore
        .collection(videoCollectionId)
        .orderBy("createdAt", "desc");

      // Fetch first page or subsequent pages
      if (lastDoc) {
        const lastSnapshot = await firestore
          .collection(videoCollectionId)
          .doc(lastDoc)
          .get();
        query = query.startAfter(lastSnapshot);
      }

      query = query.limit(pageSize);

      // Execute query
      const snapshot = await query.get();

      // Process documents
      const videos: Video[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate.toISOString(),
        };
      });

      // Store last document as cursor for next page
      const newLastDoc =
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : undefined;

      logger.info(`Fetched ${videos.length} videos`);

      return { videos, nextCursor: newLastDoc };
    } catch (error) {
      logger.error("Error fetching videos:", error);
      return { videos: [], nextCursor: undefined };
    }
  }
);
