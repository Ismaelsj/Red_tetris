import mongoose from "mongoose";

const bestScoresShema = new mongoose.Schema({
    playerName: {
        type: String,
        default: ''
    },
    score: {
        type: Number,
        default: 0,
    },
    difficulty: {
        type: String,
        default: 'easy'
    },
    mode: {
        type: String,
        default: 'classic'
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('BestScores', bestScoresShema)