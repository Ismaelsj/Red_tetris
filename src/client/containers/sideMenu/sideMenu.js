import React from 'react'
import { connect } from 'react-redux'

import { Label, Divider, Icon } from 'semantic-ui-react'

    // css
import './sideMenu.css'

    // components
import SearchRoom from '../../components/searchRoom/searchRoom'
import Logout from '../../components/logout/logout'


const SideMenu = (props) => {

    const { userHash } = props
    const { players } = props.roomState

    const displayPlayers = players.map((player, index) => {
        if (index === 0) {
            return (
                <div key={index} className="players">
                    <Label basic size="huge" color="red" >
                        <Icon name="chess king" />
                        {player}
                    </Label>
                    <Divider horizontal  />
                </div>
            )
        }
        return (
            <div key={index} className="players" >
                <Label basic size="huge" color="red">
                    <Icon name="chess pawn" />
                    {player}
                </Label>
            </div>
        )
    })

    return (
        <div>
            <div className="sideInfo">
                <h1 className="title">RedTetris.</h1>
                <br/>
                <SearchRoom className="searchRoom" userHash={userHash}/>
                <br/>
                {displayPlayers}
                <Logout />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
      roomState: state.room,
      user: state.user
    }
}

export default connect(mapStateToProps)(SideMenu);