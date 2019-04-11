import React, { useState } from 'react'
import { connect } from 'react-redux'

import { isNil } from 'ramda'

import './login.css'

import { CLIENT_USER_CONNECTION } from '../../../server/socketEvent'

import { Input } from 'semantic-ui-react'

import { SERVER_USER_INVALIDE_NAME } from '../../../server/socketEvent'

// import Animation from '../animation/animation'

const Login = (props) => {

    const [nicknameInput, setNickname] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const nameInputRef = React.createRef()

        // get redux store
    const { socket, errMsg, logginOut } = props.login
    const { userHash } = props

    if (userHash && !isNil(userHash.userName) && !logginOut) {
        socket.emit(CLIENT_USER_CONNECTION, { name: userHash.userName, room: userHash.roomName })
    }

    socket.on(SERVER_USER_INVALIDE_NAME, () => {
        setIsLoading(false)
    })

    const handleOnSubmit = (event) => {
        event.preventDefault()
        const nickName = nicknameInput;
        setIsLoading(true)
        socket.emit(CLIENT_USER_CONNECTION, { name: nickName, room: null })
        nameInputRef.current.inputRef.value = ''
    }


    return (
        <div>
            {/* <Animation/> */}
            <div className="loginForm">
                <h1>Got a nickname ?</h1>
                <form id="form" onSubmit={(e) => handleOnSubmit(e)}>
                    <Input
                        className="nickname"
                        disabled={isLoading}
                        loading={isLoading}
                        ref={nameInputRef}
                        focus
                        onChange={(event) => { setNickname(event.currentTarget.value) } }
                        placeholder='NickName...'
                    />
                </form>
                <div>{errMsg}</div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      login: state.login,
      user: state.user
    }
}

export default connect(mapStateToProps)(Login);