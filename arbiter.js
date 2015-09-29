var autoPlayer = './player'
  , player1 = process.argv[2] || autoPlayer
  , player2 = process.argv[3] || autoPlayer
  , scores = { UNKNOWN: 0.5, DRAW: 0.25, LOSE: 0, WIN: 1 }   // Duplication with player.js but I don't want to externalize this just yet
  , gridSymbols = { EMPTY: ' ', PLAYER1: 'X', PLAYER2: 'O' }
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


function runOneGame () {
  var grid = createNewGrid();

  drawGrid(grid);

}

console.log('=========================');
runOneGame();

