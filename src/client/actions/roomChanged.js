import { ROOM_ROOM_CHANGED } from '../event/reduxEvent'

export const roomChanged = () => {
    return {
        type: ROOM_ROOM_CHANGED
    }
}