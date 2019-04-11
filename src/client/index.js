import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

    // socket.io
import io from 'socket.io-client';

    // redux
import { Provider } from 'react-redux'

    // routes
import { Router, Route } from 'react-router-dom'
import history from './middlewares/history';

    // components
import Home from './containers/App';

import storeConfig from './middlewares/store'

import { initSocket } from './actions/initSocket'

import params  from '../../params'

    // server URL
const url = params.url

const socket = io(url)

const store = storeConfig(socket)

store.dispatch(initSocket(socket))
  
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Home}/>
        </Router>
    </Provider>, document.getElementById('root'));