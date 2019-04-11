import React from 'react'
import { connect } from 'react-redux'

import GameNav from '../../components/gameNav/gameNav'

import 'semantic-ui-css/semantic.min.css';

import './gameBorder.css'

import DisplayNextPieces from '../../components/nextPieces/nextPieces'
import DisplayPlayerBorder from '../../components/displayBoard/displayPlayerBorder'
import DisplayOpponentBorder from '../../components/displayBoard/displayOpponentBorder'


const GameBorder = (props) => {

    const { players } = props.room
    const { isPlaying } = props.game

    return ( 
        <div className="player">
            <GameNav/>
            <div className="playerBoard">
                <DisplayPlayerBorder />
            </div> 
            <div  className="infoPlayer">
                { players.length > 1 ? (
                    <div className="board">
                        <div className="opponentBoard">
                            <DisplayOpponentBorder />
                        </div>
                    </div>
                ) : (null) }
                { isPlaying ? (
                    <div className="pieces">
                        <div className="nextPieces">
                            <DisplayNextPieces/>
                        </div>
                    </div>
                ) : (null) }
            </div>
        </div >
    )
}
const mapStateToProps = (state) => {
    return {
        room: state.room,
        game: state.game
      }
}

export default connect(mapStateToProps)(GameBorder);