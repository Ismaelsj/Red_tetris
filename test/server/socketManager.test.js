import { SERVER_INTERNAL_ERROR,
    CLIENT_USER_CONNECTION,
    CLIENT_USER_DISCONNECT,
    SERVER_USER_INVALIDE_NAME,
    SERVER_USER_VALIDE_NAME,
    SERVER_USER_DISCONNECT,
    CLIENT_USER_CHANGE_ROOM,
    SERVER_USER_CHANGE_ROOM,
    SERVER_USER_JOIN_ROOM,
    SERVER_USER_LEAVE_ROOM,
    SERVER_ROOM_NOT_FOUND,
    CLIENT_SEND_MESSAGE,
    SERVER_RES_MESSAGE, 
    CLIENT_START_GAME,
    CLIENT_PAUSE_GAME,
    CLIENT_RETURN_GAME,
    CLIENT_STOP_GAME,
    CLIENT_GIVE_MALUS,
    SERVER_GIVE_MALUS,
    SERVER_START_GAME,
    SERVER_PAUSE_GAME,
    SERVER_STOP_GAME,
    CLIENT_END_OF_GAME,
    SERVER_THE_WINNER_IS,
    CLIENT_SEND_UPDATE_BOARD,
    SERVER_RES_UPDATE_BOARD,
    SERVER_INCOMMING_PIECES,
    SERVER_INCOMMING_REPLACEMENT_PIECES,
    CLIENT_REPLCAEMENT_PIECES_ASKED,
    CLIENT_PIECES_ASKED } from "../../src/server/socketEvent";

    // redux events
import {INTERNAL_ERROR, 
    LOGIN_VALIDATE_USER_NAME,
    LOGIN_LOGIN,
    LOGOUT_LOGGINOUT, 
    ROOM_PLAYER_LEAVE, 
    ROOM_PLAYER_JOIN,
    ROOM_VALIDATE,
    MESSAGE_NEW_MESSAGE,
    GAME_PAUSE,
    GAME_STOP,
    GAME_UPDATE_OPPONENT_BOARD,
    GAME_NEW_PIECES,
    GAME_NEW_REPLACEMENT_PIECES,
    GAME_ADD_GAME_HISTORY,
    GAME_GET_MALUS } from '../../src/client/event/reduxEvent';

import "babel-polyfill"

import io from 'socket.io-client'
import mongoose from "mongoose";

import createNewServer from '../../src/server/index';

const serverParams = {
    host: '0.0.0.0',
    port: 8885,
    url: 'http://' + '0.0.0.0' + ':' + '8885' 
}

const { url } = serverParams

const dbParams = {
    path: 'testing-socketManager',
    clean: true
}

const stopServer = {}

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

const clearDB = () => {
    return new Promise((resolve) => {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.db.dropCollection(i, () => {});
        }
        resolve(true)
    })
}

const emitSocketWithDelay = (socket, reson, data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            socket.emit(reson, data)
            resolve(true)
        }, 2000)
    })
}

