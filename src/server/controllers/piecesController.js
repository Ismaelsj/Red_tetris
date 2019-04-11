
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

const random = (nb) => { 
    return Math.floor(Math.random() * nb)
};

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

export const pieceGenerator = () => {
    try {
        let block = pieces[random(7)]
        for (let i = 0; i <= random(7); i++) block = rotate(block)

        const Piece = {
            piece: block,
            y: -block.length,
            x: 3,
        }
        return Piece
    } catch (e) { throw e }
}

export default class Pieces {
    static piecesPackGenerator() {
        const pack = []
        for (let i = 0; i < 50; i++) {
            pack.push(pieceGenerator())
        }
        return pack
    }
}