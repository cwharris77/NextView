import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { httpsCallable } from "firebase/functions";
import { GetVideosResponse } from "../../types";
import { functions } from "./firebase";

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

export async function uploadVideo(file: File) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await generateUploadUrl({
    fileExtension: file.name.split(".").pop(),
  });
  // Upload the file via the signed URL
  await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return;
}

export async function getVideos(
  limit = 10,
  lastCursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
): Promise<GetVideosResponse> {
  try {
    const response = await getVideosFunction({
      limit,
      nextCursor: lastCursor,
    });

    if (!response?.data) {
      console.warn("getVideos(): No data returned from backend");
      return { videos: [], nextCursor: undefined };
    }

    return response.data as GetVideosResponse;
  } catch (error) {
    console.error("Error calling getVideos function", error);
    return { videos: [], nextCursor: undefined };
  }
}