describe('ScoketManager => :', () => {
    beforeAll(done => {
        createNewServer(serverParams, dbParams).then(stop => {
            stopServer['stop'] = stop.stop
            done()
        })
    })

    afterAll((done) => {
        setTimeout( async() => {
            stopServer.stop(done)
        }, 1000)
    })

    describe('Login => :', () => {
        const socketPlayer1 = io(url)
        const socketPlayer2 = io(url)

        afterAll((done) => {
            clearDB()
            if (socketPlayer1.connected) socketPlayer1.disconnect()
            if (socketPlayer2.connected) socketPlayer2.disconnect()
            done()
        })
        test('Create new player : invalide -> invalide name', (done) => {
                // invalide name
            const dataLogin = { 
                name: 'Jean-',
                room: 'Jean-'
            }
            socketPlayer1.on(SERVER_USER_INVALIDE_NAME, (data) => {
                expect(data.errMsg).toBeDefined();
                done();
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, dataLogin)
        }, 10000);

        test('Create new player : valide', (done) => {
            const dataLogin = { 
                name: 'Jean',
                room: 'Jean'
            }
            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                expect(data.userName).toEqual(dataLogin.name);
                done();
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, dataLogin)
        }, 10000);

        test('Create new player : invalide -> name already taken', (done) => {
                // name already taken
            const dataLogin = { 
                name: 'Jean',
                room: 'Jean'
            }
            socketPlayer2.on(SERVER_USER_INVALIDE_NAME, (data) => {
                expect(data.errMsg).toBeDefined();
                done();
            })
            socketPlayer2.emit(CLIENT_USER_CONNECTION, dataLogin)
        }, 10000);
    })

    describe('ChangeRoom => :', () => {
        const socketPlayer1 = io(url);
        let player1
        const socketPlayer2 = io(url);
        let player2
        const socketPlayer3 = io(url);
        let player3

        beforeAll((done) => {
            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                player1 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer2.on(SERVER_USER_VALIDE_NAME, (data) => {
                player2 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer3.on(SERVER_USER_VALIDE_NAME, (data) => {
                player3 = { userName: data.userName, roomName: data.roomName }
                done()
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, { name: 'Jean', room: 'Jean' })
            socketPlayer2.emit(CLIENT_USER_CONNECTION, { name: 'Ismael', room: 'Ismael' })
            socketPlayer3.emit(CLIENT_USER_CONNECTION, { name: 'Huge', room: 'Huge' })
        })
    
        afterAll((done) => {
            clearDB()
            if (socketPlayer1.connected) socketPlayer1.disconnect()
            if (socketPlayer2.connected) socketPlayer2.disconnect()
            if (socketPlayer3.connected) socketPlayer3.disconnect()
            done()
        })

        test('chaneg room ', async (done) => {
                // Stop game before changing room
            socketPlayer1.on(SERVER_STOP_GAME, (data) => {
                expect(data.type).toEqual(expect.stringMatching(GAME_STOP))
            })
            socketPlayer3.on(SERVER_STOP_GAME, (data) => {
                expect(data.type).toEqual(expect.stringMatching(GAME_STOP))
            })

                // player joined room
            socketPlayer2.on(SERVER_USER_JOIN_ROOM, data => {
                expect(data.players).toContain('Jean')
            })

                // room not found
            socketPlayer1.on(SERVER_ROOM_NOT_FOUND, (data) => {
                expect(data.isValid).toBe(false)
            })
                // room full
            socketPlayer3.on(SERVER_ROOM_NOT_FOUND, (data) => {
                expect(data.isValid).toBe(false)
                done();
            })
                // room found
            socketPlayer1.on(SERVER_USER_CHANGE_ROOM, (data) => {
                expect(data.roomName).toEqual('Ismael')
            })
                // room not found
            await emitSocketWithDelay(socketPlayer1, CLIENT_USER_CHANGE_ROOM, { searchedRoom: 'Jeanne', userName: 'Jean' })
                // room found
            await emitSocketWithDelay(socketPlayer1, CLIENT_USER_CHANGE_ROOM, { searchedRoom: 'Ismael', userName: 'Jean' })
                // room full
            await emitSocketWithDelay(socketPlayer3, CLIENT_USER_CHANGE_ROOM, { searchedRoom: 'Ismael', userName: 'Huge' })
        }, 20000);
    })

    describe('Game => :', () => {
        const socketPlayer1 = io(url);
        let player1
        const socketPlayer2 = io(url);
        let player2

        beforeAll((done) => {
            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                player1 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer2.on(SERVER_USER_VALIDE_NAME, (data) => {
                player2 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer1.on(SERVER_USER_JOIN_ROOM, () => {
                done()
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, { name: 'Jean', room: 'Jean' })
            socketPlayer2.emit(CLIENT_USER_CONNECTION, { name: 'Ismael', room: 'Ismael' })
            setTimeout(() => {
                socketPlayer2.emit(CLIENT_USER_CHANGE_ROOM, { searchedRoom: 'Jean', userName: 'Ismael' })
            }, 1000)
        })

        afterAll((done) => {
            clearDB()
            if (socketPlayer1.connected) socketPlayer1.disconnect()
            if (socketPlayer2.connected) socketPlayer2.disconnect()
            done()
        })

        describe('tests:', () => {
            let pieces;
            test('start game', async (done) => {
                const difficulty = 500;
                const mode = 'classic';

                socketPlayer1.on(SERVER_INCOMMING_REPLACEMENT_PIECES, (data) => {
                    expect(data.type).toEqual(GAME_NEW_REPLACEMENT_PIECES)
                    pieces = data.pieces
                })
                socketPlayer2.on(SERVER_INCOMMING_REPLACEMENT_PIECES, (data) => {
                    expect(data.pieces).toEqual(pieces)
                })
                socketPlayer1.on(SERVER_START_GAME, (data) => {
                    expect(data.difficulty).toEqual(difficulty)
                })
                socketPlayer2.on(SERVER_START_GAME, (data) => {
                    expect(data.difficulty).toEqual(difficulty)
                    done()
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_START_GAME, { roomName: 'Jean', difficulty, mode })
            }, 10000)
            test('new additional pieces', async (done) => {
                socketPlayer1.on(SERVER_INCOMMING_PIECES, (data) => {
                    expect(data.type).toEqual(GAME_NEW_PIECES)
                    pieces = data.pieces
                })
                socketPlayer2.on(SERVER_INCOMMING_PIECES, (data) => {
                    expect(data.pieces).toEqual(pieces)
                    done()
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_PIECES_ASKED, { roomName: 'Jean' })
            }, 10000)
            test('update board', async (done) => {
                socketPlayer1.on(SERVER_RES_UPDATE_BOARD, (data) => {
                    expect(data.toDispatch.type).toEqual(GAME_UPDATE_OPPONENT_BOARD)
                    done()
                })
                socketPlayer2.on(SERVER_RES_UPDATE_BOARD, (data) => {
                    expect(data.toDispatch.type).toEqual(GAME_UPDATE_OPPONENT_BOARD)
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_SEND_UPDATE_BOARD, { roomName: 'Jean', newGameBoarder: templateEmptyBoard, score: 0, isManager: true })
                await emitSocketWithDelay(socketPlayer2, CLIENT_SEND_UPDATE_BOARD, { roomName: 'Jean', newGameBoarder: templateEmptyBoard, score: 0, isManager: false })
            }, 10000)
            test('get malus', async (done) => {
                const malusP1 = 2;
                const malusP2 = 4;

                socketPlayer1.on(SERVER_GIVE_MALUS, (data) => {
                    expect(data.nbLine).toEqual(malusP1)
                    done()
                })
                socketPlayer2.on(SERVER_GIVE_MALUS, (data) => {
                    expect(data.nbLine).toEqual(malusP2)
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_GIVE_MALUS, { nbLine: malusP2, roomName: 'Jean' })
                await emitSocketWithDelay(socketPlayer2, CLIENT_GIVE_MALUS, { nbLine: malusP1, roomName: 'Jean' })
            }, 10000)
            test('pause game', async (done) => {
                socketPlayer1.on(SERVER_PAUSE_GAME, (data) => {
                    expect(data.type).toEqual(GAME_PAUSE)
                })
                socketPlayer2.on(SERVER_PAUSE_GAME, (data) => {
                    expect(data.type).toEqual(GAME_PAUSE)
                    done()
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_PAUSE_GAME, { roomName: 'Jean' })
            }, 10000)
            test('stop game', async(done) => {
                socketPlayer1.on(SERVER_STOP_GAME, (data) => {
                    expect(data.type).toEqual(GAME_STOP)
                })
                socketPlayer2.on(SERVER_STOP_GAME, (data) => {
                    expect(data.type).toEqual(GAME_STOP)
                    done()
                })
                await emitSocketWithDelay(socketPlayer1, CLIENT_STOP_GAME, { roomName: 'Jean' })
            })
        }, 60000);
    })

    describe('Message => :', () => {
        const socketPlayer1 = io(url);
        let player1
        const socketPlayer2 = io(url);
        let player2

        beforeAll((done) => {
            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                player1 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer2.on(SERVER_USER_VALIDE_NAME, (data) => {
                player2 = { userName: data.userName, roomName: data.roomName }
            })
            socketPlayer1.on(SERVER_USER_JOIN_ROOM, () => {
                done()
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, { name: 'Jean', room: 'Jean' })
            socketPlayer2.emit(CLIENT_USER_CONNECTION, { name: 'Ismael', room: 'Ismael' })
            setTimeout(() => {
                socketPlayer2.emit(CLIENT_USER_CHANGE_ROOM, { searchedRoom: 'Jean', userName: 'Ismael' })
            }, 1000)
        })

        afterAll((done) => {
            clearDB()
            if (socketPlayer1.connected) socketPlayer1.disconnect()
            if (socketPlayer2.connected) socketPlayer2.disconnect()
            done()
        })

        test('message :', async (done) => {
            const msgToP1 = 'salut Jean'
            const msgToP2 = 'salut Ismael'
            socketPlayer1.on(SERVER_RES_MESSAGE, (data) => {
                expect(data.message).toEqual(msgToP1)
            })
            socketPlayer2.on(SERVER_RES_MESSAGE, (data) => {
                expect(data.message).toEqual(msgToP2)
                done();
            })
            await emitSocketWithDelay(socketPlayer2, CLIENT_SEND_MESSAGE, { roomName: 'Jean', message: msgToP1 })
            await emitSocketWithDelay(socketPlayer1, CLIENT_SEND_MESSAGE, { roomName: 'Jean', message: msgToP2 })
        }, 10000);
    })

    describe('Logout => :', () => {
        const socketPlayer1 = io(url);
        let player1

        beforeAll((done) => {
            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                player1 = { userName: data.userName, roomName: data.roomName }
                done()
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, { name: 'Jean', room: 'Jean' })
        })

        afterAll((done) => {
            clearDB()
            if (socketPlayer1.connected) socketPlayer1.disconnect()
            done()
        })

        test('Logout :', (done) => {
            socketPlayer1.on(SERVER_USER_DISCONNECT, (data) => {
                expect(data.type).toEqual(LOGOUT_LOGGINOUT)
                done();
            })
            socketPlayer1.emit(CLIENT_USER_DISCONNECT, { name: 'Jean' })
        }, 10000);
    })
})