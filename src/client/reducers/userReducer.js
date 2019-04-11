import { fromJS } from 'immutable'

import { LOGIN_LOGIN, LOGOUT_LOGGINOUT, INIT_SOCKET } from '../event/reduxEvent'

const intialState = {
    userName: '',
    isAuth: false,
    socket: null,
    room: '',
}


const userReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case LOGIN_LOGIN:
            return {
                ...state,
                userName: action.userName,
                isAuth: true,
                room: action.roomName
            }
        case INIT_SOCKET:
            return {
                ...state,
                socket: action.socket
            }
        case LOGOUT_LOGGINOUT:
            return {
                ...intialState,
                socket: state.socket
            }
        default:
            return state
    }
}

export default userReducer