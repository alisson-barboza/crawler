const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const {
    Worker, isMainThread, parentPort, MessageChannel, SharedArrayBuffer
} = require('worker_threads');

parentPort.on('message', (msg)=>{
    
    request({url: msg},async function (error, response){
        //In case if you'r asking yourself if this is really async, it is but will depends on the time that we get the answer    
        if(!error){
            var $ = cheerio.load(response.body)                    
            exitFunc($('img').map((i, e)=>{                                            
                var src = $(e).attr('src')
                parentPort.postMessage(src)
            }))
        }
    })  
})

function exitFunc(){
    process.exit(1)
}
