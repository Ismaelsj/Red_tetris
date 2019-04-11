import { GAME_MEXT_PIECE } from '../event/reduxEvent'

export const nextPiece = () => {
    return {
        type: GAME_MEXT_PIECE
    }
}