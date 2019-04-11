import "babel-polyfill"
import mongoose from "mongoose";
import Game from '../../src/server/controllers/gameController'

const clearDB = (db) => {
    return new Promise((resolve) => {
        db.dropDatabase(resolve(true))
    })   
}

let db;

describe('GameController => connected', () => {
    beforeAll(done => {
        db = mongoose.connect('mongodb://127.0.0.1:27017/testing-gameController', { useNewUrlParser: true }).catch(e => {
            if (e) throw e;
        });
        done()
    })
    
    afterAll(async done => {
        await clearDB(db)
        done();
    });

    const gameType = 'classic';
    const difficulty = 500;
    let gameId;

    test('GameController => createGame & findGame', async (done) => {
        const newGame = await Game.createGame(gameType, difficulty)
        gameId = newGame._id
        const findGame = Game.findGame({ _id: newGame._id })
        findGame.exec((err, game) => {
            if(err) throw err;
            expect(game._id).toEqual(gameId)
            done()
        })
    }, 10000)

    test('GameController => findGame and update', (done) => {
        const newGameType = 'rude'
        Game.findGameAndUpdate({ _id: gameId }, { $set: { gameType: newGameType } }).then((updatedGame) => {
            expect(updatedGame.gameType).toEqual(newGameType)
            done()
        })
    }, 10000)

    test('GameController => remove room', (done) => {
        Game.removeGame({ _id: gameId }).then((isRemoved) => {
            expect(isRemoved).toEqual(true)
            done()
        })
    }, 10000)
})