const links = []

const addLink = async (link) =>{
    links.push(link)
    return 1
}

const getLink = async () =>{
    if(links.length != 0){
        return links.pop()
    }
    return null
}

const getSize = async () =>{
    return links.length
}

module.exports = {
    addLink: addLink,
    getLink: getLink,
    getSize: getSize
}