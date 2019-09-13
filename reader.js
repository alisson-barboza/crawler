const request = require('request')
const cheerio = require('cheerio')
const { parentPort } = require('worker_threads');

parentPort.on('message', (msg)=>{
    request({url: msg},async function (error, response, html){
        //In case if you'r asking yourself if this is really async, it is but will depends on the time that we get the answer    
        if(!error){            
            var $ = cheerio.load(html)            
            exitFunc($('img').map(async (i, e)=>{                                            
                var src = $(e).attr('src')
                if(src.startsWith('http')){
                    await parentPort.postMessage(src)    
                }else{
                    console.log('não tem http')
                }
                
            }))
        }else{
            console.log('Something wrong: ' + error)
        }
    })  
})

function exitFunc(){
    process.exit(1)
}
