import 'jsdom-global/register';
import React from 'react'
import { mount } from 'enzyme';
import "babel-polyfill"

import GameNav from '../../src/client/components/gameNav/gameNav'

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'

const serverParams = {
    host: '0.0.0.0',
    port: 8880,
    url: 'http://' + '0.0.0.0' + ':' + '8880' 
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

describe('Game navigation', () => {
    it('game navigation => render: props -> ...', () => {
        const component = mount(
            <Provider store={store}>
                <GameNav />,
            </Provider>
        );
        expect(component).toMatchSnapshot();
    });
});