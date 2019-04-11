import { fromJS } from 'immutable'

import { ROOM_VALIDATE, ROOM_CHANGE, LOGOUT_LOGGINOUT } from '../event/reduxEvent'

const intialState = {
    isValid: false,
    errMsg: ''
}


const validateRoomReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case ROOM_VALIDATE:
            return {
                isValid: action.isValid,
                errMsg: action.errMsg
            }
        case ROOM_CHANGE:
            return {
                isValid: true,
                errMsg: ''
            }
        case LOGOUT_LOGGINOUT:
            return intialState
        default:
            return state
    }
}

export default validateRoomReducer