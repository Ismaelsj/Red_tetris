import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { isNil } from 'ramda'

const DisplayPlayerBorder = (props) => {
    const { GameBoard, Pieces } = props.game
    const board = GameBoard.player
    
    return (
        <Fragment>
            {board.map((row, rowIndex) => {
                return <div className="rows" id={rowIndex} key={`${rowIndex}`}>{row.map((cel, celIndex) => {
                    if (!isNil(Pieces) && !isNil(Pieces[0])) {    
                        let y = rowIndex - Pieces[0].y
                        let x = celIndex - Pieces[0].x
                        if ((!isNil(Pieces[0].piece[y]) && Pieces[0].piece[y][x] === 1) || cel === 1) {
                            return <div className="columns-1" id={`${rowIndex}-${celIndex}`} key={celIndex}></div>;
                        }
                    }
                    return <div className="columns" id={`${rowIndex}-${celIndex}`} key={celIndex}></div>;
                })}</div>
            })}
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        game: state.game
      }
}

export default connect(mapStateToProps)(DisplayPlayerBorder);