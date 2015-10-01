var players = { SELF: 0, OPPONENT: 1, ROOT: 2 }
  , scores = { UNKNOWN: 0.5, DRAW: 0.25, LOSE: 0, WIN: 1 }   // Duplication with arbiter.js but I don't want to externalize this just yet
                                                             // DRAW is ranked less than UNKNOWN are there may be untested winning moves
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
      maxScore = score;
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


/*
 * Updates the AI that the game is finished and give result
 * Result bubbles up using minimax algorithm
 */
Player.prototype.result = function (score) {
  var s, self = this;

  this.currentNode.score = score;

  while (this.currentNode.parent) {
    this.currentNode = this.currentNode.parent;
    s = scores.UNKNOWN;
    
    // Could be factored a bit but I prefer this semantic
    // TODO: should probably just exclude the UNKNOWN states from minimax
    if (this.currentNode.player === players.SELF) {
      Object.keys(this.currentNode.children).forEach(function (move) {
        s = Math.min(s, self.currentNode.children[move].score);
      });
    } else {
      Object.keys(this.currentNode.children).forEach(function (move) {
        s = Math.max(s, self.currentNode.children[move].score);
      });
    }

    this.currentNode.score = s;
  }
};


// Interface
module.exports = Player;
