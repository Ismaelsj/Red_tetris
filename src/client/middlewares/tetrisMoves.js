    // redux actions
import { updatePlayerBoard } from '../actions/updatePlayerBoard'
import { tetrisMove } from '../actions/tetrisMove'
import { updateSocre } from '../actions/updateScore'
import { nextPiece } from '../actions/nextPiece'

    // socket event
import { CLIENT_SEND_UPDATE_BOARD, CLIENT_PIECES_ASKED, CLIENT_END_OF_GAME, CLIENT_GIVE_MALUS } from '../../server/socketEvent'

    // utils functions
import { getNewBoard, valideNextMove, removeLine } from '../utils/gameUtils'

const checkremaningPieces = (pieces, socket, roomName) => {
    if (pieces.length <= 10) {
        socket.emit(CLIENT_PIECES_ASKED, { roomName: roomName })
    }
}

const isLost = (res, socket, roomName, isManager) => {
    if (res.y < 0) {
        socket.emit(CLIENT_END_OF_GAME, { roomName: roomName, isManager: isManager })
    }
}

const moves = (dispatch, getState, move, socket, origin) => {
        const { game, room } = getState()
        const board = game.GameBoard.player
        const piece = Object.assign(game.Pieces[0]);
        const res = valideNextMove(piece, board, move);
        if (res && res.score > 0 && origin === 'playerMoves') {
            dispatch(updateSocre(res.score))
        }
        switch (res.isValide) {
            case "bottom":
                const newboard = board.map((row, index) => getNewBoard(row, index, piece, board));
                const { filtredBoard, nbLine } = removeLine(newboard, game.Malus)
                if (nbLine > 0) {
                    dispatch(updateSocre(nbLine * 10))
                    if (room.players.length > 1) {
                        socket.emit(CLIENT_GIVE_MALUS, { nbLine: nbLine, roomName: room.roomName })
                    }
                }
                socket.emit(CLIENT_SEND_UPDATE_BOARD, { roomName: room.roomName, newGameBoarder: filtredBoard, score: game.Score, isManager: room.isManager })
                dispatch(nextPiece())
                dispatch(updatePlayerBoard(filtredBoard))
                checkremaningPieces(game.Pieces, socket, room.roomName)
                isLost(res, socket, room.roomName, room.isManager)
                return true
            case true:
                const pieceAfterMove = res.piece
                dispatch(tetrisMove(pieceAfterMove))
                return true
            default:
                return false
        }
}

export default moves;