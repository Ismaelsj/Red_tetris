# Red Tetris
![Current Version](https://img.shields.io/badge/version-0.1.1-green.svg)

Multiplayers tetris, Full Stack Javascript, Node-js React-js redux 

![red tetris](./img/multi_in_game.png)

## Technologies
* Backend
    * Node-js 11.4.0
    * Mongoose 5.4.8
* Frontend 
    * React 16.8.4
    * Redux 4.0.1
    * redux-thunk 2.3.0
* Tests
    * Jest 24.5.0
    * Enzyme 3.9.0
    * Jsdom 14.0.0
* Others
    * Socket.io 2.2
    * Webpack 4.29.6
    * semantic-ui-react 0.85.0

### Dependencies
* mongodb
* yarn

### Setup
> create a database folder
```
mkadir <path to data folder>/data
mkadir <path to data folder>/data/red_tetris
```
```
mongod --dbpath <path to root>/data/red_tetris
yarn
yarn build
yarn server 
```

Now go on localhost at : `http://0.0.0.0:8080`


**Note**: To play on your network:
In `./params.js` replace `host` value with your network ip. 