const request = require('request')
const cheerio = require('cheerio')
var getImageUrls = require('get-image-urls')

const url = 'http://www.unicap.br/home/'

console.log(getImageUrls(url, (err, images)=>{
    if(!err){
        console.log(images)
    }

}))
/*
request({url: url},(error, response)=>{
    if(error){
        console.log('Error' + error)
    }
    else{
        var $ = cheerio.load(response.body)
        
        //console.log('Img TAG: ' + $('img'))
        $('img').each(()=>{
            console.log($(this).find('src').prop('src'))
        })
            
            
        
    }

})*/