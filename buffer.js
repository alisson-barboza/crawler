var links = []

const addLink = async (link) => {
    if(link !== null && link !== undefined){
        links.push(link);
        return true;
    }
    return false;
}

const getLink = async () => {
    if (links.length != 0) {
        return links.pop();
    }
    return null;
}

const getSize = async () => {
    return links.length;
}

module.exports = {
    addLink: addLink,
    getLink: getLink,
    getSize: getSize
}