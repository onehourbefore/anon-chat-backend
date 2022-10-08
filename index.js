const express = require ('express')
const fileUpload = require ('express-fileupload')
const app = express ()
const cors = require ('cors')
const ws = require ('ws')
const FileController = require ('./controllers/FileController')
const SocketController = require ('./controllers/SocketController')

const WS_PORT = 5000
const HTTP_PORT = 5001

let rooms = []

app.use (cors ())
app.use (fileUpload ())
app.use (express.static ('static'))

app.post ('/upload', (req, res) => {
    rooms = FileController.uploadFile (req, res, rooms)
})

app.listen (HTTP_PORT, (err) => err 
    ? console. log (err.message) 
    : console. log (`HTTP Server started on ${HTTP_PORT}`
))


const wss = new ws.Server (
    {port: WS_PORT},
    () => {
        try {
            console. log ('WS server started on 5000')
        } catch (e) {
            console.log (e.message)
        }
    }
)

wss.on ('connection', (ws) => {
    ws.on ('message', async (message) => {
        message = JSON.parse (message)

        switch (message.event) {
            case 'connection':
                rooms = SocketController.connection (wss, ws, message, rooms)
                break

            case 'chating':
                rooms = SocketController.chating (wss, ws, message, rooms)
                break

            case 'chating-with-files':
                setTimeout (() => {
                    rooms = SocketController.chatingWithFiles (wss, ws, message, rooms)
                }, 4000)
                break

            case 'disconnect':
                rooms = await SocketController.disconnect (wss, ws, message, rooms)
                break
                
            default: 
                break
        }
    })
})