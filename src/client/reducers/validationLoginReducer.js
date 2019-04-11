import { fromJS } from 'immutable'

import { LOGIN_VALIDATE_USER_NAME, LOGOUT_LOGOUT, LOGOUT_LOGGINOUT, LOGIN_LOGIN, INIT_SOCKET } from '../event/reduxEvent'


const intialState = {
    socket: null,
    logginOut: false,
    userName: '',
    roomName: '',
    isValid: false,
    isUsed: false,
    errMsg: ''
}


const validateLoginReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case LOGIN_VALIDATE_USER_NAME:
            return {
                ...state,
                userName: action.userName,
                roomName: action.roomName,
                isValid: action.isValid,
                isUsed: action.isUsed,
                errMsg: action.errMsg,
            }
        case LOGIN_LOGIN:
            return {
                ...state,
                userName: action.userName,
                roomName: action.roomName,
                isValid: true,
                isUsed: false,
                errMsg: 'Success',
            }
        case INIT_SOCKET:
            return {
                ...state,
                socket: action.socket
            }
        case LOGOUT_LOGGINOUT:
            return {
                ...intialState,
                socket: state.socket,
                logginOut: true
            }
        case LOGOUT_LOGOUT:
            return {
                ...intialState,
                socket: state.socket
            }
        default:
            return state
    }
}

export default validateLoginReducer