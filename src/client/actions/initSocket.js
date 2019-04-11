import { INIT_SOCKET } from '../event/reduxEvent'

export const initSocket = (socket) => {
    return {
        type: INIT_SOCKET,
        socket: socket,
    }
}