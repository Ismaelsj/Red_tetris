    // redux actions
import { logoutUser } from '../actions/logoutUser'
import { logginOutUser } from '../actions/logginOut'
import { changeRoom } from '../actions/changeRoom'
import { roomChanged } from '../actions/roomChanged'

    // routes
import history from './history';

    // socket event
import { SERVER_INTERNAL_ERROR,
    SERVER_USER_INVALIDE_NAME,
    SERVER_USER_VALIDE_NAME,
    SERVER_USER_DISCONNECT,
    SERVER_USER_LEAVE_ROOM,
    SERVER_USER_JOIN_ROOM,
    SERVER_ROOM_NOT_FOUND,
    SERVER_USER_CHANGE_ROOM,
    SERVER_RES_MESSAGE,
    SERVER_START_GAME,
    SERVER_PAUSE_GAME,
    SERVER_STOP_GAME,
    SERVER_THE_WINNER_IS,
    SERVER_RES_UPDATE_BOARD,
    SERVER_INCOMMING_PIECES,
    SERVER_INCOMMING_REPLACEMENT_PIECES,
    SERVER_GIVE_MALUS,
    CLIENT_STOP_GAME,
    CLIENT_PAUSE_GAME } from '../../server/socketEvent'

import { startGame } from '../actions/startGame';
import { stopGame } from '../actions/stopGame';
import { pauseGame } from '../actions/pauseGame';
import { updatePlayerBoard } from '../actions/updatePlayerBoard';

import moves from './tetrisMoves'

const gameKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ']

const socketMiddleware = socket => ({ dispatch, getState }) => {

    window.onbeforeunload = () => {
        const { isPlaying } = getState().game
        const { roomName } = getState().room
        if (isPlaying) {
            socket.emit(CLIENT_STOP_GAME, { roomName: roomName })
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const { roomName } = getState().room
            socket.emit(CLIENT_PAUSE_GAME, { roomName: roomName });
        }
        if (getState().game.Game === null || !gameKeys.includes(event.key)) return;
        moves(dispatch, getState, event.key, socket, 'playerMoves')
    }, true);

    socket.on(SERVER_INTERNAL_ERROR, (data) => dispatch(data))
        // connection
    socket.on(SERVER_USER_INVALIDE_NAME, data => invalideLogin(dispatch, data))
    socket.on(SERVER_USER_VALIDE_NAME, data => valideLogin(dispatch, data, socket))
        // url change
    socket.on(SERVER_USER_DISCONNECT, data => logout(dispatch, data))

        // room
    socket.on(SERVER_ROOM_NOT_FOUND, data => dispatch(data))
    socket.on(SERVER_USER_JOIN_ROOM, data => dispatch(data))
    socket.on(SERVER_USER_LEAVE_ROOM, data => dispatch(data))
        // url change
    socket.on(SERVER_USER_CHANGE_ROOM, data => changeGame(dispatch, data))

        // message
    socket.on(SERVER_RES_MESSAGE, data => dispatch(data))

        // game
    socket.on(SERVER_START_GAME, (data) => start_Game(dispatch, getState, socket, data))
    socket.on(SERVER_PAUSE_GAME, () => pause_Game(dispatch, getState, socket))
    socket.on(SERVER_STOP_GAME, () => stop_Game(dispatch, getState))
    socket.on(SERVER_THE_WINNER_IS, (data) => endOfGame(dispatch, getState, data))
    socket.on(SERVER_GIVE_MALUS, (data) => getMalus(dispatch, getState, data))

    socket.on(SERVER_INCOMMING_PIECES, data => dispatch(data))
    socket.on(SERVER_INCOMMING_REPLACEMENT_PIECES, data => dispatch(data))
    socket.on(SERVER_RES_UPDATE_BOARD, data => updateBoard(dispatch, data))

    
    return next => action => next(action)
}

const getMalus = (dispatch, getState, data) => {
    const { nbLine } = data
    const { game } = getState()
    const board = game.GameBoard.player
    const plainLine = board[0].map(() => {
        return 1
    })
    const newBoard = board
    for (let i = 0; i < nbLine; i++) {
        newBoard.shift()
        newBoard.push(plainLine)
    }
    dispatch(updatePlayerBoard(newBoard))
    dispatch(data)
}

const updateBoard = (dispatch, data) => {
    const { toDispatch } = data
    dispatch(toDispatch)
}

const endOfGame = (dispatch, getState, data) => {
    const { msg, gameState } = data
    alert(msg)
    dispatch(gameState)
    stop_Game(dispatch, getState)
}

const start_Game = (dispatch, getState, socket, data) => {
    const { difficulty } = data
    const interval = setInterval(() => {
        moves(dispatch, getState, "ArrowDown", socket, 'gameMoves')
    }, difficulty)
    dispatch(startGame(interval))
}

const pause_Game = (dispatch, getState) => {
    const gameInterval = getState().game.Game
    clearInterval(gameInterval)
    dispatch(pauseGame())
}

const stop_Game = (dispatch, getState) => {
    const gameInterval = getState().game.Game
    clearInterval(gameInterval)
    dispatch(stopGame())
}

const valideLogin = (dispatch, data, socket) => {
    const { userName, roomName } = data
    dispatch(data)
    history.push(`/#${roomName}[${userName}]`)
}

const invalideLogin = (dispatch, data) => {
    dispatch(data)
    history.push('/')
}

const logout = (dispatch) => {
    dispatch(logginOutUser())
    history.replace('/')
    dispatch(logoutUser())
}

const changeGame = (dispatch, data) => {
    const { roomName, players, playerName } = data
    dispatch(changeRoom(roomName, players))
    history.push(`/#${roomName}[${playerName}]`)
    dispatch(roomChanged())
}

export default socketMiddleware;