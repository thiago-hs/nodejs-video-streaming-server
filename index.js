const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path'); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

app.get('/video', (req, res) => {
    const range = req.headers.range;

    if(!range)
        res.status(400).send("Requires Range Header");
   
    const videoPath = "Chocolate Rain Original Song by Tay Zonday_360p.mp4";
    const videoSize = fs.statSync(videoPath).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g,""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    console.log(`${start}-${end} video chunk requested`);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });

    videoStream.pipe(res);
});

app.listen(8000, () => {
    console.log('Node.js video streaming server listening on port 8000');
});