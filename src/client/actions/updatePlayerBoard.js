import { GAME_UPDATE_PLAYER_BOARD } from '../event/reduxEvent'

export const updatePlayerBoard = (newBoard) => {
    return {
        type: GAME_UPDATE_PLAYER_BOARD,
        newBoard: newBoard
    }
}