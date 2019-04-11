import { GAME_PAUSE } from '../event/reduxEvent'

export const pauseGame = () => {
    return {
        type: GAME_PAUSE
    }
}