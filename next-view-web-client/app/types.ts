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
  nextCursor?: string | undefined;
}
