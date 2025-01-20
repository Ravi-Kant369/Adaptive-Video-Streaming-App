// we write logic to video conversion in service layer
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs'; 
import { createMovie, updateMovieStatus } from '../repositories/movie.repository';

interface Resolution  {
    width: number;
    height: number;
    bitRate : number;
};

const resolutions:Resolution[] =[
    { width: 1920, height: 1080, bitRate:2000 }, //resolution for 1080p
    { width: 1200, height: 720, bitRate:1000 },   //720p
    { width: 854, height: 480, bitRate:500 },     //480p
    { width: 640, height: 360, bitRate:400 },     //360p
    { width: 256, height: 144, bitRate:200 },     //144p
];

//this function takes inputpath :The path to input file and 
// outputPath:the path where processed HLS file will be saved


//callback :A callback function is called when the process is complete
//error first callback are those callback whose first argument is error

export const processVideoForHLS = (
     inputPath:string,
     outputPath:string,
     callback:(error:Error |null , masterPlayList?:string) => void):void=>{
         
        createMovie(outputPath);
        fs.mkdirSync(outputPath, { recursive : true});  //create the output directory 

        const masterPlayList = `${outputPath}/master.m3u8`; // path to the master playlistfile

        const masterContent: string[] = [];


        let countProcessing = 0;

        resolutions.forEach((resolution) =>{

            console.log(`Processing the video for ${resolution.width}x${resolution.height} resolution`);
            const varientOutput = `${outputPath}/${resolution.height}p`;
            const varientPlaylist = `${varientOutput}/playlist.m3u8`;

            fs.mkdirSync(varientOutput,{recursive:true});

            ffmpeg(inputPath)
              .outputOptions([
                 `-vf scale=w=${resolution.width}:h=${resolution.height}`,
                 `-b:v ${resolution.bitRate}k`,
                 '-codec:v libx264',
                 '-codec:a aac',
                 '-hls_time 10',
                 '-hls_playlist_type vod',
                 `-hls_segment_filename ${varientOutput}/segment%03d.ts`

                      

              ])
              .output(varientPlaylist)
              .on('end',()=>{
                //when the processing ends for a resolution, add the varient playlist to the master content
                masterContent.push(
                    `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate*1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`
                    
                );
                countProcessing += 1;
                if(countProcessing === resolutions.length){
                      console.log("Processing Complete");
                      console.log(masterContent);
                      //here we started making a playlist which control resolution
                      fs.writeFileSync(masterPlayList,`#EXTM3U\n${masterContent.join('\n')}`);

                     updateMovieStatus(outputPath,'COMPLETED');

                      callback(null, masterPlayList); 
                       

                }  

              })

              .on('error',(error) =>{
                  console.log("An error occurred:",error);
                  callback(error);
              })
             
              .run();


        });


     }
