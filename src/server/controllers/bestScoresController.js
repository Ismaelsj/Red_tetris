import bestScoresModel from '../../models/bestScore'

export default class BestScores {

    static createBestScores(playerName, difficulty, mode, score) {
        return new Promise(async (resolve) => {
                // create player
            const newBestScores = new bestScoresModel({
                playerName,
                difficulty,
                mode,
                score,
                date: Date.now()
            }) 
                // save
            const savedNewBestScores = await newBestScores.save()

            resolve(savedNewBestScores)
        })
    }

    static findPlayerBestScore(playerName, difficulty, mode) {
        return bestScoresModel.findOne({ playerName, difficulty, mode })
    }

    static findBestScores(difficulty, mode) {
        return bestScoresModel.find({ difficulty, mode }).sort({ score: -1 })
    }

    static findBestScoresAndUpdate(playerName, difficulty, mode, score) {
        return new Promise((resolve, reject) => {
            bestScoresModel.findOneAndUpdate(
                { playerName, difficulty, mode }, 
                { $set: { score, date: Date.now() } },
                {new: true}, 
                (err, update) => {
                if (err) {
                    reject(err);
                    return ;
                }
                resolve(update)
            })
        })
    }

    static removeBestScores(searchObj) {
        return new Promise((resolve, reject) => {
            bestScoresModel.findOneAndDelete(searchObj, (err) => {
                if (err) {
                    reject(err)
                    return ;
                };
                resolve(true)
            })
        })
    }
}
