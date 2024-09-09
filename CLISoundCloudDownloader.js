import fs from "fs"
import nid3 from "node-id3"
import { Soundcloud } from 'soundcloud.ts';
const soundcloud = new Soundcloud()

const getDumpFolder = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
    const dumpFolder = `${process.env.USERPROFILE}\\Downloads\\${formattedDateTime}`;
    return dumpFolder
}

const editMp3CoverArt = async (songPath,artworkPath) => {
    const tags = nid3.read(songPath);
    tags.image = {
        mime: "image/jpeg",
        type: {
            id: 3, // Cover (front) image
            name: "front"
        },
        description: "Cover",
        imageBuffer: fs.readFileSync(artworkPath)
    };
    nid3.write(tags, songPath);
    console.log(`Added cover art to: ${songPath}`);
};

const downloadTrack = async (url, downloadsDirectory) => {
    const track = await soundcloud.tracks.get(url)
    if((/[\\/:*?"<>|]/).test(track.title)) { return }
    const songDest = await soundcloud.util.downloadTrack(track,downloadsDirectory)
    const artworkDest = await soundcloud.util.downloadSongCover(track,downloadsDirectory)
    await editMp3CoverArt(songDest,artworkDest)
    fs.unlinkSync(artworkDest)
};

const downloadPlaylist = async (url, downloadsDirectory) => {
    const playlist = await soundcloud.playlists.get(url)
    for (const track of playlist.tracks) {
        console.log(`Downloading: ${track.title}`);
        console.log(track.uri)
        await downloadTrack(track.uri, downloadsDirectory);
    }
    console.log(`All songs from the playlist are saved in ${downloadsDirectory}`);
};

const main = async () => {
    const downloadFolder = getDumpFolder()
    
    if (process.argv.length < 3) {
        console.log("Usage: node CLISoundCloudDownloader.js [-playlist] <URL>");
        process.exit(1);
    }

    const isPlaylist = process.argv[2] === "-playlist";
    const url = isPlaylist ? process.argv[3] : process.argv[2];
    
    if (!url) {
        console.log("Invalid URL!");
        process.exit(1);
    }

    const parsedUrl = url.split("?")[0];

    try {
        if (isPlaylist) {
            await downloadPlaylist(parsedUrl, downloadFolder);
        } else {
            await downloadSong(parsedUrl, downloadFolder);
        }
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

main();