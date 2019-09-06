const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')

const urlG = 'http://www.unicap.br/home/'

request({url: urlG},(error, response)=>{
    if(!error){    
        var $ = cheerio.load(response.body)
    
        $('img').map((i, e)=>{            
            //Use this in case of the src doenst contains all the url path
            //var src = urlG.concat($(e).attr('src'))
            var src = $(e).attr('src')
            console.log(src)                        
        })
    }
})