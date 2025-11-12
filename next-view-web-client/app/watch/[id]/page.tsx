import { getVideoById } from "@/app/utils/firebase/functions";
import { notFound } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {
  const { id: videoId } = await params;
  const video = await getVideoById(videoId);

  if (!video) {
    return notFound();
  }

  const videoPrefix =
    "https://storage.googleapis.com/next-view-processed-videos/";

  return (
    <div className='p-0 md:p-4 lg:p-8 w-full'>
      <video
        controls
        src={videoPrefix + video.filename}
        className='rounded-md w-full md:w-2/3 lg:w-3/4'
      />
    </div>
  );
}

export default Page;
