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


/*
 * Run one game between 2 AIs/human players
 */
function runOneGame (debug) {
  var grid = createNewGrid()
    , move, i, j
    ;

  if (debug) { console.log("=============================================================="); }

  // TODO: factor
  while (true) {
    move = player1.play(getLegalMoves(grid));
    player2.opponentPlayed(move, getLegalMoves(grid));
    if (debug) { console.log("Player 1 plays " + move); }
    i = parseInt(move.split('-')[0], 10);
    j = parseInt(move.split('-')[1], 10);
    grid[i][j] = gridSymbols.PLAYER1;
    if (checkResult(grid) !== results.NONE) { break; }

    move = player2.play(getLegalMoves(grid));
    player1.opponentPlayed(move, getLegalMoves(grid));
    if (debug) { console.log("Player 2 plays " + move); }
    i = parseInt(move.split('-')[0], 10);
    j = parseInt(move.split('-')[1], 10);
    grid[i][j] = gridSymbols.PLAYER2;
    if (checkResult(grid) !== results.NONE) { break; }
  } 

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

  if (debug) { drawGrid(grid); }
  if (debug) { console.log('RESULT: ' + checkResult(grid)) };
  if (debug) { player1.drawTree(); }

  return grid;
}






// ===== MANUAL TESTING

// Learning phase.
// At least one node is created at every game as this AI wants to explore unknown moves the most
// 362880 is 9!, upper bound for the number of 3x3 games of tic tac toe regardless of the rules
// So after 362880 the 3x3 AI is perfect
for (var z = 0; z < 362880; z += 1) {
  runOneGame();
}

console.log(player1.decisionTree.summary());

runOneGame();

console.log(player1.decisionTree.summary());

runOneGame();

console.log(player2.decisionTree.summary());

runOneGame();

console.log(player2.decisionTree.summary());


// Test that we now only get draws for AI vs AI when they are randomized: the AI learned how to play tic tac toe
player1.randomize = true;
player2.randomize = true;
var dc = 0, g;
for (var z = 0; z < 100000; z += 1) {
  g = runOneGame();
  if (checkResult(g) === results.DRAW) { dc += 1; }
}

if (dc === 100000) {
  console.log("100,000 draws in a row, both AIs play perfectly");
} else {
  console.log(dc + " draws, the code needs to be checked");
}


