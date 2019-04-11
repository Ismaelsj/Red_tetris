const INIT_SOCKET = 'init:initSocket'
const INTERNAL_ERROR = 'error:internalError'

    // login
const LOGIN_LOGIN = 'login:createUser'
const LOGIN_VALIDATE_USER_NAME = 'login:validateUserName'

    // validations
const LOGOUT_LOGGINOUT = 'logout:logginOut'
const LOGOUT_LOGOUT = 'logout:logout'

    // room events
const ROOM_VALIDATE = 'room:validateRoom'
const ROOM_CHANGE = 'room:changeRoom'
const ROOM_ROOM_CHANGED = 'room:roomChanged'
const ROOM_PLAYER_JOIN = 'room:playerJoin'
const ROOM_PLAYER_LEAVE = 'room:playerLeave'

    // message
const MESSAGE_NEW_MESSAGE = 'message:newMessage'
const MESSAGE_REMOVE_NOT = 'message:removeNot'

    // game events
const GAME_GET_MALUS = 'game:getMalus'
const GAME_SET_MANAGER = 'game:setManager'
const GAME_START = 'game:startGame'
const GAME_STOP = 'game:stopGame'
const GAME_PAUSE = 'game:pauseGame'
const GAME_MEXT_PIECE = 'game:nextPiece'
const GAME_UPDATE_PLAYER_BOARD = 'game:updatePlayerBoard'
const GAME_UPDATE_OPPONENT_BOARD = 'game:updateOpponentBoard'
const GAME_TERIS_MOVE = 'game:tetrisMove'
const GAME_NEW_PIECES = 'game:newPieces'
const GAME_NEW_REPLACEMENT_PIECES = 'game:newReplacementPieces'
const GAME_UPDATE_SCORE = 'game:updateScore'
const GAME_ADD_GAME_HISTORY = 'game:addGameHistory'

export {
    INIT_SOCKET,
    INTERNAL_ERROR,

    LOGIN_LOGIN,
    LOGIN_VALIDATE_USER_NAME,

    LOGOUT_LOGGINOUT,
    LOGOUT_LOGOUT,

    ROOM_VALIDATE,
    ROOM_CHANGE,
    ROOM_ROOM_CHANGED,
    ROOM_PLAYER_JOIN,
    ROOM_PLAYER_LEAVE,

    MESSAGE_NEW_MESSAGE,
    MESSAGE_REMOVE_NOT,

    GAME_GET_MALUS,
    GAME_SET_MANAGER,
    GAME_START,
    GAME_PAUSE,
    GAME_STOP,
    GAME_MEXT_PIECE,
    GAME_UPDATE_PLAYER_BOARD,
    GAME_UPDATE_OPPONENT_BOARD,
    GAME_TERIS_MOVE,
    GAME_NEW_PIECES,
    GAME_NEW_REPLACEMENT_PIECES,
    GAME_UPDATE_SCORE,
    GAME_ADD_GAME_HISTORY
};