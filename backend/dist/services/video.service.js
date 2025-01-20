"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideoForHLS = void 0;
// we write logic to video conversion in service layer
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const movie_repository_1 = require("../repositories/movie.repository");
;
const resolutions = [
    { width: 1920, height: 1080, bitRate: 2000 }, //resolution for 1080p
    { width: 1200, height: 720, bitRate: 1000 }, //720p
    { width: 854, height: 480, bitRate: 500 }, //480p
    { width: 640, height: 360, bitRate: 400 }, //360p
    { width: 256, height: 144, bitRate: 200 }, //144p
];
//this function takes inputpath :The path to input file and 
// outputPath:the path where processed HLS file will be saved
//callback :A callback function is called when the process is complete
//error first callback are those callback whose first argument is error
const processVideoForHLS = (inputPath, outputPath, callback) => {
    (0, movie_repository_1.createMovie)(outputPath);
    fs_1.default.mkdirSync(outputPath, { recursive: true }); //create the output directory 
    const masterPlayList = `${outputPath}/master.m3u8`; // path to the master playlistfile
    const masterContent = [];
    let countProcessing = 0;
    resolutions.forEach((resolution) => {
        console.log(`Processing the video for ${resolution.width}x${resolution.height} resolution`);
        const varientOutput = `${outputPath}/${resolution.height}p`;
        const varientPlaylist = `${varientOutput}/playlist.m3u8`;
        fs_1.default.mkdirSync(varientOutput, { recursive: true });
        (0, fluent_ffmpeg_1.default)(inputPath)
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
            .on('end', () => {
            //when the processing ends for a resolution, add the varient playlist to the master content
            masterContent.push(`#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bitRate * 1000},RESOLUTION=${resolution.width}x${resolution.height}\n${resolution.height}p/playlist.m3u8`);
            countProcessing += 1;
            if (countProcessing === resolutions.length) {
                console.log("Processing Complete");
                console.log(masterContent);
                //here we started making a playlist which control resolution
                fs_1.default.writeFileSync(masterPlayList, `#EXTM3U\n${masterContent.join('\n')}`);
                (0, movie_repository_1.updateMovieStatus)(outputPath, 'COMPLETED');
                callback(null, masterPlayList);
            }
        })
            .on('error', (error) => {
            console.log("An error occurred:", error);
            callback(error);
        })
            .run();
    });
};
exports.processVideoForHLS = processVideoForHLS;
