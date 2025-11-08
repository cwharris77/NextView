import type { Timestamp } from "firebase-admin/firestore";

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
  createdAt?: Timestamp;
}

export interface GetVideosResponse {
  videos: Video[];
  nextCursor?: string | undefined;
}
