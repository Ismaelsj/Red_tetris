import gameModel from '../../models/game'

export default class Game {

    static createGame(gameType, difficulty) {
        return new Promise(async (resolve, reject) => {
            try {
                    // create player
                const newGame = new gameModel({
                    gameType: gameType,
                    difficulty: difficulty
                }) 
                    // save
                const savedNewGame = await newGame.save()

                resolve(savedNewGame)

            } catch(err) {
                reject(err)
            }
        })
    }

    static findGame(searchObj) {
        return gameModel.findOne(searchObj)
    }

    static findGameAndUpdate(searchObj, optObj) {
        return new Promise((resolve, reject) => {
            gameModel.findOneAndUpdate(searchObj, optObj, {new: true}, (err, update) => {
                if (err) {
                    reject(err);
                    return ;
                }
                resolve(update)
            })
        })
    }

    static removeGame(searchObj) {
        return new Promise((resolve, reject) => {
            gameModel.findOneAndDelete(searchObj, (err) => {
                if (err) {
                    reject(err)
                    return ;
                };
                resolve(true)
            })
        })
    }
}