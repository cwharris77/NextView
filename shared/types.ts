import { DocumentData, QueryDocumentSnapshot } from "@google-cloud/firestore";

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: "processing" | "processed";
  title?: string;
  description?: string;
  createdAt?: FirebaseFirestore.Timestamp;
}

export interface GetVideosResponse {
  videos: Video[];
  nextCursor?: QueryDocumentSnapshot<DocumentData, DocumentData> | undefined;
}
