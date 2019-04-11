import React from 'react'
import { connect } from 'react-redux'

const DisplayOpponentBorder = (props) => {
    const { GameBoard } = props.game
    const board = GameBoard.opponent
    return (
        <div>
            {board.map((row, rowIndex) => {
                return <div className="rows" id={rowIndex} key={`${rowIndex}`}>{row.map((cel, celIndex) => {  
                    if (cel === 1) {
                        return <div className="columns-1" id={`${rowIndex}-${celIndex}`} key={celIndex}></div>;
                    }
                    return <div className="columns" id={`${rowIndex}-${celIndex}`} key={celIndex}></div>;
                })}</div>
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        game: state.game
      }
}

export default connect(mapStateToProps)(DisplayOpponentBorder);