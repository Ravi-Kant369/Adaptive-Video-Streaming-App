// "use client";
// import { useEffect, useRef } from "react";
// import { useParams } from 'next/navigation';
// import HLS from 'hls.js';

// export default function Page(){
      
//     const params = useParams<{ videoId: string }>();
//     const videoId = params.videoId;


//     const videoRef = useRef<HTMLVideoElement>(null);

//     useEffect(()=> {
//         if(videoId && HLS.isSupported()){
//             const hls = new HLS();
//             hls.loadSource(`http://localhost:3000/output/${videoId}/master.m3u8`)
//             hls.attachMedia(videoRef.current!);
//         }

//     },[videoId]);

//     //4SCLE7oGPuViyAvn

    
//     return (
//         <div
//           className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-8"
//           style={{ backgroundImage: 'url(/05.svg)' }} // Path to your SVG file
//         >
//           <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-8 text-center space-y-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                
//                 <div className="mt-4">
//                    <h2 className="text-3xl font-bold text-gray-900">
//                        Video Preview {videoId}
//                    </h2>

//                   <video
//                      controls
//                      className="rounded-lg border border-gray-200 shadow-md"
//                      width={'100%'} // Set the width and height of the video
//                      ref={videoRef}
                  
//                   />





//                 </div>



//           </div>
//         </div>
//       );


//   }

"use client";
import { useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import HLS from 'hls.js';

export default function Page() {
  const params = useParams<{ videoId: string }>();
  const videoId = params.videoId;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoId && HLS.isSupported()) {
      const hls = new HLS();
      hls.loadSource(`http://localhost:3000/output/${videoId}/master.m3u8`);
      hls.attachMedia(videoRef.current!);
    }
  }, [videoId]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-8"
      style={{ backgroundImage: 'url(/streamBG.svg)' }} // Path to your SVG file
    >
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-8 text-center space-y-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
        <h2 className="text-4xl font-semibold text-gray-900">
          Video Preview: {videoId}
        </h2>

        <div className="relative">
          <video
            controls
            className="rounded-lg border-2 border-gray-200 shadow-xl"
            width="100%" // Set the width of the video to 100%
            ref={videoRef}
            style={{
              maxHeight: '70vh', // Limit the height for better responsiveness
              objectFit: 'contain', // Preserve the video aspect ratio
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black opacity-30"></div>
        </div>

        <p className="text-sm text-gray-800 mt-4">
          This is a preview of video ID: {videoId}. Enjoy the experience !!!!.
        </p>
      </div>
    </div>
  );
}
