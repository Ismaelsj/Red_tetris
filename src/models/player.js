import mongoose from "mongoose";

const playerShema = new mongoose.Schema({
    name: { 
        type: String, 
        default: '' 
    },
    socketId: { 
        type: String,
        default: ''
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null
    },
    isDisconnected: {
        type: Boolean,
        default: false
    },
    defaultRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null
    } 
})

playerShema.post('findOneAndUpdate', async (player) => {
    if (!player) {
    } else if (player.isDisconnected === true) {
        player.remove()
    }
})

export default mongoose.model('Player', playerShema)