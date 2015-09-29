var autoPlayer = './player'
  , player1 = process.argv[2] || autoPlayer
  , player2 = process.argv[3] || autoPlayer
  , scores = { UNKNOWN: 0.5, DRAW: 0.25, LOSE: 0, WIN: 1 }   // Duplication with player.js but I don't want to externalize this just yet
  ;

player1 = new (require(player1))();
player2 = new (require(player2))();



function runOneGame () {



}



