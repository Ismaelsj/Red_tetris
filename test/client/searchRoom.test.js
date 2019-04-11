import '../jsDomSetup'
import React from 'react'
import { mount } from 'enzyme';
import "babel-polyfill"

import SearchRoom from '../../src/client/components/searchRoom/searchRoom'

import createNewServer from '../../src/server/index';

import { Router } from 'react-router-dom'
import history from '../../src/client/middlewares/history';

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'
import { initSocket } from '../../src/client/actions/initSocket'
import { SERVER_ROOM_NOT_FOUND, CLIENT_USER_CONNECTION, SERVER_USER_VALIDE_NAME } from '../../src/server/socketEvent'

const serverParams = {
    host: '0.0.0.0',
    port: 8887,
    url: 'http://' + '0.0.0.0' + ':' + '8887' 
}

const dbParams = {
    path: 'testing-search-room',
    clean: true
}

const { url } = serverParams

const store = {}

const stopServer = {}

describe('Simulate search room =>', () => {
    let socketPlayer1;

    beforeAll(done => {
        createNewServer(serverParams, dbParams).then(stop => {
            stopServer['stop'] = stop.stop
            socketPlayer1 = io(url)
            store['test'] = storeConfig(socketPlayer1)
            store.test.dispatch(initSocket(socketPlayer1))

            socketPlayer1.on(SERVER_USER_VALIDE_NAME, (data) => {
                done();
            })
            socketPlayer1.emit(CLIENT_USER_CONNECTION, { 
                name: 'Jean',
                room: 'Jean'
            })
        })
    })

    afterAll((done) => {
        if (socketPlayer1.connected) socketPlayer1.disconnect();
        setTimeout( async() => {
            stopServer.stop(done)
        }, 1000)
    })

    test('searchRoom :', (done) => {
        const component = mount(
            <Provider store={store.test}>
                <Router history={history}>
                    <SearchRoom />
                </Router>
            </Provider>
        );
        const name = "Ismael";

        socketPlayer1.on(SERVER_ROOM_NOT_FOUND, (res) => {
            expect(res.isValid).toBe(false)
            done()
        })

        component.find('input')
            .props()
            .onChange({ currentTarget: { value: name } })

        component.find('form').simulate('submit');
    });
}) 