"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const VideoPlayer = () => {
  const videoSrc = useSearchParams().get("v");
  const videoPrefix =
    "https://storage.googleapis.com/next-view-processed-videos/";

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPrefix + videoSrc} />
    </div>
  );
};

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer /> Player
    </Suspense>
  );
}
