import "babel-polyfill"
import mongoose from "mongoose";
import Player from '../../src/server/controllers/playerController'

const clearDB = (db) => {
    return new Promise((resolve) => {
        db.dropDatabase(resolve(true))
    })   
}

let db;

describe('PlayerController => ', () => {
    beforeAll(done => {
        db = mongoose.connect('mongodb://127.0.0.1:27017/testing-playerController', { useNewUrlParser: true }).catch(e => {
            if (e) throw e;
        });
        done()
    })
    
    afterAll(async done => {
        await clearDB(db)
        done();
    });

    const name = 'Jean';
    const newName = 'Jeanne';
    const socketId = 'agw45kKnS-aEruVWAAZZ';
    
    test('playerController => findPlayer : invalide', (done) => {
        const findPlayer = Player.findPlayer({ ame: name })
        findPlayer.exec((err, player) => {
            if(err) throw err;
            expect(player).toEqual(null)
            done()
        })
    }, 10000)

    test('playerController => createplayer & findPlayer', async (done) => {
        await Player.createPlayer(name, socketId)
        const findPlayer = Player.findPlayer({ name: name })
        findPlayer.exec((err, player) => {
            if(err) throw err;
            expect(player.name).toEqual(name)
            done()
        })
    }, 10000)

    test('playerController => findPlayer and update', (done) => {
        Player.findPlayerAndUpdate({ name: name }, { $set: { name: newName } }).then((updatedPlayer) => {
            expect(updatedPlayer.name).toEqual(newName)
            done()
        })
    }, 10000)

    test('playerController => remove player', (done) => {
        Player.removePlayer({ name: newName }).then((isRemoved) => {
            expect(isRemoved).toEqual(true)
            done()
        })
    }, 10000)
})