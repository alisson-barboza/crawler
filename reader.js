const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const {
    Worker, isMainThread, parentPort, MessageChannel, SharedArrayBuffer
} = require('worker_threads');

parentPort.on('message', (msg)=>{
    console.log('msg received')
    request({url: msg},async function (error, response, html){
        //In case if you'r asking yourself if this is really async, it is but will depends on the time that we get the answer    
        if(!error){

            
            var $ = cheerio.load(html)
            
            exitFunc($('img').map(async (i, e)=>{                                            
                var src = $(e).attr('src')
                if(src.startsWith('http')){
                    parentPort.postMessage(src)    
                }else{
                    console.log('não tem http')
                }
                
            }))
        }else{
            console.log('Oh man something went wrong down here')
            console.log('Something wrong: ' + error)
        }
    })  
})

function exitFunc(){
    process.exit(1)
}
