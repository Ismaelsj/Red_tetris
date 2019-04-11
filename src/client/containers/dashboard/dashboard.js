import React from 'react'
import { connect } from 'react-redux'

import { isNil, equals } from 'ramda'

    // css
import './dashboard.css'

    // container
import SideMenu from '../sideMenu/sideMenu'

    // components
import Chat from '../../components/chat/chat'
import GameBorder from '../gameBoard/gameBorder'

import { CLIENT_USER_CHANGE_ROOM } from '../../../server/socketEvent'

const Dashboard = (props) => {

    const { userHash } = props
    const { userName, socket } = props.user
    const { roomName, isChanging } = props.room

    if (isChanging === false && !isNil(userHash.userName) && !equals(userHash.roomName, roomName)) {
        socket.emit(CLIENT_USER_CHANGE_ROOM, { searchedRoom: userHash.roomName, userName: userName })
    }

    return (
        <div className="dashboard" >
            <SideMenu userHash={userHash}/>
            <GameBorder />
            <Chat />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      room: state.room,
      game: state.game
    }
}

export default connect(mapStateToProps)(Dashboard);