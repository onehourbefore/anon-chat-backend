
class RoomService {
    getCurrentRoom (rooms, dirName) {
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].roomID === dirName) {
                return rooms[i]
            }
        }
    }
}

module.exports = new RoomService ()