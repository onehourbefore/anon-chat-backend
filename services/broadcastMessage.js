class broadcastMessage {
    sendMess (wss, message, roomID) {
        wss.clients.forEach (client => {
            if (client.id === roomID) {
                client.send (JSON.stringify (message))
            }
        })
    }
}

module.exports = new broadcastMessage ()