const { v4 } = require ('uuid')
const path = require ('path')

class FileService {
    addFile (file, dirName, messID, room) {
        try {
            const from = file.name.length - 4
            // т.к файлы только .mp3 или .jpg (4 символа)
            const fileName = v4 () + file.name.slice (from)
            const filePath = path.resolve (`static/${dirName}`, fileName)
            file.mv (filePath)

            for (let j = 0; j < room.files.length; j++) {
                if (messID === room.files[j].messID) {
                    room.files[j].messFiles = [
                        ...room.files[j].messFiles,
                        {
                            name: file.name, 
                            file: fileName, 
                            path: filePath
                        }
                    ]
                }
            }
            return room
        } catch (e) {
            console. log (e.message)
        }
    }
}

module.exports = new FileService ()