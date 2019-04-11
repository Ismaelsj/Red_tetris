import { LOGOUT_LOGGINOUT } from '../event/reduxEvent'

export const logginOutUser = () => {
    return {
        type: LOGOUT_LOGGINOUT,
    }
}