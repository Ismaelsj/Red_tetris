import { fromJS } from 'immutable'

import { GAME_SET_MANAGER, MESSAGE_REMOVE_NOT, LOGIN_LOGIN, ROOM_CHANGE, MESSAGE_NEW_MESSAGE, ROOM_PLAYER_JOIN, ROOM_PLAYER_LEAVE, ROOM_ROOM_CHANGED, LOGOUT_LOGGINOUT } from '../event/reduxEvent'

const intialState = {
    roomName: null,
    userName: '',
    players: null,
    isManager: false,
    conversation: [],
    isChanging: false,
    msgNot: 0
}


const roomReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case LOGIN_LOGIN:
            return {
                ...state,
                roomName: action.roomName,
                userName: action.userName,
                players: action.players
            }
        case ROOM_PLAYER_JOIN:
            return {
                ...state,
                players: action.players
            }
        case ROOM_PLAYER_LEAVE:
            return {
                ...state,
                players: action.players,
                conversation: []
            }
        case ROOM_CHANGE:
            return {
                ...state,
                roomName: action.roomName,
                players: action.players,
                isManager: false,
                conversation: [],
                isChanging: true,
                msgNot: 0
            }
        case ROOM_ROOM_CHANGED:
            return {
                ...state,
                isChanging: false
            }
        case GAME_SET_MANAGER:
            return {
                ...state,
                isManager: true,
            }
        case MESSAGE_NEW_MESSAGE:
            if (action.message.player !== state.userName) {
                return {
                    ...state,
                    conversation: [...state.conversation, action.message],
                    msgNot: state.msgNot + 1
                }
            }
            return {
                ...state,
                conversation: [...state.conversation, action.message]
            }
        case MESSAGE_REMOVE_NOT:
            return {
                ...state,
                msgNot: 0
            }
        case LOGOUT_LOGGINOUT:
            return intialState
        default:
            return state
    }
}

export default roomReducer