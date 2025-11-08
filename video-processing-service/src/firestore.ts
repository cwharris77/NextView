import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Video } from "./types";

initializeApp({ credential: credential.applicationDefault() });
const firestore = getFirestore();

const videoCollectionId = "videos";

/**
 *
 * @param videoId
 * @returns
 */
async function getVideo(videoId: string) {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .get();
  return (snapshot.data() as Video) ?? {};
}

/**
 *
 * @param videoId
 * @param video
 * @returns
 */
export function setVideo(videoId: string, video: Video) {
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true });
}

/**
 *
 * @param videoId
 * @returns
 */
export async function isVideoNew(videoId: string) {
  const video = await getVideo(videoId);
  return video?.status === undefined;
}
