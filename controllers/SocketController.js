const SocketService = require ('../services/SocketService')

class SocketController {
    connection (wss, ws, message, rooms) {
        rooms = SocketService.connection (wss, ws, message, rooms)
        return rooms
    }

    chating (wss, ws, message, rooms) {
        rooms = SocketService.chating (wss, ws, message, rooms)
        return rooms
    }

    chatingWithFiles (wss, ws, message, rooms) {
        rooms = SocketService.chatingWithFiles (wss, ws, message, rooms)
        return rooms
    }

    async disconnect (wss, ws, message, rooms) {
        rooms = await SocketService.disconnect (wss, ws, message, rooms)
        return rooms
    }
}

module.exports = new SocketController ()