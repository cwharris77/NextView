import VideosView from "./components/VideosView";

export default async function Home() {
  return (
    <main className=''>
      <VideosView />
    </main>
  );
}

export const revalidate = 30;
