const SoundCloud = require("soundcloud-scraper");
const client = new SoundCloud.Client();
const fs = require("fs");

const main = async => {
    var downloadFolder = process.env.USERPROFILE + '\\Downloads';
    if(process.argv.length != 3 && process.argv.length != 4){
        console.log("Usage: node soundcloud2spotify.js <SONG URL> (<new name>)")
        process.exit()
    }

    let url = process.argv[2]
    let parsedUrl = url.split("?")
    console.log(url)
    downloadSong(parsedUrl[0],downloadFolder)
}

const downloadFile = async (song, downloadsDirectory) => {
    process.chdir(downloadsDirectory)
    let songName = process.argv.length === 3 ? song.title.replace(/[\\/:*?\"<>|]/g, ""): process.argv[3]

    return new Promise(async resolve => {
        const stream = await song.downloadProgressive();
        const writer = stream.pipe(fs.createWriteStream(`./${songName}.mp3`));
        writer.on("finish", () => {
            console.log("Finished writing song!")
            resolve()
        })
    })
}

const downloadSong = async (url,downloadsDirectory) => {
    console.log("Starting Download")
    let song = await client.getSongInfo(url)
    await downloadFile(song,downloadsDirectory)
    console.log(`You may know find this song in ${downloadsDirectory}`)
}

main()