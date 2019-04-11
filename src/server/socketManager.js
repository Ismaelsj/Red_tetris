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
    CLIENT_PIECES_ASKED } from "./socketEvent";


import { isNil, equals } from 'ramda';

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
        GAME_GET_MALUS } from '../client/event/reduxEvent';

import Player from './controllers/playerController'
import Room from './controllers/roomController'
import Pieces from './controllers/piecesController'
import Game from './controllers/gameController'
import BestScores from './controllers/bestScoresController'

        // login
export const login = (socket, data) => {
    return new Promise( async(resolve, reject) => {
        try {
            const playerName = data.name
            const roomName = data.room
            if (isNil(playerName) || !/^[a-z0-9]+$/i.test(playerName)) {
                let errMsg = 'invalide Name'
                socket.emit(SERVER_USER_INVALIDE_NAME, { type: LOGIN_VALIDATE_USER_NAME,
                                                name: playerName,
                                                roomName: null,
                                                isValid: false,
                                                isUsed: false,
                                                errMsg: errMsg })
                resolve(false)
                return;
            }

            const verifyUserName = Player.findPlayer({ name: playerName })
            verifyUserName.exec( async (err, player) => {
                if (err) throw err;
                if (player) {
                    let errMsg = 'name already taken'
                    socket.emit(SERVER_USER_INVALIDE_NAME, { type: LOGIN_VALIDATE_USER_NAME,
                                                    name: playerName,
                                                    roomName: null, 
                                                    isValid: false, 
                                                    isUsed: true, 
                                                    errMsg: errMsg })
                    resolve(false)
                    return ;
                }
                    // create player
                const newPlayer = await Player.createPlayer(playerName, socket.id)
            
                    // create default room
                const defaultRoom = { name: playerName } 
                let i;
                if (await isRoomNameExisting(playerName) === true) {
                    for (i = 1;i < 9999; i++) {
                        let testName = playerName + i;
                        if (await isRoomNameExisting(testName) === false) {
                            defaultRoom.name = testName
                            break ;
                        }
                    }
                }
                const defaultPlayerRoom = await Room.createRoom(defaultRoom.name, newPlayer._id)
            
                    // update room and default room
                const updatedPlayer = await Player.findPlayerAndUpdate({ name: playerName }, { $set: { defaultRoom: defaultPlayerRoom._id, room: defaultPlayerRoom._id } } )
                
                socket.join(defaultPlayerRoom.name)
                const players = await getPlayers(defaultPlayerRoom)
                socket.emit(SERVER_USER_VALIDE_NAME, { type: LOGIN_LOGIN,
                                                userName: newPlayer.name,
                                                roomName: defaultPlayerRoom.name,
                                                players: players})


                if (!isNil(roomName) && !equals(playerName, defaultRoom.name)) {
                    await changeRoom(socket, { searchedRoom: roomName, userName: newPlayer.name })
                }
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
    })
}

export const isRoomNameExisting = (roomName) => {
    return new Promise((resolve) => {
        try {
            const findRoom = Room.findRoom({ name: roomName })
            findRoom.exec((err, room) => {
                if (err) throw err;
                if (room === null) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        } catch(err) {
            reject(err)
        }
    })
}

export const getPlayers = (roomDoc) => {
    return new Promise((resolve, reject) => {
        try {
            const tmp = new Array()
            roomDoc.populate('players', (err, room) => {
                if (err) throw err;
                room.players.map((p) => {
                    tmp.push(p.name)
                })
                resolve(tmp)
            })
        } catch(err) {
            reject(err)
        }
    })
} 

        // join room
export const joinRoom = (socket, searchedRoom, player) => {
    return new Promise((resolve, reject) => {
        try {
            const findRoom = Room.findRoom({ name: searchedRoom })
            findRoom.exec( async (err, room) => {
                if (err) throw err;
                if (isNil(room)) {
                    let errMsg = 'Room ' + searchedRoom + ' not found.'
                    socket.emit(SERVER_ROOM_NOT_FOUND, { type: ROOM_VALIDATE,
                                                isValid: false,
                                                errMsg: errMsg })
                    resolve(false)
                    return ;
                } else if (room.isPlaying === true) {
                    let errMsg = 'Game in progress in room : ' + searchedRoom
                    socket.emit(SERVER_ROOM_NOT_FOUND, { type: ROOM_VALIDATE,
                                                isValid: false,
                                                errMsg: errMsg })
                    resolve(false)
                    return ;
                } else if (room.players.length >= 2) {
                    let errMsg = 'Room ' + searchedRoom + ' is full.'
                    socket.emit(SERVER_ROOM_NOT_FOUND, { type: ROOM_VALIDATE,
                                                isValid: false,
                                                errMsg: errMsg })
                    resolve(false)
                    return ;
                } 
                    // join room
                const joinedRoom = await Room.findRoomAndUpdate({ name: searchedRoom }, { $push: { players: player._id } })
                    // update player room
                await player.update({ $set: { room: joinedRoom._id } })
                    
                socket.join(searchedRoom)
                const players = await getPlayers(joinedRoom)
                socket.to(searchedRoom).emit(SERVER_USER_JOIN_ROOM, { type: ROOM_PLAYER_JOIN, 
                                                                    players: players, 
                                                                    msg: player.name + ' joined room ' + searchedRoom })
                
                socket.emit(SERVER_USER_CHANGE_ROOM, { roomName: joinedRoom.name, players: players, playerName: player.name })
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
    })
}

        // leave room
export const leaveRoom = (socket, player) => {
    return new Promise((resolve, reject) => {
        try {
            const actualRoom = player.room.name
            const findRoom = Room.findRoom({ name: actualRoom })
            findRoom.exec( async (err, room) => {
                if (err) throw err;
                if (isNil(room)) {
                    let errMsg = 'Room ' + actualRoom + ' not found.'
                    socket.emit(SERVER_ROOM_NOT_FOUND, { type: ROOM_VALIDATE,
                                                isValid: false,
                                                errMsg: errMsg })
                    resolve(false)
                    return ;
                }
                    // leave room
                const leavedRoom = await Room.findRoomAndUpdate({ name: actualRoom }, { $pull: { players: player._id } })
                socket.leave(actualRoom)
                const players = await getPlayers(leavedRoom)
                socket.to(actualRoom).emit(SERVER_USER_LEAVE_ROOM, { type: ROOM_PLAYER_LEAVE, 
                                                                    players: players, 
                                                                    msg: player.name + ' leaved room ' + actualRoom })
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
    })
}

        // logout
export const logout = async (socket, data) => {
    return new Promise((resolve, reject) => {
        try {
            const name = data.name
            const findPlayer = Player.findPlayer({ name: name })
            findPlayer.populate('room').populate('defaultRoom').exec( async (err, player) => {
                if (err) throw err;
                if (isNil(player)) {
                    resolve(false)
                    return ;
                    // socket.emit(USER_NOT_FOUND, {type: })
                }
                    // pull user from actual room
                await leaveRoom(socket, player)
                
                await Room.findRoomAndUpdate({ name: player.defaultRoom.name }, { $set: { owner: { isConnected: false } } })            
                await Player.findPlayerAndUpdate({ name: player.name }, { $set: { isDisconnected: true } })
                socket.emit(SERVER_USER_DISCONNECT, { type: LOGOUT_LOGGINOUT })
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
    })
}

        // change room
export const changeRoom = (socket, data) => {
    return new Promise((resolve, reject) => {
        try {
            const { searchedRoom,
                userName } = data
            const findPlayer = Player.findPlayer({ name: userName })
            findPlayer.populate('room').exec(async (err, player) => {
                if (err) throw err;
                global.io.in(player.room.name).emit(SERVER_STOP_GAME, { type: GAME_STOP })
                if (equals(searchedRoom, player.room.name)) return;
                const joinRes = await joinRoom(socket, searchedRoom, player)
                if (joinRes === false) return ;
                const leaveRes = await leaveRoom(socket, player)
                if (leaveRes === false) return ;
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
        
    })
}

        // send pieces
export const sendPieces = (data) => {
    return new Promise ((resolve) => {
        try {
            const { roomName } = data
            const newPieces = Pieces.piecesPackGenerator()
            global.io.in(roomName).emit(SERVER_INCOMMING_PIECES, { type: GAME_NEW_PIECES, 
                                                                pieces: newPieces })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

        // replace pieces 
export const replacePieces = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const { roomName } = data
            const newPieces = Pieces.piecesPackGenerator() 
            global.io.in(roomName).emit(SERVER_INCOMMING_REPLACEMENT_PIECES, { type: GAME_NEW_REPLACEMENT_PIECES, 
                                                                                pieces: newPieces })
            resolve(true)
        } catch {
            reject(err)
        }
    })
}

        // update board
export const updateBoard = (socket, data) => {
    return new Promise( async (resolve, reject) => {
        try {
            const { roomName, newGameBoarder, score, isManager } = data
            const findRoom = Room.findRoom({ name: roomName })
            findRoom.populate('game').exec(async (err, room) => {
                if (err) throw err;
                if (room === null) return ;
                if (isManager) {
                    const updatedGame = await Game.findGameAndUpdate({ _id: room.game._id }, { $set: { "board.player1": newGameBoarder , "score.player1": score } })
                    socket.to(roomName).emit(SERVER_RES_UPDATE_BOARD, {toDispatch: { type: GAME_UPDATE_OPPONENT_BOARD,
                                                                    newBoard: newGameBoarder }, gameState: { type: GAME_ADD_GAME_HISTORY, game: { p1Score: updatedGame.score.player1, p2Score: updatedGame.score.player2, winner: updatedGame.winner }}})
                    return ;
                }
                const updatedGame = await Game.findGameAndUpdate({ _id: room.game._id }, { $set: { "board.player2": newGameBoarder , "score.player2": score } })
                socket.to(roomName).emit(SERVER_RES_UPDATE_BOARD, {toDispatch :{ type: GAME_UPDATE_OPPONENT_BOARD,
                                                                    newBoard: newGameBoarder }, gameState: { type: GAME_ADD_GAME_HISTORY, game: { p1Score: updatedGame.score.player1, p2Score: updatedGame.score.player2, winner: updatedGame.winner }}})
            })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

        // send message
export const message = (socket, data) => {
    return new Promise((resolve, reject) => {
        try {
            const { roomName, message } = data
            socket.to(roomName).emit(SERVER_RES_MESSAGE, { type: MESSAGE_NEW_MESSAGE, 
                                                            message: message })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

export const startGame = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            replacePieces(data)
            const { roomName, difficulty, mode } = data
            const newGame = await Game.createGame(mode, difficulty)
            const updatedRoom = await Room.findRoomAndUpdate({ name: roomName }, { $set: { game: newGame._id, isPlaying: true } })
            global.io.in(roomName).emit(SERVER_START_GAME, { difficulty, mode })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

export const returnGame = (data) => {
    return new Promise((resolve) => {
        try {
            const { roomName, difficulty, mode } = data
            global.io.in(roomName).emit(SERVER_START_GAME, { difficulty, mode })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

export const pauseGame = (data) => {
    return new Promise((resolve) => {
        const { roomName } = data
        global.io.in(roomName).emit(SERVER_PAUSE_GAME, { type: GAME_PAUSE })
        resolve(true)
    })
}

export const stopGame = (data) => {
    return new Promise((resolve, reject) => {
        try {
            const { roomName } = data
            const findRoom = Room.findRoom({ name: roomName })
            findRoom.populate('game').exec( async (err, room) => {
                if (err) throw err;
                await Room.findRoomAndUpdate({ name: roomName }, { $push: { gameHistory: room.game } })
                await Room.findRoomAndUpdate({ name: roomName }, { $set: { game: null, isPlaying: false } })
                global.io.in(roomName).emit(SERVER_STOP_GAME, { type: GAME_STOP })
                    
            })
            
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

export const giveMalus = (socket, data) => {
    return new Promise((resolve, reject) => {
        try {
            const { nbLine, roomName } = data
            const findRoom = Room.findRoom({ name: roomName })
            findRoom.populate('players').exec((err, room) => {
                if (err) throw err;
                const players = room.players
                const hitPlayer = equals(players[0].socketId, socket.id) ? players[1].socketId : players[0].socketId;
                global.io.in(`${hitPlayer}`).emit(SERVER_GIVE_MALUS, { type: GAME_GET_MALUS,
                                                                        nbLine: nbLine })
            })
            resolve(true)
        } catch(err) {
            reject(err)
        }
    })
}

export const addBestScores = (room, isPlayer1) => {
    return new Promise((resolve, reject) => {
        try {
            const playerIndex = isPlayer1 ? 0 : 1;
            const selectPlayer = isPlayer1 ? 'player1' : 'player2';
            const bestScoreAndPosition = {
                bestScore: null,
                position: null,
                new: false,
                top10: null,
            }
            const findPlayerBestScore = BestScores.findPlayerBestScore(room.players[playerIndex].name, room.game.difficulty, room.game.gameType)
            findPlayerBestScore.exec( async (err, score) => {
                if (err) throw err;
                if (score === null) {
                    const newBestScore = await BestScores.createBestScores(
                        room.players[playerIndex].name,
                        room.game.difficulty,
                        room.game.gameType,
                        room.game.score[selectPlayer],
                        Date.now()
                    )
                    bestScoreAndPosition.bestScore = newBestScore
                    bestScoreAndPosition.new = true
                } else if (score.score < room.game.score[selectPlayer]) {
                    const newBestScore = await BestScores.findBestScoresAndUpdate(room.players[playerIndex].name, room.game.difficulty, room.game.gameType, room.game.score[selectPlayer])
                    bestScoreAndPosition.bestScore = newBestScore
                    bestScoreAndPosition.new = true
                } else {
                    bestScoreAndPosition.bestScore = score
                }
                const findBestScores = BestScores.findBestScores(room.game.difficulty, room.game.gameType)
                findBestScores.exec((err, scores) => {
                    if (err) throw err;
                    const playerPosition = scores.map((e) => { return e.score } ).indexOf(bestScoreAndPosition.bestScore.score)
                    bestScoreAndPosition.position = playerPosition + 1
                    bestScoreAndPosition.top10 = scores.slice(0, 10)
                    resolve(bestScoreAndPosition)
                })
            })
        } catch(err) {
            reject(err)
        }
    })
}

export const endOfGame = (socket, data) => {
    return new Promise((resolve, reject) => {
        try {
            const { roomName, isManager } = data
            const findRoom = Room.findRoom({ name: roomName })
            findRoom.populate('players').populate('game').exec( async (err, room) => {
                if (err) throw err;
                const winner = isManager ? ( isNil(room.players[1]) ? null : room.players[1].name ) : room.players[0].name ;
                const isSolo = room.players.length < 2
                const updatedGame = await Game.findGameAndUpdate({ _id: room.game._id }, { $set: { winner: winner } })
                await Room.findRoomAndUpdate({ name: roomName }, { $push: { gameHistory: room.game } })
                await Room.findRoomAndUpdate({ name: roomName }, { $set: { game: null, isPlaying: false } })
                const looserMsg = "You LOST !!!"
                const winnerMsg = "You WON  !!!"
                const player1BestScore = await addBestScores(room, isManager)
                socket.emit(SERVER_THE_WINNER_IS, { msg: looserMsg, gameState: { type: GAME_ADD_GAME_HISTORY, 
                                                                                game: { p1Score: updatedGame.score.player1, 
                                                                                        p2Score: updatedGame.score.player2,
                                                                                        bestScore: player1BestScore,
                                                                                        winner: updatedGame.winner,
                                                                                        isSolo: isSolo }
                                                                                }
                                                                            })
                if (!isSolo) {
                    const player2BestScore = await addBestScores(room, false)
                    socket.to(roomName).emit(SERVER_THE_WINNER_IS, { msg: winnerMsg, gameState: { type: GAME_ADD_GAME_HISTORY, 
                                                                                    game: { p1Score: updatedGame.score.player1, 
                                                                                            p2Score: updatedGame.score.player2,
                                                                                            bestScore: player2BestScore,
                                                                                            winner: updatedGame.winner,
                                                                                            isSolo: false }
                                                                                        } 
                                                                                })
                }                                                         
                resolve(true)
            })
        } catch(err) {
            reject(err)
        }
    })
}

export const internalError = (socket) => {
    global.io.to(`${socket.id}`).emit(SERVER_INTERNAL_ERROR, { type: INTERNAL_ERROR })
}

export default (socket) => {

    socket.on('disconnect', () => {
        try {
            const findPlayer = Player.findPlayer({ socketId: socket.id })
            findPlayer.exec(async (err, player) => {
                if (err) throw err;
                if (player === null) {
                    return ;
                }
                logout(socket, { name: player.name }).catch((err) => { throw err })
            })
        } catch(err) {
            internalError(socket)
        }
    })
        // user
    socket.on(CLIENT_USER_CONNECTION, (data) => login(socket, data).catch(() => internalError(socket)))
    socket.on(CLIENT_USER_DISCONNECT, (data) =>  logout(socket, data).catch(() => internalError(socket)))

        // room
    socket.on(CLIENT_USER_CHANGE_ROOM, (data) =>  changeRoom(socket, data).catch(() => internalError(socket)))

        // game
    socket.on(CLIENT_PIECES_ASKED, (data) =>  sendPieces(data).catch(() => internalError(socket)))
    socket.on(CLIENT_REPLCAEMENT_PIECES_ASKED, (data) =>  replacePieces(data).catch(() => internalError(socket)))
    socket.on(CLIENT_SEND_UPDATE_BOARD, (data) =>  updateBoard(socket, data).catch(() => internalError(socket)))
    socket.on(CLIENT_GIVE_MALUS, (data) =>  giveMalus(socket, data).catch(() => internalError(socket)))

    socket.on(CLIENT_START_GAME, (data) =>  startGame(data).catch(() => internalError(socket)))
    socket.on(CLIENT_PAUSE_GAME, (data) =>  pauseGame(data).catch(() => internalError(socket)))
    socket.on(CLIENT_RETURN_GAME, (data) =>  returnGame(data).catch(() => internalError(socket)))
    socket.on(CLIENT_STOP_GAME, (data) =>  stopGame(data).catch(() => internalError(socket)))
    socket.on(CLIENT_END_OF_GAME, (data) =>  endOfGame(socket, data).catch(() => internalError(socket)))

        // messages
    socket.on(CLIENT_SEND_MESSAGE, (data) => message(socket, data).catch(() => internalError(socket)))
}