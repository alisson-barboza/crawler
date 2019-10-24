const request = require('request')
const cheerio = require('cheerio')
const { parentPort } = require('worker_threads');

parentPort.on('message', (msg) => {
    console.log('Requesting on URL: ' + msg);
    request({ url: msg }, async (error, response, html) => {
        if (!error) {
            var $ = cheerio.load(html);
            $('img').map((i, e) => {
                var src = $(e).attr('src');
                
                if (src.startsWith('http')) {
                    parentPort.postMessage(src);
                } else {
                    var imgLink = src;
                    parentPort.postMessage(msg + imgLink);
                }
            });
        } else {
            console.log('Something went wrong: ' + error);
        }
    });
});
