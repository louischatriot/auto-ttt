var autoPlayer = './player'
  , player1 = process.argv[2] || autoPlayer
  , player2 = process.argv[3] || autoPlayer
  , scores = { UNKNOWN: 0.5, DRAW: 0.25, LOSE: 0, WIN: 1 }   // Duplication with player.js but I don't want to externalize this just yet
  , gridSymbols = { EMPTY: ' ', PLAYER1: 'X', PLAYER2: 'O' }
  , results = { PLAYER1_WIN: 'Player 1 wins', PLAYER2_WIN: 'Player 2 wins', DRAW: 'Draw', NONE: 'No result yet' }
  , currentGame = []
  , N = 3
  ;

player1 = new (require(player1))();
player2 = new (require(player2))();


function createNewGrid () {
  var res = [];
  for (var i = 0; i < N; i += 1) {
    res[i] = [];
    for (var j = 0; j < N; j += 1) {
      res[i][j] = gridSymbols.EMPTY
    }
  }
  return res;
}


function drawGrid(grid) {
  var line
    , horizontalLine = ''
    ;

  for (var i = 0; i < 2*N+1; i += 1) {
    horizontalLine += '-';
  }

  console.log(horizontalLine);
  for (var i = 0; i < N; i += 1) {
    line = '|';
    for (var j = 0; j < N; j += 1) {
      line += grid[i][j] + '|';
    }
    console.log(line);
    console.log(horizontalLine);
  }
}


function getLegalMoves (grid) {
  var res = [];

  for (var i = 0; i < N; i += 1) {
    for (var j = 0; j < N; j += 1) {
      if (grid[i][j] === gridSymbols.EMPTY) { res.push('' + i + '-' + j); }
    }
  }

  return res;
}


function checkResult(grid) {
  var l1, l2, c1, c2;

  var d1 = true, d2 = true, d1i = true, d2i = true;

  for (var i = 0; i < N; i += 1) {
    l1 = true; l2 = true; c1 = true; c2 = true;
    for (var j = 0; j < N; j += 1) {
      l1 = l1 && (grid[i][j] === gridSymbols.PLAYER1);
      l2 = l2 && (grid[i][j] === gridSymbols.PLAYER2);
      c1 = c1 && (grid[j][i] === gridSymbols.PLAYER1);
      c2 = c2 && (grid[j][i] === gridSymbols.PLAYER2);
    }

    if (l1 || c1) { return results.PLAYER1_WIN; }
    if (l2 || c2) { return results.PLAYER2_WIN; }

    d1 = d1 && (grid[i][i] === gridSymbols.PLAYER1);
    d2 = d2 && (grid[i][i] === gridSymbols.PLAYER2);
    
    d1i = d1i && (grid[i][N - 1 - i] === gridSymbols.PLAYER1);
    d2i = d2i && (grid[i][N - 1 - i] === gridSymbols.PLAYER2);
  }

  if (d1 || d1i) { return results.PLAYER1_WIN; }
  if (d2 || d2i) { return results.PLAYER2_WIN; }

  if (getLegalMoves(grid).length === 0) {
    return results.DRAW;
  } else {
    return results.NONE;
  }
}


function runOneGame (debug) {
  var grid = createNewGrid()
    , move, i, j
    ;

  if (debug) { console.log("=============================================================="); }

  // TODO: factor
  while (true) {
    move = player1.play(getLegalMoves(grid));
    if (debug) { console.log("Player 1 plays " + move); }
    i = parseInt(move.split('-')[0], 10);
    j = parseInt(move.split('-')[1], 10);
    grid[i][j] = gridSymbols.PLAYER1;
    player2.opponentPlayed(move);
    if (checkResult(grid) !== results.NONE) { break; }

    move = player2.play(getLegalMoves(grid));
    if (debug) { console.log("Player 2 plays " + move); }
    i = parseInt(move.split('-')[0], 10);
    j = parseInt(move.split('-')[1], 10);
    grid[i][j] = gridSymbols.PLAYER2;
    player1.opponentPlayed(move);
    if (checkResult(grid) !== results.NONE) { break; }
  } 

  if (debug) { drawGrid(grid); }
  console.log('RESULT: ' + checkResult(grid));
  player1.drawTree();

  switch (checkResult(grid)) {
    case results.PLAYER1_WIN:
      player1.result(scores.WIN);
      player2.result(scores.LOSE);
      break;
    case results.PLAYER2_WIN:
      player2.result(scores.WIN);
      player1.result(scores.LOSE);
      break;
    case results.DRAW:
      player1.result(scores.DRAW);
      player2.result(scores.DRAW);
      break;
  }

  player1.drawTree();

}

runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);
runOneGame(true);

