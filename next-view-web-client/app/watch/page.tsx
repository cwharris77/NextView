"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const VideoPlayer = () => {
  const videoSrc = useSearchParams().get("v");
  const videoPrefix =
    "https://storage.googleapis.com/next-view-processed-videos/";

  return (
    <div className='p-0 md:p-4 lg:p-8 w-full'>
      <video
        controls
        src={videoPrefix + videoSrc}
        className='rounded-md w-full md:w-2/3 lg:w-3/4'
      />
    </div>
  );
};

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer />
    </Suspense>
  );
}
