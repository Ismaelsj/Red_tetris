import React, { useState } from 'react'

import './animation.css'

import { pieceGenerator, createGrid } from './animationUtils'

const animation = () => {

    const size = 100

    const ratioW = Math.floor(window.screen.width/10);

    const ratioH = Math.floor(window.screen.height/10);

    const gap = 8

    const initialPieces = []

    for (let i = 0; i < (ratioW / gap); i++) {
        initialPieces.push(pieceGenerator(gap * i + 1))
    }

    const [pieces, updatePiece] = useState(initialPieces)

    const grid = createGrid(size, ratioW, ratioH, pieces)

    setTimeout(() => {
        const updatedPiece = pieces.map((piece, index) => {
            if (piece.y >= 15) return pieceGenerator(index * gap + 1) 
            return { ...piece, y: piece.y + 1 }
        })
        updatePiece(updatedPiece)
    }, 1500)

    return ( 
        <div>
            {grid}
        </div>
    )
}

export default animation;