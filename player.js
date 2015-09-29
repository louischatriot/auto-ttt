var N = 3
  , players = { SELF: 0, OPPONENT: 1, ROOT: 2 }
  //, possibleMoves = ['00', '01', '02', '10', '11', '12', '20', '21', '22']
  , scores = { UNKNOWN: 0.5, DRAW: 0.25, LOSE: 0, WIN: 1 }
  ;

function Node(player, parent) {
  this.score = scores.UNKNOWN;
  this.player = player;
  this.children = {};
  this.parent = parent;

}



function Player () {
  this.decisionTree = new Node(players.ROOT);
  this.currentNode = this.decisionTree;   // No game started
  


}


/* 
 * validMoves is a list of valid moves passed by arbiter. Could also be gotten by all parents of current node until root
 * Returns the chosen move
 */
Player.prototype.play = function (validMoves) {
  var maxScore = 0, maxMove
    , self = this;

  // Select best move given data collected to date
  validMoves.forEach(function (move) {
    var score, moveNode = self.currentNode.children[move];

    if (moveNode !== undefined) {
      score = moveNode.score;
    } else {
      score = scores.UNKNOWN;
    }
    
    // Of course that means some nodes will never be explored but the AI will always play optimally
    // The >= sign guarantees one node will always be chosen
    if (score >= maxScore) {
      maxScore = self.currentNode.children[move].score;
      maxMove = move;
    }
  });

  // Move to the node corresponding to the chosen move, lazily create it if it doesn't exist
  if (self.currentNode.children[maxMove] === undefined) {
    self.currentNode.children[maxMove] = new Node(players.SELF, self.currentNode);
  }
  self.currentNode = self.currentNode.children[maxMove];

  return maxMove;
};


/*
 * Update state when opponent has played, lazily creating the corresponding node if it doesn't exist
 */
Player.prototype.opponentPlayed = function (move) {
  if (this.currentNode.children[move] === undefined) {
    this.currentNode.children[move] = new Node(players.OPPONENT, this.currentNode);
  }
  this.currentNode = this.currentNode.children[move];
};




// Interface
module.exports = Player;
