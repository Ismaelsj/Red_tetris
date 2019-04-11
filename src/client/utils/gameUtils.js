import { contains } from 'ramda'

export const inVertBoard = (board, y) => {
    return (y < board.length && y >= 0)
}

export const inHorizBoard = (board, x) => {
    return (x < board[0].length && x >= 0)
}

export const inBoard = (board, x, y) => {
    return inVertBoard(board, y) && inHorizBoard(board, x)
}

export const rotate = (piece) => {
    try {
        let toModify = piece.piece.slice().reverse()
        let newPiece = {
            piece: [],
            x: piece.x,
            y: piece.y
        }
        newPiece.piece = toModify[0].map((col, index) => {
            return toModify.map(row => row[index])
        })
        return newPiece
    } catch (e) { throw e }
};

export const checkRotateMove = (board, piece) => {
    const res = piece.piece.map((row, rowIndex) => {
        let y = piece.y + rowIndex
        if (y < 0) return 0
        let checkrow = row.map((cel, celIndex) => {
            let x = piece.x + celIndex
            if (cel === 1 && (!inBoard(board, x, y) || board[y][x] === 1)) {
                return -1
            }
            return 0
        })
        if(checkrow.includes(-1)) return -1
        else return 0
    })
    if(res.includes(-1)) return false
    else return true
}


export const checkLeftMove = (board, piece, nbTime) => {
    const res = piece.piece.map((row, rowIndex) => {
        let y = piece.y + rowIndex
        let checkrow = row.map((cel, celIndex) => {
            let x = piece.x + celIndex - nbTime
            if (y < 0 && inHorizBoard(board, x)) return 0
            else if (cel === 1 && (!inBoard(board, x, y) || board[y][x] === 1)) {
                return -1
            }
            return 0
        })
        if(checkrow.includes(-1)) return -1
        else return 0
    })
    if(res.includes(-1)) return false
    else return true
}


export const checkRightMove = (board, piece, nbTime) => {
    const res = piece.piece.map((row, rowIndex) => {
        let y = piece.y + rowIndex
        let checkrow = row.map((cel, celIndex) => {
            let x = piece.x + celIndex + nbTime
            if (y < 0 && inHorizBoard(board, x)) return 0
            else if (cel === 1 && (!inBoard(board, x, y) || board[y][x] === 1)) {
                return -1
            }
            return 0
        })
        if(checkrow.includes(-1)) return -1
        else return 0
    })
    if(res.includes(-1)) return false
    else return true
}

export const checkDownMove = (board, piece, nbTime) => {
    const res = piece.piece.map((row, rowIndex) => {
        let y = piece.y + rowIndex + nbTime
        if (y < 0) return 0
        let checkrow = row.map((cel, celIndex) => {
            let x = piece.x + celIndex
            if (cel === 1 && (!inBoard(board, x, y) || board[y][x] === 1)){
                return -1
            }
            return 0
        })
        if(checkrow.includes(-1)) return -1
        else return 0
    })
    if(res.includes(-1)) return false
    else return true
}

export const straigthToBottom = (board, piece) => {
    let i;
    for (i = 1; i < (board.length -1 + piece.piece.length); i++) {
        if (!checkDownMove(board, piece, i)) {
            return i - 1
        }
    }
    return i - 1
}


export const valideNextMove = (piece, board, move) => {
    switch (move) {
        case 'ArrowLeft': // Left
            const left = checkLeftMove(board, piece, 1)
            if (left) {
                const newPiece = {...piece, x: piece.x - 1}
                return { isValide: true, piece: newPiece, y: piece.y, score: 0 }
            } else return { isValide: false, piece: null, y: piece.y, score: 0 }
        case 'ArrowRight': // Right
            const right = checkRightMove(board, piece, 1)
            if (right) {
                const newPiece = {...piece, x: piece.x + 1}
                return { isValide: true, piece: newPiece, y: piece.y, score: 0 }
            } else return { isValide: false, piece: null, y: piece.y, score: 0 }
        case 'ArrowDown': // Down
            const down = checkDownMove(board, piece, 1)
            if (down) {
                let newPiece = { ...piece, y: piece.y + 1 }
                return { isValide: true, piece: newPiece, y: newPiece.y, score: 1 }
            } else {
                return { isValide: "bottom", piece: null, y: piece.y, score: 1 }
            }
        case 'ArrowUp': // Up
            const rotatedPiece = rotate(piece)
            const rotated = checkRotateMove(board, rotatedPiece)
            if (rotated) {
                return { isValide: true, piece: rotatedPiece, y: piece.y, score: 0 }
            } else {
                return { isValide: false, piece: null, y: piece.y, score: 0 }
            }
        case ' ':
            const nbMoves = straigthToBottom(board, piece)
            const newPiece = { ...piece, y: piece.y + nbMoves }
            return { isValide: true, piece: newPiece, y: newPiece.y, score: nbMoves }
        default: {
            return ;
        }
      }
}

export const getNewBoard = (row, rowIndex, piece, board) => {
        // change values if piece's in area
    if (rowIndex >= piece.y && rowIndex - piece.y < piece.piece.length) {
            // map row to change cell values
        const newRow = row.map((cel, colIndex) => {
                // get piece's index
            let pieceIndexY = rowIndex - piece.y
            let pieceIndexX = colIndex - piece.x
                // only change if value in actual cell
            if ((piece.piece[pieceIndexY][pieceIndexX] === 1) || cel === 1) {
                return 1
            } else {
                return 0
            }
        })
        return newRow
    } else {
        const newRow = row.map((cel, colIndex) => {
            return board[rowIndex][colIndex]
        })
        return newRow
    }
}

export const removeLine = (board, nbFixedLine) => {
    const allEqual = arr => contains(0, arr)
    const filtredBoard = []
    for (let i = 0; i < board.length - nbFixedLine; i++) {
        if (allEqual(board[i])) {
            filtredBoard.push(board[i])
        }
    }
    const nbLine = (board.length - nbFixedLine) - filtredBoard.length
    const virginLine = filtredBoard[0].map(() => {
        return 0
    })
    const plainLine = filtredBoard[0].map(() => {
        return 1
    })
    if (nbLine > 0) {
        for (let i = nbLine; i > 0; i--) filtredBoard.unshift(virginLine);
    }
    for (let i = nbFixedLine; i > 0; i--) filtredBoard.push(plainLine);

    return { filtredBoard, nbLine }
}