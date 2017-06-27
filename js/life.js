(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

window.onload = function() {

  const game = new Phaser.Game(500, 500, Phaser.AUTO, 'phaser', { preload: preload, create: create, update: update });

  let config = {
    dot_size: 10,
    grid_height: 50,
    grid_width: 50,
    desiredFps: 5
  }

  let dots
  let board = [ 
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1 ],
    [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 1 ],
    [ 0, 1, 0, 0, 0, 0, 1, 0, 0, 0 ],
    [ 0, 1, 0, 0, 0, 0, 1, 1, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 1, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
  ]
  let generation = 0
  let generationText

  function preload () {
  }
  
  function create () {
    // game update rate
    game.time.desiredFps = config.desiredFps
    generationText = game.add.text(16, 16, 'Generation: 0', { fontSize: '32px', fill: '#999' });
    // dots
    dots = game.add.group()

    // controls
    cursors = game.input.keyboard.createCursorKeys();
    game.input.onDown.add(pause);
    cursors.down.onDown.add(pause)
    cursors.up.onDown.add(advanceOne)
    // initial state
    createBoard()
    drawBoard()
    
  }

  function update () {
    updateGenText()
    clearBoard()
    updateBoard()
    drawBoard()
    if (cursors.up.isDown) {
      // clearBoard()
      // updateBoard()
      // drawBoard()
      // console.log(board)
    }
  }

  // helpers
  const pause = () => {
    game.paused = !game.paused
  }
  const advanceOne = () => {
    if (game.paused) {
      updateGenText()
      clearBoard()
      updateBoard()
      drawBoard()
    }

  }
  const createBoard = () => {
    const createdBoard = []
    for (let i = 0; i < config.grid_width; i++) {
      let row = []
      for (let j = 0; j< config.grid_height; j++) {
        row.push(getRandom())
      }
      createdBoard.push(row)
      board = createdBoard
    }
  }
  const getRandom = () => {
    if(Math.random() > 0.9) return 1
    return 0
  }
  const updateBoard = () => {
    let current = board
    
    const checkSurrounding = (cell) => {
      
      let width = board.length -1 
      let height = board[0].length -1
      
      let surroundingAlive = 0
      const row = cell[0]
      const column = cell[1]
      const rowStart = row - 1 < 0 ? row : row -1
      const rowEnd = row + 2 > width? width : row +2
      const columnStart = column - 1 < 0 ? column : column -1
      const columnEnd = column + 2 > height? height : column +2
      for (let i = rowStart; i < rowEnd; i++) {
        for (let j = columnStart; j < columnEnd; j++) {
          if (i === row && j === column) {
          } else {
            surroundingAlive += board[i][j]
          }
          
        }
      }
      return surroundingAlive
    }
    const getScore = (cell) => {
      let surrounding = checkSurrounding(cell)
      const row = cell[0]
      const column = cell[1]
      if (board[row][column] === 1 && (surrounding === 2 || surrounding === 3)) {
        return 1
      }
      if (surrounding <= 2) {
        return 0
      }

      if (surrounding === 3 && board[row][column] === 0) {
        return 1
      }
      if (surrounding > 3) {
        return 0
      }
      return 1
    }
    // for each cell, check the 8 (best case) surrounding cells
    let newBoard = []
    let width = config.grid_width
    let height = config.grid_height

    for (let i = 0; i < height; i++) {
      let row = []
      for (let j = 0; j< width; j++) {
        let cell = [i,j]
        const newScore = getScore(cell)
        row.push(getScore(cell))
      }
      newBoard.push(row)
    }
    board = newBoard
  }
  const drawBoard = () => {
    let width = config.grid_width
    let height = config.grid_height
    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        if (board[i][j] === 1) {
          drawDot(i,j)
        }
      }
    }
  }
  const drawDot = (i,j) => {
    let size = config.dot_size
    let dot = game.add.graphics (j*size, i*size);
    dot.beginFill(0x00FF00, 1);
    dot.drawRect(0,0,size,size);
    dots.addChild(dot)
  }
  const clearBoard = () => {
    dots.destroy(true, true)
  }
  const updateGenText = () => {
    generation += 1
    generationText.text = 'Generation: ' + generation;
  }
};

},{}]},{},[1]);
