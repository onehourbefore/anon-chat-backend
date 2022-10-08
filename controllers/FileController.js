const FileService = require ('../services/FileService')
const RoomService = require ('../services/RoomService')


class FileController {
    uploadFile (req, res, rooms) {
        try {
            if (!req.body.dirName || !req.files || !req.body.messID) {
                return res.status (400).json ({message: 'Upload error'})
            }
    
            const { dirName, messID } = req.body
            const uploadedFiles = req.files.uploadedFiles
    
            let currentRoom = RoomService.getCurrentRoom (rooms, dirName)
            currentRoom.files = [
                ...currentRoom.files, 
                {messID: req.body.messID, messFiles: []}
            ]

            for (let i = 0; i < rooms.length; i++) {
                if (rooms[i].roomID === dirName) {
                    let room

                    if (uploadedFiles.name) {
                        room = FileService.addFile (uploadedFiles, dirName, messID, currentRoom)
                        rooms[i] = room
                    }
            
                    for (let i = 0; i < uploadedFiles.length; i++) {
                        room = FileService.addFile (uploadedFiles [i], dirName, messID, currentRoom)
                        rooms[i] = room
                    }

                    res.status (200).json (currentRoom.files)
                    return rooms
                }
            }
    
        } catch (e) {
            console. log (e)
            res.status (400).json ({message: 'Upload error'})
        }
    }
}

module.exports = new FileController ()