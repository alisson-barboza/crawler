const { Worker } =  require('worker_threads')
const buffer = require('./buffer.js')
require('events').defaultMaxListeners = 10000

var readerQtd = 0
var downloaderQtd = 0

const urls = ['https://blog.rico.com.vc/melhores-fundos-imobiliarios', 'https://www.google.com.br/',
'https://lushpin.com/', 'https://www.youtube.com/']

//Starting the whole thing
start(urls)
async function start(urls){
    for (const url of urls) {
        const reader = await getFreeReader()
        setReader(reader, url)
    }    
}
//Sending a msg with the URL to Reader thread
function setReader(reader, msg){
    reader.postMessage(msg)
    reader.on('message', async msg =>{
        await buffer.addLink(msg)       
        startDownloadingProcess()        
    })
}

//Function to check if the size of links buffer isnt equal to zero and then, start the downloading process
//checkStartDownloading(4000)
async function checkStartDownloading(time){
    console.log('Checking if can start, size: ' + buffer.getSize())
    setTimeout(()=>{
        if(buffer.getSize() != 0){
            startDownloadingProcess()
        }else{
            checkStartDownloading(time/2)
        }
    },time)
}

async function startDownloadingProcess(){
    console.log('Starting downloading process')
    var downloader = await getFreeDownloader()
    if(downloader !== null){
        var link = await buffer.getLink()
        if(link !== null){
            setDownloader(downloader, link)            
        }
    }                
}

async function setDownloader(downloader, link){  
    console.log('Message sent')  
    downloader.postMessage(link)
}

async function getFreeDownloader(){
    return createDownloader()
    /*
    for(i = 0; i < workerList.length; i++ ){
        if(workerList[i].inUse === false){
            workerList[i].inUse = true
            return workerList[i]
        }
    }
    return null
    */
}

function createDownloader(){
    return new Worker('./downloader.js')
}

async function getFreeReader(){
    return createReader()
}

function createReader(){
    return new Worker('./reader.js')
}