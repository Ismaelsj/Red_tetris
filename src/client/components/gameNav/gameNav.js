import React, { useState } from 'react'
import { connect } from 'react-redux'

import { isNil, isEmpty } from 'ramda'

import 'semantic-ui-css/semantic.min.css';

import { Container, Header, Icon, Popup, Dimmer, Divider, Loader, Button, Transition, Form, Label } from 'semantic-ui-react'

import { CLIENT_START_GAME, CLIENT_STOP_GAME, CLIENT_PAUSE_GAME, CLIENT_RETURN_GAME } from '../../../server/socketEvent'

import { setManager } from '../../actions/setManager'

import './gameNav.css'

import { gameModes, gameDifficulty } from '../../../gameParms'

const lab = (label) => {
    return (
        <Label size="large" color="black">
            {label}
        </Label>
    )
}

const GameNav = (props) => {

    const { onSetManager } = props
    const { socket, userName } = props.user
    const { roomName, players, isManager } = props.room
    const { Game, isPlaying, Score, GameHistory } = props.game

    const [mode, setMode] = useState(!isNil(gameModes) ? gameModes[0].value : null)
    const [difficulty, setDifficulty] = useState(!isNil(gameDifficulty) ? gameDifficulty[0].value : null)
    const [visible, setVisibility] = useState(true)

    const start = () => {
        socket.emit(CLIENT_START_GAME, { roomName: roomName, mode: mode, difficulty: difficulty })
    }

    const pause = () => {
        socket.emit(CLIENT_PAUSE_GAME, { roomName: roomName })
    }

    const _return = () => {
        socket.emit(CLIENT_RETURN_GAME, { roomName: roomName, mode: mode, difficulty: difficulty })
    }

    const stop = () => {
        socket.emit(CLIENT_STOP_GAME, { roomName: roomName })
    }

    if (!isNil(Game) && visible) {
        setVisibility(false)
    } else if (isNil(Game) && !visible) {
        setVisibility(true)
    }

    if (players.includes(userName) && players.indexOf(userName) === 0 && !isManager) {
        onSetManager()
    }

    return (
        <div className="navigator">
                {/* Controles  */}
            <div className="infoControl">
                <Popup trigger={<Icon circular name='question circle outline' size="large" inverted/>} >
                    <Header as='h2' icon textAlign='center'>Controls</Header>
                    <Icon name="caret up"/> rotation <br/>
                    <Icon name="caret down"/> move down <br/>
                    <Icon name="caret left"/> move left <br/>
                    <Icon name="caret right"/> move right <br/>
                    <Icon name="window minimize"/> drop piece
                </Popup>
            </div>
                {/* Game nav around */}
                    {/* Score */}
            <Container as='h2' className="score" textAlign='center'>{Score}</Container>
                {/* Pause btn */}
            <Transition visible={!visible} animation='horizontal flip' duration={300}>
                <Button className="pauseBtn" onClick={pause} icon="pause" type='submit' size='mini' inverted value="Submit" />
            </Transition>
                {/* Nav */}
            <Transition visible={visible} animation='fade' duration={200} >
                    {/* Game in progress */}
                {!isPlaying ? (
                    <div>
                            {/* Manager View */}
                        {isManager ? (
                            <div>
                                <Dimmer active className="backGround" >
                                        {/* Game history */}
                                    <div className="gameHistory">
                                        {!isEmpty(GameHistory) ? (
                                            <div>
                                                    {/* One player */}
                                                {GameHistory[0].isSolo ? (
                                                    <div>
                                                        <Header as='h2' color="violet">
                                                            You Lost !
                                                        </Header>
                                                        <Container as='h3'>
                                                            {players[0]}: &emsp;    
                                                            <Label color='red' tag size="big" >
                                                                {GameHistory[0].p1Score}
                                                            </Label>
                                                        </Container>
                                                        <div>
                                                            {GameHistory[0].bestScore.new ? (
                                                                <Container as='h4'>
                                                                    New best score: &emsp;    
                                                                    <Label color='green' tag size="large" >
                                                                        {GameHistory[0].bestScore.bestScore.score}
                                                                    </Label>
                                                                </Container>
                                                            )
                                                            :
                                                            (
                                                                <Container as='h4'>
                                                                    Best score: &emsp;    
                                                                    <Label color='grey' tag size="large" >
                                                                        {GameHistory[0].bestScore.bestScore.score}
                                                                    </Label>
                                                                </Container>
                                                            )}
                                                        </div>
                                                        <Divider horizontal  />
                                                    </div>
                                                ) 
                                                : 
                                                (
                                                    // Two players
                                                    <div>
                                                        <Header as='h2' color="red">
                                                            Winner: {GameHistory[0].winner}
                                                        </Header>
                                                        <Container as='h3'>
                                                            {players[0]}: &emsp;    
                                                            <Label color='red' tag size="big" >
                                                                {GameHistory[0].p1Score}
                                                            </Label>
                                                        </Container>
                                                        <Container as='h3'>
                                                            {players[1]}: &emsp;   
                                                            <Label color='red' tag size="big">
                                                                {GameHistory[0].p2Score}
                                                            </Label>
                                                        </Container>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div >
                                        {/* Select game options */}
                                    <div className="gameMenu">
                                        <Form.Group>
                                            <Form.Select
                                                // fluid
                                                label={lab('Game Mode')}
                                                onChange={(e, { value }) => setMode(value)}
                                                options={gameModes}
                                                placeholder='Mode'
                                                value={mode}
                                            />
                                            <Divider horizontal  />
                                            <Form.Select
                                                // fluid
                                                label={lab('Game Difficulty')} 
                                                onChange={(e, { value }) => setDifficulty(value)} 
                                                options={gameDifficulty}
                                                placeholder='Difficulty' 
                                                value={difficulty}
                                            />
                                        </Form.Group>
                                        <Divider horizontal  />
                                        <Form.Button onClick={start} content='Play' icon='play' inverted />
                                    </div>
                                </Dimmer>
                            </div>
                        )
                        :
                        (
                            <div>
                                <Dimmer active>
                                    {/* Game history */}
                                    <div className="gameHistory">
                                        {!isEmpty(GameHistory) ? (
                                            <div>
                                                <Header as='h2' color="red">
                                                    Winner: {GameHistory[0].winner}
                                                </Header>
                                                <Container as='h3'>
                                                    {players[0]}: &emsp;    
                                                    <Label color='red' tag size="big">
                                                        {GameHistory[0].p1Score}
                                                    </Label>
                                                </Container>
                                                <div>
                                                    {players.length > 1 ? (
                                                        <Container as='h3'>
                                                            {players[1]}: &emsp;   
                                                            <Label color='red' tag size="big">
                                                                {GameHistory[0].p2Score}
                                                            </Label>
                                                        </Container>
                                                    ) : null}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                        {/* Waitting player one loader */}
                                    <div className="gameMenu">
                                        <Loader indeterminate size='large'>
                                            Waiting player &emsp;
                                            <span style={{color: '#b30000'}}>{players[0]}</span>
                                        </Loader>
                                    </div>
                                </Dimmer>
                            </div>
                        )}
                    </div>
                )
                :
                (
                    // Game paused
                    <div >
                        <Dimmer active className="pauseMenu">
                            <Button.Group compact vertical>
                                <Button negative content='Resume' icon="play" labelPosition='left' size="huge" onClick={_return} />
                                <Divider horizontal  />
                                <Button inverted content='Stop' icon="stop" labelPosition='left' size="huge" onClick={stop} />
                            </Button.Group>
                        </Dimmer>
                    </div>
                )}
                </Transition>
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

const mapActionToProps = {
    onSetManager: setManager
}

export default connect(mapStateToProps, mapActionToProps)(GameNav);