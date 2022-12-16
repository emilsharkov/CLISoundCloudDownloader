const SoundCloud = require("soundcloud-scraper");
var exec = require('child_process').exec;
const client = new SoundCloud.Client();
const fs = require("fs");

// if(process.argv.length != 4){
//     die("Usage: node soundcloud2spotify.js <PATH> <SONG URL>")
// }

let url = "https://soundcloud.com/benzvibez/playboi-carti-rockstar-made-remix-slowedreverb-prod-benz-music"
let sanitizedURL = url.split("?")
console.log(sanitizedURL)

download(sanitizedURL[0])


async function download (url) {
    console.log("penis")

    let songDownload = await client.getSongInfo(url)
    .then(async song => {
        const stream = await song.downloadProgressive();
        const writer = stream.pipe(fs.createWriteStream(`./pp.mp3`));
        writer.on("finish", () => {
        console.log("Finished writing song!")
        });
    })
    .catch(console.error);

    console.log("benis")
}
