import { GAME_UPDATE_OPPONENT_BOARD} from '../event/reduxEvent'

export const updateOpponentBoard = (newBoard) => {
    return {
        type: GAME_UPDATE_OPPONENT_BOARD,
        newBoard: newBoard
    }
}