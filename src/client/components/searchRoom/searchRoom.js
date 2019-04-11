import React, { useState } from 'react'
import { connect } from 'react-redux'

    // css
import './searchRoom.css'

import { Input, Segment } from 'semantic-ui-react'

import { CLIENT_USER_CHANGE_ROOM, SERVER_ROOM_NOT_FOUND, SERVER_USER_CHANGE_ROOM } from '../../../server/socketEvent'

const SearchRoom = (props) => {

    const [roomInput, setRoomInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const roomInputRef = React.createRef()

        // get props
    const { userName, socket } = props.user
    const { errMsg } = props.roomChange

    socket.on(SERVER_ROOM_NOT_FOUND, () => {
        setIsLoading(false)
    })
    socket.on(SERVER_USER_CHANGE_ROOM, () => {
        setIsLoading(false)
    })
    
    return (
        <div>
            <form onSubmit={(event) => {
                    event.preventDefault()
                    const searchedRoom = roomInput;
                    roomInputRef.current.inputRef.value = ''
                    setIsLoading(true)
                    socket.emit(CLIENT_USER_CHANGE_ROOM, { searchedRoom: searchedRoom, userName: userName })
                }
            }>
                <Segment inverted color={'black'}>
                <Input
                    disabled={isLoading}
                    loading={isLoading}
                    ref={roomInputRef}
                    error
                    size={'large'}
                    transparent={true}
                    onChange={(event) => setRoomInput(event.currentTarget.value)}
                    placeholder="Search a room.."
                    type='text'
                    id='searchedRoom'
                />
                </Segment >
            </form>
            <span className="errorMessage">{errMsg}</span>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      roomChange: state.changeRoom
    }
}

export default connect(mapStateToProps)(SearchRoom);