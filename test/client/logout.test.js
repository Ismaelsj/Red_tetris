import '../jsDomSetup'
import React from 'react'
import { mount } from 'enzyme';
import "babel-polyfill"

import Logout from '../../src/client/components/logout/logout'

import createNewServer from '../../src/server/index';

import { Router } from 'react-router-dom'
import history from '../../src/client/middlewares/history';

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'
import { initSocket } from '../../src/client/actions/initSocket'
import { CLIENT_USER_CONNECTION, SERVER_USER_VALIDE_NAME, SERVER_USER_DISCONNECT } from '../../src/server/socketEvent'
import { LOGOUT_LOGGINOUT } from '../../src/client/event/reduxEvent'

const serverParams = {
    host: '0.0.0.0',
    port: 8886,
    url: 'http://' + '0.0.0.0' + ':' + '8886' 
}

const dbParams = {
    path: 'testing-logout',
    clean: true
}

const { url } = serverParams

const store = {}

const stopServer = {}

describe('Logout =>', () => {
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

    test('logout :', (done) => {
        const component = mount(
            <Provider store={store.test}>
                <Router history={history}>
                    <Logout />
                </Router>
            </Provider>
        );

        socketPlayer1.on(SERVER_USER_DISCONNECT, (res) => {
            expect(res.type).toEqual(LOGOUT_LOGGINOUT)
            done()
        })

        component.simulate('click');
    });
}) 