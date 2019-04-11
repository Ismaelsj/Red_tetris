import { GAME_STOP } from '../event/reduxEvent'

export const stopGame = () => {
    return {
        type: GAME_STOP
    }
}