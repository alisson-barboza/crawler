const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const { Worker, isMainThread, parentPort, MessageChannel, SharedArrayBuffer } =  require('worker_threads')

const urls = [/*'https://blog.rico.com.vc/melhores-fundos-imobiliarios', 'https://www.google.com.br/',*/
'http://www.unicap.br/home/', 'https://www.youtube.com/']


var links = []
const workerList = []
   

for(let i = 0; i < 5; i++){     
    let workerObject = {
        worker: createReaderWorker(),
        inUse: false
    }
    workerList.push(workerObject)
}


urls.forEach(url => {
    setWorkerToWork(getFreeWorker(), url)
})


function setWorkerToWork(reader, msg){    
    reader.worker.postMessage(msg)
    reader.worker.on('message', msg =>{
        console.log(msg)
        links.push(msg)
    })
    reader.worker.on('exit', code =>{
        reader.inUse = false
    })
}

function getFreeWorker(){
    for(let i = 0; i < workerList.length ; i++){
        if(workerList[i].inUse === false){
            workerList[i].inUse = true
            return workerList[i]
        }
    }
}

function createReaderWorker(){
    return new Worker('./worker.js')
}
