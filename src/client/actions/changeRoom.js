import { ROOM_CHANGE } from '../event/reduxEvent'

export const changeRoom = (newRoom, roomPlayers, pieces) => {
    return {
        type: ROOM_CHANGE,
        roomName: newRoom,
        players: roomPlayers,
        pieces: pieces
    }
}