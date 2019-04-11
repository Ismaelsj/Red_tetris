import fs  from 'fs'
import http from 'http';
import socketIO from 'socket.io';
import mongoose from "mongoose";
import debug from 'debug';

import socketManager from "./socketManager";

const logerror = debug('tetris:error')
const loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
    const {host, port} = params
    const handler = (req, res) => {
      const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../public/index.html'
      fs.readFile(__dirname + file, (err, data) => {
        if (err) {
          logerror(err)
          res.writeHead(500)
          return res.end('Error loading index.html')
        }
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200)
        res.end(data)
      })
    }

    app.on('request', handler);
  
    app.listen({host, port}, () =>{
      console.log(`server listening on ${params.url}`)
      cb()
    })
}

const initSocket = io => {
    io.on('connection', (socket) => {
        loginfo("Socket connected: " + socket.id)
        socketManager(socket)
    })
}

const initDB = (dbParams) => {
    mongoose.connect('mongodb://127.0.0.1:27017/' + dbParams.path, { useNewUrlParser: true }).then(() => {
        loginfo('Connected to mongoDB')
    }).catch(e => {
        loginfo('Error while DB connecting');
        logerror(e);
    });
}

const clearDB = () => {
    return new Promise((resolve) => {
        mongoose.connection.db.dropDatabase(resolve(true));
    })
}

const createNewServer = (params, dbParams) => {
    const promise = new Promise((resolve) => {
      const app = http.createServer()
      initApp(app, params, () =>{
        global.io = module.exports.io = socketIO(app, { pingTimeout: 60000 })
        const stop = (cb) => {
            loginfo('closing socket')
            io.close()
            loginfo('closing app')
            app.close( async () => {
                loginfo('closing db')
                if (dbParams.clean) await clearDB();
                app.unref()
            })
            loginfo(`Engine stopped.`)
            cb()
        }
        initDB(dbParams)
        initSocket(io)
        resolve({stop})
      })
    })
    return promise
}

export default createNewServer;