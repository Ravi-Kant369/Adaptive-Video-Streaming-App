"use client";

import { ChangeEvent, } from "react";
import axios from "axios";

export default function VideoUpload() {
  
  //const [videourl ,setVideoUrl] = useState<string | null>(null);

 

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here'
    const file = event.target.files?.[0];
    if(!file){
        console.log("No file Selected");
        return;
    }
    console.log(file);
    try{
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(
        'http://localhost:3000/api/v1/videos/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        );

      console.log(response.data);

    }catch(error){
        console.log("Something went wrong",error);
    }

  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8"
      style={{ backgroundImage: 'url(/05.svg)' }} // Path to your SVG file
    >
      <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-8 text-center space-y-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-wide">Upload Your Video</h1>
        <p className="text-lg text-gray-700 mb-6">Choose a file to upload and share with the world!</p>
        
        <input
          type="file"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-100 p-4 transition-all duration-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />

        <p className="text-sm text-gray-500 mt-2">
          Max file size: 100MB. Supported formats: MP4, AVI, MOV.
        </p>
      </div>
    </div>
  );
}