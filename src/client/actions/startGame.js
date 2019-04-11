import { GAME_START } from '../event/reduxEvent'

export const startGame = (interval) => {
    return {
        type: GAME_START,
        interval: interval
    }
}