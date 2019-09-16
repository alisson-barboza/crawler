const fs = require('fs')
const { Worker } =  require('worker_threads')
const buffer = require('./buffer.js')
const readline = require('readline')
require('events').defaultMaxListeners = 10000

var readerQtd = 0
var downloaderQtd = 0
const urls = []

var rd = readline.createInterface({
    input: fs.createReadStream('./tj.txt'),
    output: process.stdout,
    console: false
})


rd.on('line', function(line) {
    urls.push(line)
}).on('close', function(line) {
    start(urls)
    checkIfProgramEnded(4000)
})



async function start(urls){
    for (const url of urls) {
        const reader = await getFreeReader()
        setReader(reader, url)
    }    
}
//Sending a msg with the URL to Reader thread
function setReader(reader, msg){
    reader.postMessage(msg)
    readerQtd--
    reader.on('message', async msg =>{
        await buffer.addLink(msg)       
        startDownloadingProcess()
    })
}

//Function to check if the program can end
async function checkIfProgramEnded(time){
    setTimeout(()=>{
        if(readerQtd === 0 && downloaderQtd === 0){
            console.log('Ending...')
            setTimeout(()=>{
                process.exit()
            }, 4000)
            
        }else{
            checkIfProgramEnded(time)
        }
    },time)
}

async function startDownloadingProcess(){
    var downloader = await getFreeDownloader()
    if(downloader !== null){
        var link = await buffer.getLink()
        if(link !== null){
            console.log('Downloading img from: ' + link)
            setDownloader(downloader, link)            
        }
    }                
}

async function setDownloader(downloader, link){  
    downloader.postMessage(link)
    downloader.on('message', (msg)=>{
        downloaderQtd--
    })
}

async function getFreeDownloader(){
    console.log('Creating Downloader thread number: ' + downloaderQtd)
    downloaderQtd++
    return createDownloader()    
}

function createDownloader(){
    return new Worker('./downloader.js')
}

async function getFreeReader(){
    console.log('Creating Reader thread')
    readerQtd++
    return createReader()
}

function createReader(){
    return new Worker('./reader.js')
}