    // redux
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'   
   
    // reducers
import errorReducer from '../reducers/errorReducer'
import userReducer from '../reducers/userReducer'
import roomReducer from '../reducers/roomReducer'
import gameReducer from '../reducers/gameReducer'
import validationLoginReducer from '../reducers/validationLoginReducer'
import valdationRoomReducer from '../reducers/valdationRoomReducer'

import socketMiddleware from './socketMiddleware'
    
const templateEmptyBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
    
const allreducer = combineReducers({
    error: errorReducer,
    user: userReducer,
    room: roomReducer,
    game: gameReducer,
    login: validationLoginReducer,
    changeRoom: valdationRoomReducer,
})

const initialStore = {
    error: {
        intenalError: false
    },
    user: {
        userName: '',
        isAuth: false,
        socket: null,
        room: '',
    },
    room: {
        roomName: null,
        userName: '',
        players: null,
        isManager: false,
        conversation: [],
        isChanging: false,
        msgNot: 0,
    },
    game: {
        Game: null,
        Score: 0,
        Malus: 0,
        isPlaying: false,
        Pieces: [],
        GameHistory: [],
        GameBoard: {
            player: templateEmptyBoard,
            opponent: templateEmptyBoard
        }
    },
    login: {
        socket: null,
        logginOut: false,
        userName: '',
        roomName: '',
        isValid: false,
        isUsed: false,
        errMsg: ''
    },
    changeRoom: {
        isValid: false,
        errMsg: ''
    }
}

const store = (socket, initStore = initialStore) => createStore(
    allreducer,
    initStore,
    compose(
        applyMiddleware(
            socketMiddleware(socket),
            thunk
            ),
    )
)

export default store