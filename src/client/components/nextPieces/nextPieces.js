import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { isNil } from 'ramda'

const DisplayNextPieces = (props) => {
    const { Pieces } = props.game
    if (isNil(Pieces) || Pieces.length < 3) {
        return (<div></div>)
    }
    const piece0 = Pieces[1]
    const piece1 = Pieces[2]
    return (
        <div>
            <div className="piece-1">
                <Fragment>
                    {piece0.piece.map((row, rowIndex) => {
                        return <div key={rowIndex}>{row.map((cel, celIndex) => {
                            if (cel === 1) {
                                return <div className="columns-1" key={celIndex}></div>
                            }
                            return <div className="columns" key={celIndex}></div>
                        })}</div>
                    })}
                </Fragment>
            </div>
            <div className="piece-2">
                <Fragment>
                    {piece1.piece.map((row, rowIndex) => {
                        return <div key={rowIndex}>{row.map((cel, celIndex) => {
                            if (cel === 1) {
                                return <div className="columns-1" key={celIndex}></div>
                            }
                            return <div className="columns" key={celIndex}></div>
                        })}</div>
                    })}
                </Fragment>
            </div>
        </div>
        
    )
}

const mapStateToProps = (state) => {
    return {
        game: state.game
    }
}

export default connect(mapStateToProps)(DisplayNextPieces);