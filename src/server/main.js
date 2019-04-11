import createNewServer from './index'
import params  from '../../params'

const dbParams = {
    path: 'red_tetris',
    clean: false
}

createNewServer(params, dbParams).then(() => {
    console.log('Ready to play tetris.')
})