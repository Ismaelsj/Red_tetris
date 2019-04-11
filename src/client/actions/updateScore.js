import { GAME_UPDATE_SCORE } from '../event/reduxEvent'

export const updateSocre = (score) => {
    return {
        type: GAME_UPDATE_SCORE,
        score: score
    }
}