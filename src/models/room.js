import mongoose from "mongoose";
import Game from '../server/controllers/gameController'

import { find, propEq, isNil, remove } from 'ramda'

const roomToRemove = []

const roomShema = new mongoose.Schema({
    name: { 
        type: String, 
        default: '' 
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        default: null
    }],
    isPlaying: {
        type: Boolean,
        default: false
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        default: null
    },
    gameHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        default: null
    }],
    owner: {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            default: null
        },
        isConnected: {
            type: Boolean,
            default: true
        }
    }
})

roomShema.post('findOneAndUpdate', async (room) => {
    const stopDestory = find(propEq('roomName', room.name))(roomToRemove)
    if (!room) {
    } else if (!isNil(stopDestory)) {
            // stop removing room
        clearTimeout(stopDestory.timeOut)
        remove(stopDestory, roomToRemove)
    } else if (room.owner.isConnected === false && room.players.length <= 0) {
            // set timeout to remove room
        const removeTimeout = setTimeout(async () => {
            await Game.removeGame({ _id: room.game })
            room.gameHistory.forEach(async gameId => {
                await Game.removeGame({ _id: gameId })
            });
            room.remove()
        }, 30000)
        roomToRemove.push({ roomName: room.name, timeOut: removeTimeout })
    }
})

export default mongoose.model('Room', roomShema)