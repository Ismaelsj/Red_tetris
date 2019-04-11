import { changeRoom } from '../../src/client/actions/changeRoom'
import { initSocket } from '../../src/client/actions/initSocket'
import { logginOutUser } from '../../src/client/actions/logginOut'
import { logoutUser } from '../../src/client/actions/logoutUser'
import { newMessage } from '../../src/client/actions/newMessage'
import { pauseGame } from '../../src/client/actions/pauseGame'
import { removeMsgNot } from '../../src/client/actions/removeMsgNot'
import { roomChanged } from '../../src/client/actions/roomChanged'
import { setManager } from '../../src/client/actions/setManager'
import { startGame } from '../../src/client/actions/startGame'
import { stopGame } from '../../src/client/actions/stopGame'
import { tetrisMove } from '../../src/client/actions/tetrisMove'
import { updateOpponentBoard } from '../../src/client/actions/updateOpponentBoard'
import { updatePlayerBoard } from '../../src/client/actions/updatePlayerBoard'
import { updateSocre } from '../../src/client/actions/updateScore'
import { nextPiece } from '../../src/client/actions/nextPiece'

import { ROOM_CHANGE,
    INIT_SOCKET,
    LOGOUT_LOGGINOUT,
    LOGOUT_LOGOUT,
    MESSAGE_NEW_MESSAGE,
    GAME_PAUSE,
    MESSAGE_REMOVE_NOT,
    ROOM_ROOM_CHANGED,
    GAME_SET_MANAGER,
    GAME_START,
    GAME_STOP,
    GAME_MEXT_PIECE,
    GAME_TERIS_MOVE,
    GAME_UPDATE_OPPONENT_BOARD,
    GAME_UPDATE_PLAYER_BOARD,
    GAME_UPDATE_SCORE } from '../../src/client/event/reduxEvent';

describe('Actions => :', () => {
    test('change room:', () => {
        const newRoom = 'Ismael';
        const roomPlayers = 'Jean';
        const pieces = ['piecs']
        const expectRes = { type: ROOM_CHANGE, roomName: newRoom, players: roomPlayers, pieces }
        expect(changeRoom(newRoom, roomPlayers, pieces)).toMatchObject(expectRes)
    })

    test('init sockets:', () => {
        const socket = 'newSocket';
        const expectRes = { type: INIT_SOCKET, socket }
        expect(initSocket(socket)).toMatchObject(expectRes)
    })

    test('logginOutUser:', () => {
        const expectRes = { type: LOGOUT_LOGGINOUT }
        expect(logginOutUser()).toMatchObject(expectRes)
    })

    test('logoutUser:', () => {
        const expectRes = { type: LOGOUT_LOGOUT }
        expect(logoutUser()).toMatchObject(expectRes)
    })

    test('new message:', () => {
        const message = 'new message'
        const expectRes = { type: MESSAGE_NEW_MESSAGE, message }
        expect(newMessage(message)).toMatchObject(expectRes)
    })

    test('pause game:', () => {
        const expectRes = { type: GAME_PAUSE }
        expect(pauseGame()).toMatchObject(expectRes)
    })

    test('remove message notifications:', () => {
        const expectRes = { type: MESSAGE_REMOVE_NOT }
        expect(removeMsgNot()).toMatchObject(expectRes)
    })

    test('room changed:', () => {
        const expectRes = { type: ROOM_ROOM_CHANGED }
        expect(roomChanged()).toMatchObject(expectRes)
    })

    test('set manager:', () => {
        const expectRes = { type: GAME_SET_MANAGER }
        expect(setManager()).toMatchObject(expectRes)
    })

    test('start game:', () => {
        const interval = 'new interval';
        const expectRes = { type: GAME_START, interval }
        expect(startGame(interval)).toMatchObject(expectRes)
    })

    test('stop game:', () => {
        const expectRes = { type: GAME_STOP }
        expect(stopGame()).toMatchObject(expectRes)
    })

    test('next piece:', () => {
        const expectRes = { type: GAME_MEXT_PIECE }
        expect(nextPiece()).toMatchObject(expectRes)
    })

    test('tetris moves:', () => {
        const piece = 'piece'
        const expectRes = { type: GAME_TERIS_MOVE, piece }
        expect(tetrisMove(piece)).toMatchObject(expectRes)
    })

    test('update opponent board:', () => {
        const newBoard = 'new board'
        const expectRes = { type: GAME_UPDATE_OPPONENT_BOARD, newBoard }
        expect(updateOpponentBoard(newBoard)).toMatchObject(expectRes)
    })

    test('update player board:', () => {
        const newBoard = 'new board'
        const expectRes = { type: GAME_UPDATE_PLAYER_BOARD, newBoard }
        expect(updatePlayerBoard(newBoard)).toMatchObject(expectRes)
    })

    test('update player board:', () => {
        const score = 9999
        const expectRes = { type: GAME_UPDATE_SCORE, score }
        expect(updateSocre(score)).toMatchObject(expectRes)
    })
})
