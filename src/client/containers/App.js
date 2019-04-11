import React, { Fragment } from 'react';
import { connect } from 'react-redux'

  // components
import Dashboard from './dashboard/dashboard'
import Login from '../components/login/login'

  // routes
import { Route } from 'react-router-dom';

  // url parse
import { gotToLogin } from '../../server/utils/utils'

const App = (props) => {

    const { isAuth } = props.user
    const { intenalError } = props.error
    const gameUrl = window.location.href

    if (intenalError) {
      return (
        <div style={{textAlign: "center"}}>
          <h1>Internal error</h1>
        </div>
      )
    }

    return (
      <Fragment>
        <Route path="/" render={() => (
          isAuth ? (
            <Dashboard userHash={ gotToLogin(gameUrl) } />
          ) : (
            <Login userHash={ gotToLogin(gameUrl) } />
          )
        )}/>
      </Fragment>
    );
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
    user: state.user
  }
}

export default connect(mapStateToProps)(App);
