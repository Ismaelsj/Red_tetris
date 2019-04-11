import React from 'react'
import { connect } from 'react-redux'

    // css
import './logout.css'

import { Button } from 'semantic-ui-react'

import { CLIENT_USER_DISCONNECT , CLIENT_STOP_GAME} from '../../../server/socketEvent'

const Logout = (props) => {
        // get props
    const { userName, socket } = props.user
    const { roomName } = props.room

    return (
        <Button inverted className="logout" onClick={ () => {
                socket.emit(CLIENT_STOP_GAME, { roomName: roomName })
                socket.emit(CLIENT_USER_DISCONNECT, { name: userName })
            }
        }>logout</Button>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      room: state.room
    }
}

export default connect(mapStateToProps)(Logout);