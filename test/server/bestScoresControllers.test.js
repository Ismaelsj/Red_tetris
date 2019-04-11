import "babel-polyfill"
import mongoose from "mongoose";
import BestScores from '../../src/server/controllers/BestScoresController'

const clearDB = (db) => {
    return new Promise((resolve) => {
        db.dropDatabase(resolve(true))
    })   
}

let db;

describe('BestScoresController => ', () => {
    beforeAll(done => {
        db = mongoose.connect('mongodb://127.0.0.1:27017/testing-bestScoresController', { useNewUrlParser: true }).catch(e => {
            if (e) throw e;
        });
        done()
    })
    
    afterAll(async done => {
        await clearDB(db)
        done();
    });

    const nameP1 = 'Jean';
    const nameP2 = 'Ismael';
    const nameP3 = 'Jeanne';
    const difficultyP1 = 500;
    const difficultyP2 = 100;
    const difficultyP3 = 100;
    const modeP1 = 'classic';
    const modeP2 = 'rude';
    const modeP3 = 'rude';
    const scoreP1 = 500;
    const scoreP2 = 99999;
    const scoreP3 = 99998;

    test('bestScoresController => createBestScores', (done) => {
        BestScores.createBestScores(nameP1, difficultyP1, modeP1, scoreP1).then((newBestScore) => {
            expect(newBestScore.playerName).toEqual(nameP1)
        })

        BestScores.createBestScores(nameP2, difficultyP2, modeP2, scoreP2).then((newBestScore) => {
            expect(newBestScore.playerName).toEqual(nameP2)
        })

        BestScores.createBestScores(nameP3, difficultyP3, modeP3, scoreP3).then((newBestScore) => {
            expect(newBestScore.playerName).toEqual(nameP3)
            done()
        })

    }, 10000)

    test('BestScoresController => find player sestScores', (done) => {
        const playerBestScore = BestScores.findPlayerBestScore(nameP1, difficultyP1, modeP1)
        playerBestScore.exec((err, bestScore) => {
            if (err) return ;
            expect(bestScore.playerName).toEqual(nameP1)
            done()
        })
    }, 10000)

    test('BestScoresController => find best scores', (done) => {
        const bestScore = BestScores.findBestScores(difficultyP3, modeP3)
        bestScore.exec((err, bestScore) => {
            if (err) return ;
            expect(bestScore[0].playerName).toEqual(nameP2)
            done()
        })
    }, 10000)

    test('BestScoresController => find best player scores and update', async (done) => {
        const newScore = 1000 
        const newBestScore = await BestScores.findBestScoresAndUpdate(nameP1, difficultyP1, modeP1, newScore)
        expect(newBestScore.score).toEqual(newScore)
        done()
    }, 10000)

    test('BestScoresController => remove room', (done) => {
        BestScores.removeBestScores({ playerName: nameP1 }).then((isRemoved) => {
            expect(isRemoved).toEqual(true)
            done()
        })
    }, 10000)
})