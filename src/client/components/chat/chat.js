import React, { useState } from 'react'
import { connect } from 'react-redux'

import { CLIENT_SEND_MESSAGE } from '../../../server/socketEvent'

import { newMessage } from '../../actions/newMessage'
import { removeMsgNot } from '../../actions/removeMsgNot'

import './chat.css'

import 'semantic-ui-css/semantic.min.css';

import { Input, Divider, Icon, Label } from 'semantic-ui-react'

const Chat = (props) => {

    const [chatInput, setChatInput] = useState("");

    const { onNewMessage, onRemoveMsgNot } = props
    const { roomName, conversation, msgNot } = props.roomState
    const { userName, socket } = props.user

    const chatNavRef = React.createRef()
    const chatInputRef = React.createRef()
    const chatScrollRef = React.createRef()

    const diplsayMessages = conversation.map((msg, index, messages) => {
        if (messages[index].player === userName) {
            return (
                <li key={index} className="sender">{msg.message}</li>
            )
        } else {
            return (
                <li key={index} className="receiver">{msg.message}</li>
            )
        }
    })

    const sendMassage = () => {
        if (chatInput.length > 0) {
            const convo = { player: userName, message: chatInput, send_at: Date.now() }
            onNewMessage(convo)
    
            socket.emit(CLIENT_SEND_MESSAGE, {
                roomName: roomName,
                message: convo
            })
        }
    }

    const openForm = () => {
        onRemoveMsgNot()
        chatNavRef.current.style.display = 'block'
    }
      
    const closeForm = () => {
        chatNavRef.current.style.display = 'none'
    }

    return (
        <div>
            <button type="button" className="open-button" onClick={openForm}>
                { msgNot > 0 ? (
                    <Label color='red' floating>
                        {msgNot}
                    </Label>
                ) : (null)}
                Chat
            </button>
            <div className="chat-popup" id="myForm" ref={chatNavRef}>
                <div className="form-container">
                    <div className="messageBox">
                        <div className="messages" ref={chatScrollRef}>
                            <ul>
                                {diplsayMessages}
                            </ul>
                        </div>
                        <div className="input">
                            <Divider horizontal>
                                <Icon name='chat' inverted/>
                            </Divider>
                            <form className="inputMsg" onSubmit={(event) => {
                                    event.preventDefault()
                                    sendMassage()
                                    chatInputRef.current.inputRef.value = ''
                                    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
                                }
                            }>
                            <Input ref={chatInputRef} inverted fluid placeholder="Message..." onChange={(event) => setChatInput(event.currentTarget.value)}/>
                        </form>
                        </div>
                    </div>
                    <button type="button" className="btn cancel" onClick={closeForm}>Close</button>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        roomState: state.room,
      }
}

const mapActionToProps = {
    onNewMessage: newMessage,
    onRemoveMsgNot: removeMsgNot,
}

export default connect(mapStateToProps, mapActionToProps)(Chat);