import React from 'react'

import { isNil } from 'ramda'

const pieces = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,1],
        [0,1,0],
        [0,1,0]
    ],
    [
        [0,1,1],
        [0,1,0],
        [0,1,0]
    ],
    [
        [0,0,0,0],
        [0,1,1,0],
        [0,1,1,0],
        [0,0,0,0]
    ],
    [
        [0,1,0],
        [0,1,1],
        [0,0,1]
    ],
    [
        [0,0,1],
        [0,1,1],
        [0,1,0]
    ],
    [
        [0,1,0],
        [1,1,0],
        [0,1,0]
    ]
]

const random = (nb) => Math.floor(Math.random() * nb)

const rotate = (piece) => {
    try {
        let toModify = piece.reverse()
        let newPiece = []
        newPiece = toModify[0].map((col, index) => {
            return toModify.map(row => row[index])
        })
        return newPiece
    } catch (e) { throw e }
};

const boarder = size => {
    let board = []
    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            let div = <div style={{width: size - 1, height: size - 1}}/>
            board[i].push(div)
        }
    }
    return board
}

export const pieceGenerator = (x) => {
    try {
        let block = pieces[random(7)]
        for (let i = 0; i <= random(7); i++) block = rotate(block)

        const Piece = {
            piece: block,
            y: -random(20),
            x: x,
        }
        return Piece
    } catch (e) { throw e }
}

export const createGrid = (size, ratioW, ratioH, pieces) => {    
    let board = boarder(size)

    return (
        <div className="grid" style={{width: ratioW  * size, height: ratioH  * size}}>
            {board.map((row, rowIndex) => {
                return <div className="rows" style={{width: ratioW  * size, height: size}}>{row.map((cel, celIndex) => {
                    if (!isNil(pieces)) {
                        for (let piece in pieces) {
                            let y = rowIndex - pieces[piece].y
                            let x = celIndex - pieces[piece].x
                            if ((!isNil(pieces[piece].piece[y]) && !isNil(pieces[piece].piece[y][x]) && pieces[piece].piece[y][x] === 1)) {
                                return <div className="cel" style={{ width: size, height: size }}/>
                            }
                        } 
                    }
                    return <div className={`cell -${rowIndex}`} style={{ width: size, height: size }}/>
                })}</div>
            })}
        </div>
    )   

}