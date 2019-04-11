import { LOGOUT_LOGOUT } from '../event/reduxEvent'

export const logoutUser = () => {
    return {
        type: LOGOUT_LOGOUT,
    }
}