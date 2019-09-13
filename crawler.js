const { Worker } =  require('worker_threads')
require('events').defaultMaxListeners = 10000

const urls = [/*'https://blog.rico.com.vc/melhores-fundos-imobiliarios', 'https://www.google.com.br/',
'https://lushpin.com/',*/ 'https://www.youtube.com/']

const links = []
const workerList = []
createDownloaders()
function createDownloaders(){
    for(let i=0; i< 10; i++){
        let downloader = {
            worker: createDownloader(),
            inUse: false
        }
        workerList.push(downloader)
    }
}

//getting the img src path to download
start(urls)
async function start(urls){
    for(let i=0 ; i< urls.length ; i++){
        setReader(await getFreeReader(), urls[i])
    }    
}


function setReader(reader, msg){
    console.log('Sent: ' + msg)
    reader.postMessage(msg)
    reader.on('message', async msg =>{
        links.push(msg)        
        //TODO remind myself to do and observable to look for changes in the array and start the downloading process
    })    
}


async function setDownloader(downloader, link){  
    console.log('Message sent')  
    downloader.worker.postMessage(link)
    downloader.worker.on('exit', ()=>{
        downloader.inUse = false
    })
}


async function startDownloadingProcess(){
    for (const i of links) {
        var downloader = await getFreeDownloader()
        if(downloader !== null){
            var link = await gimmeOneLink()
            if(link){
                setDownloader(downloader, link)
                startDownloadingProcess()
            }
        }else{
            checkStartDownloading(5000)
        }        
    }
}

//Function to check if the size of links buffer isnt equal to zero and then, start the downloading process
checkStartDownloading(4000)
async function checkStartDownloading(time){
    console.log('Checking if can start, size: ' + links.length)
    setTimeout(()=>{
        if(links.length != 0){
            startDownloadingProcess()
        }else{
            checkStartDownloading(time/2)
        }
    },time)
}

function getFreeReader(){
    return createReader()
}


function getFreeDownloader(){
    //return createDownloader()
    
    for(i = 0; i < workerList.length; i++ ){
        if(workerList[i].inUse === false){
            workerList[i].inUse = true
            return workerList[i]
        }
    }
    return null
    
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
