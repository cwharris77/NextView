"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Video } from "../types";
import { getVideos } from "../utils/firebase/functions";

export default function VideoView() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Function to load videos
  const loadVideos = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { videos, nextCursor: newCursor } = await getVideos(10, nextCursor);
      setNextCursor(newCursor);
      setVideos((prev) => [...prev, ...videos]);
      console.log("videos " + videos);
    } catch (err) {
      console.error("Error loading videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch first page on component mount
  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <main className='flex flex-col gap-4 p-4'>
      {videos.map((video) => (
        <Link href={`/watch?v=${video.filename}`} key={video.filename}>
          <Image
            src={"/default_thumbnail.png"}
            alt='video'
            width={120}
            height={80}
          />
        </Link>
      ))}

      {nextCursor && (
        <button
          onClick={loadVideos}
          disabled={loading}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </main>
  );
}
