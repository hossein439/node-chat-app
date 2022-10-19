const generateMessage = (username = 'Unknown User', text) => {
    return {
        text,
        createAt: new Date().getTime(),
        username,
    } 
}


const generateLocationMessage = (username = 'Unknown User', url) => {
    return {
        url,
        createAt: new Date().getTime(),
        username
    }
}


module.exports = {
    generateMessage,
    generateLocationMessage
}