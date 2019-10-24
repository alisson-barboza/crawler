const request = require('request')
const fs = require('fs')
const { parentPort } = require('worker_threads')

parentPort.on('message', function (url) {
    request(url).pipe(fs.createWriteStream(
        Math.random()
        .toString(36)
        .substring(7)))
        .on('close', () => {
            parentPort.postMessage('message', 'Done')
        });
});
