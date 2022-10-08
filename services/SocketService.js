const { v4 } = require ('uuid')
const broadcastMessage = require ('../services/broadcastMessage')
const fs = require ('fs')
const path = require ('path')


class SocketService {
    connection (wss, ws, message, rooms) {
        if (rooms.length !== 0) {
            for (let i = 0; i < rooms.length; i++) {
                if ( 
                    rooms[i].users.second === null && 
                    (rooms[i].users.first.gender.opponentGender === message.user.gender.userGender || 
                    rooms[i].users.first.gender.opponentGender === 'Не важно')
                ) {
                    for (let j = 0; j < rooms[i].users.first.age.opponentAge.length; j++) {
                        if (rooms[i].users.first.age.opponentAge [j] === message.user.age.userAge) {
                            rooms[i].users.second = message.user
                            ws.id = rooms[i].roomID
                            message = {
                                status: 'ready', 
                                content: 'Начинайте общение!',
                                roomID: rooms[i].roomID
                            }
                            const dirName = rooms[i].roomID
                            fs.mkdirSync (`static/${dirName}`, (err) => {
                                if (err) {
                                    throw new Error (err.message)
                                }
                                console. log (`Dir ${dirName} created`)
                            })
                            broadcastMessage.sendMess (wss, message, rooms[i].roomID)
                            return rooms
                        }
                    }
                }
            }
        }
        const newRoom = {
            roomID: v4 (),
            users: {
                first: message.user, 
                second: null
            },
            messages: [],
            files: []
        }
        rooms.push (newRoom)
        ws.id = newRoom.roomID
        message = {
            status: 'wait', 
            content: 'Ожидание собеседника...'
        }
        broadcastMessage.sendMess (wss, message, newRoom.roomID)
        return rooms
    }

    chating (wss, ws, message, rooms) {
        for (let i = 0; i < rooms.length; i++) {
            if (ws.id === rooms[i].roomID) {
                rooms[i].messages.push (message)
            }
        }
        message.status = 'chating'
        broadcastMessage.sendMess (wss, message, ws.id)
        return rooms
    }

    chatingWithFiles (wss, ws, message, rooms) {
        for (let i = 0; i < rooms.length; i++) {
            if (ws.id === rooms[i].roomID) {
                for (let j = 0; j < rooms[i].files.length; j++) {
                    if (rooms[i].files[j].messID === message.messID) {
                        message.files = rooms[i].files[j].messFiles
                        message.status = 'chating'
                        rooms[i].messages.push (message)
                        broadcastMessage.sendMess (wss, message, ws.id)
                    }
                }
            }
        }
        return rooms
    }

    disconnect (wss, ws, message, rooms) {
        return new Promise ((resolve, reject) => {
            for (let i = 0; i < rooms.length; i++) {
                if (ws.id === rooms[i].roomID) {
                    message.status = 'disconnect'
                    broadcastMessage.sendMess (wss, message, rooms[i].roomID)
                    
                    fs.readdir (`static/${ws.id}`, (err, files) => {
                        if (err) throw new Error (err.message)
                        if (files.length !== 0) {
                            for (const file of files) {
                                fs.unlink (path.join (`static/${ws.id}/`, file), err => {
                                    if (err) {
                                        throw new Error (err.message)
                                    } else {
                                        console. log ('delete success')
                                    }
                                })
                            }
                            fs.rmdir (`static/${ws.id}`, (err) => {
                                if (err) throw new Error (err.message)
                                rooms = rooms.filter (room => room.roomID !== ws.id)
                                ws.close ()
                                resolve (rooms)
                            })
                        }
    
                        fs.rmdir (`static/${ws.id}`, (err) => {
                            if (err) throw new Error (err.message)
                            rooms = rooms.filter (room => room.roomID !== ws.id)
                            ws.close ()
                            resolve (rooms)
                        })
                    })
                }
            }
        })
    }
}

module.exports = new SocketService ()