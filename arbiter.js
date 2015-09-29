var autoPlayer = './player'
  , player1 = process.argv[2] || autoPlayer
  , player2 = process.argv[3] || autoPlayer
  ;

player1 = new (require(player1))();
player2 = new (require(player2))();



function runOneGame () {



}



