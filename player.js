var players = { SELF: 'self', OPPONENT: 'opponent', ROOT: 'root' }
  , scores = { UNKNOWN: 2, DRAW: 0.25, LOSE: 0, WIN: 1 }   // Duplication with arbiter.js but I don't want to externalize this just yet
                                                             // DRAW is ranked less than UNKNOWN are there may be untested winning moves
  ;

function Node(player, parent, height) {
  this.score = scores.UNKNOWN;
  this.player = player;
  this.children = {};
  this.parent = parent;
  this.height = height;   // Number of possible moves from this node
}


/*
 * Return the list of explored moves for this node
 */
Node.prototype.moves = function () {
  return Object.keys(this.children);
};


/**
 * Return number of nodes with the given score, or all if no parameter given
 */
Node.prototype.nodeCount = function (score) {
  var self = this
    , res = (score === undefined || this.score === score) ? 1 : 0
    ;

  if (this.moves().length === 0) { return res; }

  this.moves().forEach(function (move) {
    res += self.children[move].nodeCount(score);
  });

  return res;
};


/*
 * Draw the tree originating from this node, with offset spaces every level
 */
Node.prototype.drawDescendants = function (offset) {
  var self = this;

  this.moves().forEach(function (move) {
    console.log(offset + move + ' (' + self.children[move].player + ' - score: ' + self.children[move].score + ' - height: ' + self.children[move].height + ')');
    self.children[move].drawDescendants(offset + '  ');
  });
};


Node.prototype.draw = function () {
  console.log("ROOT (score: " + this.score + ')');
  this.drawDescendants('');
};


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
    self.currentNode.children[maxMove] = new Node(players.SELF, self.currentNode, validMoves.length - 1);
  }
  self.currentNode = self.currentNode.children[maxMove];

  return maxMove;
};


/*
 * Update state when opponent has played, lazily creating the corresponding node if it doesn't exist
 */
Player.prototype.opponentPlayed = function (move, validMoves) {
  if (this.currentNode.children[move] === undefined) {
    this.currentNode.children[move] = new Node(players.OPPONENT, this.currentNode, validMoves.length - 1);
  }
  this.currentNode = this.currentNode.children[move];
};


Player.prototype.drawTree = function () {
  console.log("===== " + this.decisionTree.nodeCount() + ' nodes - U: ' + this.decisionTree.nodeCount(scores.UNKNOWN) + ' - W: ' + this.decisionTree.nodeCount(scores.WIN) + ' - L: ' + this.decisionTree.nodeCount(scores.LOSE) + ' - D: ' + this.decisionTree.nodeCount(scores.DRAW));
  this.decisionTree.draw();
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
    if (this.currentNode.player === players.SELF) {
        if (this.currentNode.moves().length === this.currentNode.height) {
          s = scores.WIN;
          Object.keys(this.currentNode.children).forEach(function (move) {
            s = Math.min(s, self.currentNode.children[move].score);
          });
        } else {
          s = scores.UNKNOWN;
        }
    } else {
      if (this.currentNode.moves().length === this.currentNode.height) {
        s = scores.LOSE;
        Object.keys(this.currentNode.children).forEach(function (move) {
          s = Math.max(s, self.currentNode.children[move].score);
        });
      } else {
        s = scores.UNKNOWN;
      }
    }

    this.currentNode.score = s;
  }
};


// Interface
module.exports = Player;
