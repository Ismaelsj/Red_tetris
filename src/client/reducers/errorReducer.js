import { fromJS } from 'immutable'

import { INTERNAL_ERROR } from '../event/reduxEvent'

const intialState = {
    intenalError: false
}


const gameReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case INTERNAL_ERROR:
            return {
                ...state,
                intenalError: true,
            }
        default:
            return intialState
    }
}

export default gameReducer