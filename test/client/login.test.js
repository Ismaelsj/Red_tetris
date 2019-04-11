import '../jsDomSetup'
import React from 'react'
import { mount } from 'enzyme';
import "babel-polyfill"

import Login from '../../src/client/components/login/login'

import createNewServer from '../../src/server/index';

import { Router } from 'react-router-dom'
import history from '../../src/client/middlewares/history';

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'
import { initSocket } from '../../src/client/actions/initSocket'
import { SERVER_USER_VALIDE_NAME } from '../../src/server/socketEvent'

const serverParams = {
    host: '0.0.0.0',
    port: 8888,
    url: 'http://' + '0.0.0.0' + ':' + '8888' 
}

const dbParams = {
    path: 'testing-login',
    clean: true
}

const { url } = serverParams

const store = {}

const stopServer = {}

describe('Simulate connection =>', () => {
    let socketPlayer1;

    beforeAll(done => {
        createNewServer(serverParams, dbParams).then(stop => {
            stopServer['stop'] = stop.stop

            socketPlayer1 = io(url)

            store['test'] = storeConfig(socketPlayer1)
            store.test.dispatch(initSocket(socketPlayer1))

            socketPlayer1.on('connect', () => done())
            global.io.to(`${socketPlayer1.id}`).emit('connect')
        })
    })

    afterAll((done) => {
        if (socketPlayer1.connected) socketPlayer1.disconnect();
        setTimeout( async() => {
            stopServer.stop(done)
        }, 1000)
    })

    test('login: connect', (done) => {
        const component = mount(
            <Provider store={store.test}>
                <Router history={history}>
                    <Login />
                </Router>
            </Provider>
        );
        const name = "Jean";

        socketPlayer1.on(SERVER_USER_VALIDE_NAME, (res) => {
            expect(res.userName).toEqual(name)
            done()
        })

        component.find('input')
            .props()
            .onChange({ currentTarget: { value: name } })

        component.find('form').simulate('submit');
    });
}) 