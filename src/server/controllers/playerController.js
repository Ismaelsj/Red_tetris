import playerModel from '../../models/player'

export default class Player {

    static async createPlayer(playerName, socektId) {
        try {
                // create player
            const newPlayer = new playerModel({
                name: playerName,
                socketId: socektId,
            }) // save
            const savedNewPlayer = await newPlayer.save()

            return savedNewPlayer

        } catch(err) {
            throw err
        }
    }

    static findPlayer(searchObj) {
        return playerModel.findOne(searchObj)
    }

    static findPlayerAndUpdate(searchObj, optObj) {
        return new Promise((resolve, reject) => {
            playerModel.findOneAndUpdate(searchObj, optObj, {new: true}, (err, update) => {
                if (err) {
                    reject(err)
                    return ;
                }
                resolve(update)
            })
        })
    }

    static removePlayer(searchObj) {
        return new Promise((resolve, reject) => {
            playerModel.findOneAndDelete(searchObj, (err) => {
                if (err) {
                    reject(err);
                    return ;
                }
                resolve(true)
            })
        })
    }
}