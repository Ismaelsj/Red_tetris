import { fromJS } from 'immutable'

import { GAME_MEXT_PIECE, GAME_GET_MALUS, GAME_ADD_GAME_HISTORY, GAME_UPDATE_SCORE, GAME_NEW_PIECES, GAME_NEW_REPLACEMENT_PIECES, ROOM_CHANGE, GAME_START, GAME_STOP, GAME_UPDATE_PLAYER_BOARD, GAME_UPDATE_OPPONENT_BOARD, GAME_TERIS_MOVE, ROOM_PLAYER_LEAVE, LOGOUT_LOGGINOUT, GAME_PAUSE } from '../event/reduxEvent'

const templateEmptyBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const intialState = {
    Game: null,
    Score: 0,
    Malus: 0,
    isPlaying: false,
    Pieces: [],
    GameHistory: [],
    GameBoard: {
        player: templateEmptyBoard,
        opponent: templateEmptyBoard
    }
}


const gameReducer = (state = fromJS(intialState), action) => {
    switch (action.type) {
        case GAME_NEW_PIECES:
            return {
                ...state,
                Pieces: [...state.Pieces, ...action.pieces]
            }
        case GAME_NEW_REPLACEMENT_PIECES:
            return {
                ...state,
                GameBoard: intialState.GameBoard,
                Pieces: action.pieces
            }
        case ROOM_CHANGE:
            return {
                ...state,
                Game: null,
                GameBoard: {
                    player: templateEmptyBoard,
                    opponent: templateEmptyBoard
                },
            }
        case ROOM_PLAYER_LEAVE:
            return {
                ...state,
                GameBoard: {
                    ...intialState.GameBoard,
                }
            }
        case GAME_START:
            if (state.isPlaying) {
                return {
                    ...state,
                    isPlaying: true,
                    Score: state.Score,
                    Game: action.interval
                }
            }
            return {
                ...state,
                isPlaying: true,
                Score: 0,
                Malus: 0,
                GameBoard: intialState.GameBoard,
                Game: action.interval
            }
        case GAME_PAUSE:
            return {
                ...state,
                Game: null
            }
        case GAME_STOP:
            return {
                ...state,
                isPlaying: false,
                Game: null,
                Score: 0,
                Malus: 0,
                GameBoard: intialState.GameBoard,
                Pieces: []
            }
        case GAME_UPDATE_SCORE:
            return {
                ...state,
                Score: state.Score + action.score
            }
        case GAME_GET_MALUS:
            return {
                ...state,
                Malus: state.Malus + action.nbLine
            }
        case GAME_UPDATE_PLAYER_BOARD:
            return {
                ...state,
                GameBoard: {
                    ...state.GameBoard,
                    player: action.newBoard
                }
            }
        case GAME_MEXT_PIECE:
            state.Pieces.shift()
            return state
        case GAME_UPDATE_OPPONENT_BOARD:
            return {
                ...state,
                GameBoard: {
                    ...state.GameBoard,
                    opponent: action.newBoard
                }
            }
        case GAME_ADD_GAME_HISTORY:
            return {
                ...state,
                GameHistory: [action.game, ...state.GameHistory]
            }
        case GAME_TERIS_MOVE:
            const Pieces = state.Pieces
            const newPieces = Pieces.map((piece, index) => {
                return index === 0 ? action.piece : piece;
            })
            return {
                ...state,
                Pieces: newPieces
            }
        case LOGOUT_LOGGINOUT:
            return intialState
        default:
            return state
    }
}

export default gameReducer