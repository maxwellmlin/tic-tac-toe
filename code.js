// Entire program done by me

// Image Sources
// Tic-Tac-Toe Board: https://i.pinimg.com/originals/7f/d6/54/7fd654e4ed2675f4606bd72177eb1fb2.jpg
// Description: 

// TitleImage: https://cdn3.vectorstock.com/i/1000x1000/73/02/tic-tac-toe-xo-game-vector-23217302.jpg

var currentPlayer = "X";
var computerType = ""; // For use in single player mode
var turn = 1;
var gameOver = false;

var board = {
  topLeft: "",
  top: "",
  topRight: "",
  left: "",
  middle: "",
  right: "",
  bottomLeft: "",
  bottom: "",
  bottomRight: "",
};

onEvent("onePlayer_button", "click", function() {
  hideElement("onePlayer_button");
  showElement("playerX_button");
  showElement("playerO_button");
});

onEvent("playerX_button", "click", function() {
  computerType = "O";
  setScreen("gameplay_screen");
});
onEvent("playerO_button", "click", function() {
  computerType = "X";
  
  // First computer move
  playerMoved(getComputerMove(board));
  setScreen("gameplay_screen");
});

onEvent("twoPlayers_button", "click", function() {
  setScreen("gameplay_screen");
});

onEvent("mainMenu_button", "click", function() {
  reset();
  setScreen("start_screen");
});

// Gameplay Events
onEvent("topLeft_button", "click", function() {
  playerMoved("topLeft");
});
onEvent("top_button", "click", function() {
  playerMoved("top");
});
onEvent("topRight_button", "click", function() {
  playerMoved("topRight");
});
onEvent("left_button", "click", function() {
  playerMoved("left");
});
onEvent("middle_button", "click", function() {
  playerMoved("middle");
});
onEvent("right_button", "click", function() {
  playerMoved("right");
});
onEvent("bottomLeft_button", "click", function() {
  playerMoved("bottomLeft");
});
onEvent("bottom_button", "click", function() {
  playerMoved("bottom");
});
onEvent("bottomRight_button", "click", function() {
  playerMoved("bottomRight");
});

// Called whenever a button is placed or a computer makes its move
function playerMoved(position) {
  if (board[position] == "" && !gameOver) {
    board[position] = currentPlayer;
    
    updateUI(board);
    
    var gameOverStatus = getGameStatus(board, currentPlayer);
    if (gameOverStatus != undefined) {
      endGame(gameOverStatus);
      return;
    }
    
    currentPlayer = swapPlayer(currentPlayer);
    setText("status_label", "Current Player: "+currentPlayer);
    
    turn++;
    // End of Player's Turn
    
    // Prompting computer's turn if applicable
    if (currentPlayer == computerType) {
      var computerMove = getComputerMove(board);
      playerMoved(computerMove);
    }
  } else {
    console.log("Attempted move: " + position);
    console.log(board);
  }
}

// Switches the currentPlayer through two states: "X" and "O"
function swapPlayer(player) {
  if (player == "X") {
    return "O";
  } else {
    return "X";
  }
}

function getGameStatus(board, currentPlayer) {
  // Variables for detecting win conditions; H - Horizontal, V - Vertical
  var topH = board.topLeft == currentPlayer && board.top == currentPlayer && board.topRight == currentPlayer;
  var middleH = board.left == currentPlayer && board.middle == currentPlayer && board.right == currentPlayer;
  var bottomH = board.bottomLeft == currentPlayer && board.bottom == currentPlayer && board.bottomRight == currentPlayer;
  var leftV = board.topLeft == currentPlayer && board.left == currentPlayer && board.bottomLeft == currentPlayer;
  var middleV = board.top == currentPlayer && board.middle == currentPlayer && board.bottom == currentPlayer;
  var rightV = board.topRight == currentPlayer && board.right == currentPlayer && board.bottomRight == currentPlayer;
  var downwardDiagonal = board.topLeft == currentPlayer && board.middle == currentPlayer && board.bottomRight == currentPlayer;
  var upwardDiagonal = board.bottomLeft == currentPlayer && board.middle == currentPlayer && board.topRight == currentPlayer;
  
  if (topH || middleH || bottomH || leftV || middleV || rightV || downwardDiagonal || upwardDiagonal) {
    return currentPlayer;
  } else {
    var filledSpots = 0;
    for (var i in board) {
      if (board[i] != "") {
        filledSpots++;
      }
    }
    if (filledSpots == 9) {
      return "Tie";
    }
  }
}


function getComputerMove(board) {
  var tempBoard; // Copy of board
  var position;
  
  // Win if possible
  for (position in board) {
    tempBoard = copyObject(board);
    
    if (tempBoard[position] == "") {
      tempBoard[position] = currentPlayer;
      
      if (getGameStatus(tempBoard, currentPlayer) == currentPlayer) {
        return position;
      }
    }
  }
  
  var tempPlayer = swapPlayer(currentPlayer);
  
  // Block if possible
  for (position in board) {
    tempBoard = copyObject(board);
    
    if (tempBoard[position] == "") {
      tempBoard[position] = tempPlayer;
      
      if (getGameStatus(tempBoard, tempPlayer) == tempPlayer) {
        return position;
      }
    }
  }
  
  // If "X" try to take opposite corners
  if (computerType == "X") {
    if (board.topLeft == "") { return "topLeft"; }
    if (board.bottomRight == "") { return "bottomRight"; }
    if (board.topRight == "") { return "topRight"; }
    if (board.bottomLeft == "") { return "bottomLeft"; }
  }
  
  // If "O" try to take middle and sides
  if (computerType == "O") {
    if (board.middle == "") {
      if (board.middle == "") { return "middle"; }
      if (board.top == "") { return "top"; }
      if (board.bottom == "") { return "left"; }
      if (board.left == "") { return "right"; }
      if (board.right == "") { return "bottom"; }
    } else if (board.middle == "X") {
      if (board.topLeft == "") { return "topLeft"; }
      if (board.bottomRight == "") { return "bottomRight"; }
      if (board.topRight == "") { return "topRight"; }
      if (board.bottomLeft == "") { return "bottomLeft"; }
    }
  }
  
  // If all spots are already taken pick a position at random
  // (means player choose unoptimal spot so random positions will stil net in a win/tie)
  console.log("Random Move");
  for (position in board) {
    if (board[position] == "") { return position }
  }
}

function endGame(result) {
  gameOver = true;

  if (result != "Tie") {
    setText("status_label", result+" won!");
  } else {
    setText("status_label", "Tie!");
  }
}

function copyObject(object) {
  var copy = {};

  for (var key in object) {
    copy[key] = object[key];
  }
  return copy;
}

function updateUI(board) {
  for (var position in board) {
    var buttonID = position + "_button";
    
    if (board[position] == "X") {
      setProperty(buttonID, "image", "icon://fa-times"); // X
    } else if (board[position] == "O") {
      setProperty(buttonID, "image", "icon://fa-circle-o"); // O
    } else {
      setProperty(buttonID, "image", "");
    }
  }
}

function reset() {
  currentPlayer = "X";
  computerType = "";
  turn = 1;
  gameOver = false;
  
  board = {
    topLeft : "",
    top : "",
    topRight : "",
    left : "",
    middle : "",
    right : "",
    bottomLeft : "",
    bottom : "",
    bottomRight : "",
  };
  
  updateUI(board);
  
  showElement("onePlayer_button");
  hideElement("playerX_button");
  hideElement("playerO_button");
  
  setText("status_label", "Current Player: "+currentPlayer);
}
