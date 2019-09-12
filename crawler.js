const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const { Worker } =  require('worker_threads')
const eventEmitter = require('events');

const urls = ['https://blog.rico.com.vc/melhores-fundos-imobiliarios', 'https://www.google.com.br/',
'https://lushpin.com/', 'https://www.youtube.com/']

const links = []
const readerList = []
const downloaderList = []

for(let i = 0; i < 5; i++){     
    let workerObject = {
        worker: createReader(),
        inUse: false
    }
    readerList.push(workerObject)
}

//getting the img src path to download
urls.forEach(url => {
    setReader(getFreeReader(), url)
})

// Creating downloaders
for(let i = 0 ; i < 3; i++){
    let downloader = {
        worker: createDownloader(),
        inUse: false
    }
    downloaderList.push(downloader)
}

function setReader(reader, msg){   
    console.log('Reader sending')
    reader.worker.postMessage(msg)
    reader.worker.on('message', async msg =>{
        pushIntoLinks(msg)
    })
    reader.worker.on('exit', code =>{
        reader.inUse = false
    })
}

async function setDownloader(downloader, link){  
    console.log('Message sent')  
    downloader.worker.postMessage(link)
    downloader.worker.on('exit', async code =>{
        console.log('exited')
        downloader.inUse = false
    })
    
}

function getFreeDownloader(){
    for(let i = 0; i < downloaderList.length ; i++){
        if(downloaderList[i].inUse === false){
            downloaderList[i].inUse = true
            return downloaderList[i]
        }
    }
}

async function startDownloadingProcess(){
    while(links.length !== 0){        
        var downloader = await getFreeDownloader()
        if(downloader){
            var link = await gimmeOneLink()
            setDownloader(downloader, link)        
        }        
    }
}

//Function to check if the size of links buffer isnt equal to zero and then, start the downloading process
checkStartDownloading(4000)
async function checkStartDownloading(time){
    console.log('Checking if can start, size: ' + links.length)
    setTimeout(async ()=>{
        if(links.length !== 0){
            startDownloadingProcess()
        }else{
            checkStartDownloading(time/2)
        }
    },time)
}

function getFreeReader(){
    for(let i = 0; i < readerList.length ; i++){
        if(readerList[i].inUse === false){
            readerList[i].inUse = true
            return readerList[i]
        }
    }
}

function createReader(){
    return new Worker('./reader.js')
}

function createDownloader(){
    return new Worker('./downloader.js')
}

function gimmeOneLink(){
    if(links.length != 0){
        return links.pop()
    }else{
        return null
    }    
}

function pushIntoLinks(link){
    links.push(link)
}