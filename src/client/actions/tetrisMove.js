import { GAME_TERIS_MOVE } from '../event/reduxEvent'

export const tetrisMove = (piece) => {
    return {
        type: GAME_TERIS_MOVE,
        piece: piece
    }
}