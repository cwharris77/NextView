import { httpsCallable } from "firebase/functions";
import { GetVideosResponse, Video } from "../../types";
import { functions } from "./firebase";

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");
const getVideoByIdFunction = httpsCallable(functions, "getVideoById");

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

export async function getVideos({
  limit = 10,
  lastCursor,
}: {
  limit?: number;
  lastCursor?: string | undefined;
}): Promise<GetVideosResponse> {
  try {
    const response = await getVideosFunction({
      pageSize: limit,
      lastDoc: lastCursor,
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

export async function getVideoById(id: string) {
  try {
    const response = await getVideoByIdFunction({ id: id });

    if (!response.data) {
      throw new Error(`No video with id: ${id} found`);
    }

    return response.data as Video;
  } catch (err) {
    console.error(err);
    return null;
  }
}
