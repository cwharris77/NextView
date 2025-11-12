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
      const { videos: newVideos, nextCursor: newCursor } = await getVideos(
        10,
        nextCursor
      );
      setNextCursor(newCursor);
      setVideos((prev) => {
        const combined = [...prev, ...newVideos];

        // Remove duplicates by id
        const uniqueVideos = Array.from(
          new Map(combined.map((v) => [v.id, v])).values()
        );

        return uniqueVideos;
      });
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
    <div className='w-full flex flex-col gap-4 p-4 flex-wrap justify-center items-center'>
      <div className='flex gap-5'>
        {videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image
              src={"/default_thumbnail.png"}
              alt='video'
              width={120}
              height={80}
            />
          </Link>
        ))}
      </div>

      {nextCursor && (
        <button
          onClick={loadVideos}
          disabled={loading}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded max-w-1/6'
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
