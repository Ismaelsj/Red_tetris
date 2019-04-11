import 'jsdom-global/register';
import React from 'react'
import { mount } from 'enzyme';
import "babel-polyfill"

import DisplayPlayerBorder from '../../src/client/components/displayBoard/displayPlayerBorder'

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'

import { GAME_NEW_REPLACEMENT_PIECES } from '../../src/client/event/reduxEvent'

const serverParams = {
    host: '0.0.0.0',
    port: 8883,
    url: 'http://' + '0.0.0.0' + ':' + '8883' 
}

const { url } = serverParams

const socket = io(url)

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

const initialStore = {
    error: {
        intenalError: false
    },
    user: {
        userName: 'Ismael',
        isAuth: false,
        socket: null,
        room: 'Ismael',
    },
    room: {
        roomName: 'Ismael',
        userName: 'Ismael',
        players: ['Ismael'],
        isManager: false,
        conversation: [],
        isChanging: false,
        msgNot: 0,
    },
    game: {
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
    },
    login: {
        socket: null,
        logginOut: false,
        userName: 'Ismael',
        roomName: 'Ismael',
        isValid: true,
        isUsed: false,
        errMsg: 'Scucess'
    },
    changeRoom: {
        isValid: false,
        errMsg: ''
    }
}

const store = storeConfig(socket, initialStore)

const pieces = [
    {
        piece: [
            [0,1,1],
            [0,1,0],
            [0,1,0]
        ],
        y: 4,
        x: 5
    },
    {
        piece: [
            [1,1,0],
            [0,1,0],
            [0,1,0]
        ],
        y: 4,
        x: 5
    }
]

const newPieces = { type: GAME_NEW_REPLACEMENT_PIECES, 
        pieces: pieces }

store.dispatch(newPieces)

describe('Chat', () => {
    it('chat => redner: props -> ...', () => {
        const component = mount(
            <Provider store={store}>
                <DisplayPlayerBorder />,
            </Provider>
        );
        expect(component).toMatchSnapshot();
    });
});