import { MESSAGE_NEW_MESSAGE } from '../event/reduxEvent'

export const newMessage = (message) => {
    return {
        type: MESSAGE_NEW_MESSAGE,
        message: message
    }
}