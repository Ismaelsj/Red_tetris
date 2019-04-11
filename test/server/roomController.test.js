import "babel-polyfill"
import mongoose from "mongoose";
import Room from '../../src/server/controllers/roomController'

const clearDB = (db) => {
    return new Promise((resolve) => {
        db.dropDatabase(resolve(true))
    })   
}

let db;

describe('RoomController => ', () => {
    beforeAll(done => {
        db = mongoose.connect('mongodb://127.0.0.1:27017/testing-roomController', { useNewUrlParser: true }).catch(e => {
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
    const nameP3 = 'Huge';
    const playerIdP1 = new mongoose.Types.ObjectId()
    const playerIdP2 = new mongoose.Types.ObjectId()
    const playerIdP3 = new mongoose.Types.ObjectId()
    const newName = 'Jeanne';
    
    test('roomController => findRoom : invalide', (done) => {
        const findRoom = Room.findRoom({ name: nameP1 })
        findRoom.exec((err, room) => {
            if(err) throw err;
            expect(room).toEqual(null)
            done()
        })
    }, 10000)

    test('roomController => createRoom & findRoom', async (done) => {
        await Room.createRoom(nameP1, playerIdP1)
        await Room.createRoom(nameP2, playerIdP2)
        await Room.createRoom(nameP3, playerIdP3)
        const findRoom = Room.findRoom({ name: nameP1 })
        findRoom.exec((err, room) => {
            if(err) throw err;
            expect(room.name).toEqual(nameP1)
            done()
        })
    }, 10000)

    test('roomController => findRoom and update', (done) => {
        Room.findRoomAndUpdate({ name: nameP1 }, { $set: { name: newName } }).then((updatedRoom) => {
            expect(updatedRoom.name).toEqual(newName)
            done()
        })
    }, 10000)

    test('roomController => remove room', (done) => {
        Room.removeRoom({ name: newName }).then((isRemoved) => {
            expect(isRemoved).toEqual(true)
            done()
        })
    }, 10000)

    test('roomController => remove & recover room', async (done) => {
            // set room owner to disconnected
        await Room.findRoomAndUpdate({ name: nameP2 }, { $set: { owner: { isConnected: false } } })
            /// set room's players to 0
        await Room.findRoomAndUpdate({ name: nameP2 }, { $pull: { players: playerIdP2 } })

        setTimeout(() => {
            const findRoom = Room.findRoom({ name: nameP2 })
            findRoom.exec((err, room) => {
                if(err) throw err;
                expect(room.name).toEqual(nameP2)
                done()
            })
        }, 65000)

        await Room.findRoomAndUpdate({ name: nameP2 }, { $push: { players: playerIdP2 } })
    }, 70000)

    test('roomController => remove room after default timeOut', async (done) => {
            // set room owner to disconnected
        await Room.findRoomAndUpdate({ name: nameP3 }, { $set: { owner: { isConnected: false } } })
            /// set room's players to 0
        await Room.findRoomAndUpdate({ name: nameP3 }, { $pull: { players: playerIdP3 } })

        setTimeout(() => {
            const findRoom = Room.findRoom({ name: nameP3 })
            findRoom.exec((err, room) => {
                if(err) throw err;
                expect(room).toBeNull()
                done()
            })
        }, 80000)
    }, 90000)
})