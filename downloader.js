const request = require('request')
const fs = require('fs')
const { parentPort } = require('worker_threads')
var NameGenerator = require('name-generator')

var namer = new NameGenerator()


parentPort.on('message', function(url){
    request(url).pipe(fs.createWriteStream(Math.random().toString(36).substring(7))).on('close', ()=> {
        parentPort.postMessage('message', 'job finished daddy')
    })
    /*
    request({url: msg},async function (error, response){
        //In case if you'r asking yourself if this is really async, it is but will depends on the time that we get the answer    
        if(!error){
            var $ = cheerio.load(response.body)                    
            exitFunc($('img').map(async (i, e)=>{                                            
                var src = $(e).attr('src')
                parentPort.postMessage(src)
            }))
        }
    })*/  
})

function exitFunc(){
    process.exit(1)
}
