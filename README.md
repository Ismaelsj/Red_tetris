# Red Tetris

Multiplayers tetris, Full Stack Javascript.

![red tetris](./img/multi_in_game.png)

### Dependencies
* mongodb
* yarn

### Requirement
> create a database folder
```
mkadir <path to data folder>/data
mkadir <path to data folder>/data/red_tetris
```

### Usage

```
mongod --dbpath <path to root>/data/red_tetris
yarn
yarn build
yarn server 
```

Now go on localhost at : `http://0.0.0.0:8080`


**Note**: To play on your network:
In `./params.js` replace `host` value with your network ip. 