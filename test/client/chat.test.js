import 'jsdom-global/register';
import React from 'react'
import { shallow, mount } from 'enzyme';
import "babel-polyfill"

import Chat from '../../src/client/components/chat/chat'

import { Provider } from 'react-redux'
import io from 'socket.io-client';
import storeConfig from '../../src/client/middlewares/store'

const serverParams = {
    host: '0.0.0.0',
    port: 8881,
    url: 'http://' + '0.0.0.0' + ':' + '8881' 
}

const { url } = serverParams

const socket = io(url)

const store = storeConfig(socket)

describe('Chat', () => {
    test('chat => render: props -> ...', () => {
        const component = mount(
            <Provider store={store}>
                <Chat />
            </Provider>
        );
        expect(component).toMatchSnapshot();
    });
});