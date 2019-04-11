import '../jsDomSetup'
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
    CLIENT_PAUSE_GAME } from '../../src/server/socketEvent'

import "babel-polyfill"

import { initSocket } from '../../src/client/actions/initSocket'

import Pieces from '../../src/server/controllers/piecesController'

import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'
import mongoose from "mongoose";

import createNewServer from '../../src/server/index';

const serverParams = {
    host: '0.0.0.0',
    port: 8884,
    url: 'http://' + '0.0.0.0' + ':' + '8884' 
}

const { url } = serverParams

const dbParams = {
    path: 'testing-socketMiddleware',
    clean: true
}

const stopServer = {}

const store = {}

const clearDB = () => {
    return new Promise((resolve) => {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.db.dropCollection(i, () => {});
        }
        resolve(true)
    })
}

describe('ScoketMiddleware => :', () => {
    let socketPlayer1;
    beforeAll(done => {
        createNewServer(serverParams, dbParams).then(stop => {
            stopServer['stop'] = stop.stop
            done()
        })
    })

    beforeEach(done => {
        socketPlayer1 = io(url)
        store['test'] = storeConfig(socketPlayer1)
        store.test.dispatch(initSocket(socketPlayer1))
        socketPlayer1.on('connect', () => done())
        global.io.to(`${socketPlayer1.id}`).emit('connect')
    })

    afterEach((done) => {
        clearDB()
        if (socketPlayer1.connected) socketPlayer1.disconnect();
        done()
    })

    afterAll((done) => {
        setTimeout( async() => {
            stopServer.stop(done)
        }, 1000)
    })

    test('internalError', (done) => {
        const data = {
            type: INTERNAL_ERROR
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_INTERNAL_ERROR, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.error.intenalError).toBe(true);
            done()
        }, 3000)
    }, 10000)

    test('invalideLogin', (done) => {
        const errMsg = 'error msg';
        const data = { 
            type: LOGIN_VALIDATE_USER_NAME,
            userName: 'Jean',
            roomName: null,
            isValid: false,
            isUsed: false,
            errMsg: errMsg }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_INVALIDE_NAME, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.login.errMsg).toBe(errMsg);
            done()
        }, 3000)
    }, 10000)

    test('valideLogin', (done) => {
        const data = { 
            type: LOGIN_LOGIN,
            userName: 'Jean',
            roomName: 'Jean',
            players: ['Jean']
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_VALIDE_NAME, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.user.userName).toEqual('Jean');
            done()
        }, 3000)
    }, 10000)

    describe('Logout :', () => {
        beforeAll((done) => {
                // simulate connected user
            const data = { 
                type: LOGIN_LOGIN,
                userName: 'Jean',
                roomName: 'Jean',
                players: ['Jean']
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_VALIDE_NAME, data)
            setTimeout(() => {
                const state = store.test.getState()
                done()
            }, 1000)
        })
        test('logout', (done) => {
            const data = { 
                type: LOGOUT_LOGGINOUT 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_DISCONNECT, data)
            setTimeout(() => {
                const state = store.test.getState()
                expect(state.user.userName).toEqual('');
                done()
            }, 3000)
        }, 10000)
    })

    test('validate room', (done) => {
        const errMsg = 'room not found'
        const data = { 
            type: ROOM_VALIDATE,
            isValid: false,
            errMsg: errMsg 
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_ROOM_NOT_FOUND, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.changeRoom.errMsg).toEqual(errMsg);
            done()
        }, 3000)
    }, 10000)

    test('player join room', (done) => {
        const players = [
            'Jean',
            'Ismael'
        ]
        const data = { 
            type: ROOM_PLAYER_JOIN, 
            players,
            msg: 'Ismael joined room Jean'
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_JOIN_ROOM, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.room.players).toEqual(players);
            done()
        }, 3000)
    }, 10000)

    test('player leave room', (done) => {
        const players = [
            'Jean'
        ]
        const data = { 
            type: ROOM_PLAYER_LEAVE, 
            players,
            msg: 'Ismael leaved room Jean'
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_LEAVE_ROOM, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.room.players).toEqual(players);
            done()
        }, 3000)
    }, 10000)

    test('player change room', (done) => {
        const players = [
            'Ismael',
            'Jean'
        ]
        const data = { 
            roomName: 'Ismael', 
            players, 
            playerName: 'Jean' 
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_USER_CHANGE_ROOM, data)
        setTimeout(() => {
            expect(window.location.href).toEqual('http://localhost/#Ismael[Jean]');
            done()
        }, 3000)
    }, 10000)

    test('new message', (done) => {
        const message = 'new message'
        const data = { 
            type: MESSAGE_NEW_MESSAGE, 
            message 
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_RES_MESSAGE, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.room.conversation).toContain(message);
            done()
        }, 3000)
    }, 10000)

    describe('Start - Pause game', () => {
        beforeAll((done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            done()
        })

        test('start/pause game', (done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            const data = { 
                difficulty: 500, 
                mode: 'classic' 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_START_GAME, data)
            setTimeout(() => {
                const state = store.test.getState()
                global.io.to(`${socketPlayer1.id}`).emit(SERVER_PAUSE_GAME)
                expect(state.game.Game).toBeTruthy();
                setTimeout(() => {
                    const state = store.test.getState()
                    expect(state.game.Game).toBeNull();
                    done()
                }, 1000)
            }, 1000)
        }, 10000)
    })

    describe('Start - Stop game', () => {
        beforeAll((done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            done()
        })

        test('start/stop game', (done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            const data = { 
                difficulty: 500, 
                mode: 'classic' 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_START_GAME, data)
            setTimeout(() => {
                const state = store.test.getState()
                global.io.to(`${socketPlayer1.id}`).emit(SERVER_STOP_GAME)
                expect(state.game.Game).toBeTruthy();
                setTimeout(() => {
                    const state = store.test.getState()
                    expect(state.game.Game).toBeNull();
                    done()
                }, 1000)
            }, 1000)
        }, 10000)
    })

    describe('Start - Get Malus - Stop game', () => {
        beforeAll((done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            done()
        })

        test('start/end of game', (done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            const data = { 
                difficulty: 500, 
                mode: 'classic' 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_START_GAME, data)
            setTimeout(() => {
                const state = store.test.getState()
                const data =  {
                    type: GAME_GET_MALUS,
                    nbLine: 5 
                }
                global.io.to(`${socketPlayer1.id}`).emit(SERVER_GIVE_MALUS, data)
                expect(state.game.Game).toBeTruthy();
                setTimeout(() => {
                    const state = store.test.getState()
                    const gameInterval = state.game.Game
                    clearInterval(gameInterval)
                    expect(state.game.Malus).toEqual(data.nbLine);
                    done()
                }, 1000)
            }, 1000)
        }, 10000)
    })

    describe('Start - End of game', () => {
        beforeAll((done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            done()
        })

        test('start/end of game', (done) => {
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
                type: GAME_NEW_REPLACEMENT_PIECES, 
                pieces: Pieces.piecesPackGenerator()
            })
            const data = { 
                difficulty: 500, 
                mode: 'classic' 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_START_GAME, data)
            setTimeout(() => {
                const state = store.test.getState()
                const data = { 
                    msg: 'looser', 
                    gameState: { 
                        type: GAME_ADD_GAME_HISTORY, 
                        game: { 
                            p1Score: 10, 
                            p2Score: 0,
                            bestScore: 10,
                            winner: 'Jean',
                            isSolo: true 
                        }
                    }
                }
                global.io.to(`${socketPlayer1.id}`).emit(SERVER_THE_WINNER_IS, data)
                expect(state.game.Game).toBeTruthy();
                setTimeout(() => {
                    const state = store.test.getState()
                    expect(state.game.GameHistory[0]).toMatchObject(data.gameState.game);
                    done()
                }, 1000)
            }, 1000)
        }, 10000)
    })

    test('new pieces', (done) => {
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { 
            type: GAME_NEW_REPLACEMENT_PIECES, 
            pieces: Pieces.piecesPackGenerator()
        })
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.game.Pieces.length).toBeLessThanOrEqual(50);
            const data = {
                type: GAME_NEW_PIECES, 
                pieces: Pieces.piecesPackGenerator() 
            }
            global.io.to(`${socketPlayer1.id}`).emit(SERVER_INCOMMING_PIECES, data)
            setTimeout(() => {
                const state = store.test.getState()
                expect(state.game.Pieces.length).toBeGreaterThan(50);
                done()
            }, 3000)
        }, 1000)
    }, 10000)

    test('update board', (done) => {
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
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        ];
        const data = {
            toDispatch : { 
                type: GAME_UPDATE_OPPONENT_BOARD,
                newBoard: templateEmptyBoard 
            }
        }
        global.io.to(`${socketPlayer1.id}`).emit(SERVER_RES_UPDATE_BOARD, data)
        setTimeout(() => {
            const state = store.test.getState()
            expect(state.game.GameBoard.opponent).toEqual(templateEmptyBoard);
            done()
        }, 3000)
    }, 10000)
})