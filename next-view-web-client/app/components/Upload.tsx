"use client";

import { uploadVideo } from "../utils/firebase/functions";

export default function Upload() {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.item(0);

    if (!file) {
      alert("Failed to upload file: File is required");
      return;
    }

    try {
      await uploadVideo(file);
      alert(`File uploaded successfully`);
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <>
      <input
        className='hidden'
        id='upload'
        type='file'
        accept='video/*'
        onChange={handleFileChange}
      />
      <label
        htmlFor='upload'
        className='flex justify-center items-center w-12 h-12 rounded-full border-0 cursor-pointer text-xs p-2 hover:bg-gray-500'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.2}
          stroke='currentColor'
          className='size-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z'
          />
        </svg>
      </label>
    </>
  );
}
