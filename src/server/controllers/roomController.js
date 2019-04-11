import roomModel from '../../models/room'

export default class Room {

    static createRoom(roomName, playerId) {
        return new Promise(async (resolve, reject) => {
            try {
                    // create room
                const newRoom = new roomModel({
                    name: roomName,
                    players: playerId,
                    owner: {
                        ownerId: playerId
                    }
                }) 
                    // save
                const savedNewRoom = await newRoom.save()
                resolve(savedNewRoom)
                return ;

            } catch(err) {
                reject(err)
            }
        })
    }

    static findRoom(searchObj) {
        return roomModel.findOne(searchObj)
    }

    static findRoomAndUpdate(searchObj, optObj) {
        return new Promise((resolve, reject) => {
            roomModel.findOneAndUpdate(searchObj, optObj, {new: true}, (err, update) => {
                if (err) reject(err);
                resolve(update)
            })
        })
    }

    static removeRoom(searchObj) {
        return new Promise((resolve, reject) => {
            roomModel.findOneAndDelete(searchObj, (err) => {
                if (err) {
                    reject(err);
                    return ;
                }
                resolve(true)
            })
        })
    }
}