const { parentPort } = require('worker_threads');

parentPort.on('message', (url) =>{
    console.log('received')
    exitFunction(console.log(url))
    
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

function exitFunction(){
    process.exit(1)
}
