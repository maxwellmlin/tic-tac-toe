var currentPlayer = "X"; // Switches between "X" and "O" every turn
var computer = ""; // In single-player, holds the type ("X" or "O") of the computer
var turn = 1; // Increments by 1 every turn (used for computer movement and tie detection)
var gameOver = false; // Once game is over, switches to true (disables gameplay buttons)
var scoreX = 0; // X's score
var scoreO = 0; // O's score

// Object used for keeping track of the gameboard
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

// Prompt user for player type if they choose single-player
onEvent("singlePlayer_button", "click", function() {
  hideElement("singlePlayer_button");
  showElement("playerX_button");
  showElement("playerO_button");
});
// Set computer to "O" and start game
onEvent("playerX_button", "click", function() {
  computer = "O";
  resetBoard();
  setScreen("gameplay_screen");
});
// Set computer to "X" and start game
onEvent("playerO_button", "click", function() {
  computer = "X";
  resetBoard();
  setScreen("gameplay_screen");
});

// Start game without computer
onEvent("twoPlayers_button", "click", function() {
  resetBoard();
  setScreen("gameplay_screen");
});

// Return to main menu and reset the main menu
onEvent("mainMenu_button", "click", function() {
  resetMain();
  setScreen("start_screen");
});
// Reset board only
onEvent("restart_buton", "click", function() {
  resetBoard();
});

// Gameplay Events: When a button is clicked call playerMove(position) with the clicked button's ID
onEvent("topLeft_button", "click", function() {
  playerMove("topLeft");
});
onEvent("top_button", "click", function() {
  playerMove("top");
});
onEvent("topRight_button", "click", function() {
  playerMove("topRight");
});
onEvent("left_button", "click", function() {
  playerMove("left");
});
onEvent("middle_button", "click", function() {
  playerMove("middle");
});
onEvent("right_button", "click", function() {
  playerMove("right");
});
onEvent("bottomLeft_button", "click", function() {
  playerMove("bottomLeft");
});
onEvent("bottom_button", "click", function() {
  playerMove("bottom");
});
onEvent("bottomRight_button", "click", function() {
  playerMove("bottomRight");
});

// Called whenever a button is clicked or a computer makes its move
function playerMove(position) {
  // First, checks to make sure that the selected position is empty and the game is not over
  if (board[position] == "" && !gameOver) {
    board[position] = currentPlayer; // Updates board object with the new move
    
    // Checks if the game is over
    var status = getGameStatus(board, currentPlayer);
    // If getGameStatus() returned something, the game ended
    if (status != undefined) {
      status = endGame(status);
    }
    
    // Start next turn
    turn++;
    currentPlayer = swapPlayer(currentPlayer);
    
    // At the end of every turn, update the UI
    updateBoardUI(board, status);
    
    // Prompts computer if single-player
    if (currentPlayer == computer) {
      playerMove(getComputerMove(board));
    }
  }
}

// Returns the other player of two states: "X" or "O"
function swapPlayer(player) {
  if (player == "X") {
    return "O";
  } else {
    return "X";
  }
}

// Returns whether "currentPlayer" won or if the board is filled
function getGameStatus(board, currentPlayer) {
  // Variables for detecting win conditions; H means Horizontal, V means Vertical
  var topH = board.topLeft == currentPlayer && board.top == currentPlayer && board.topRight == currentPlayer;
  var middleH = board.left == currentPlayer && board.middle == currentPlayer && board.right == currentPlayer;
  var bottomH = board.bottomLeft == currentPlayer && board.bottom == currentPlayer && board.bottomRight == currentPlayer;
  var leftV = board.topLeft == currentPlayer && board.left == currentPlayer && board.bottomLeft == currentPlayer;
  var middleV = board.top == currentPlayer && board.middle == currentPlayer && board.bottom == currentPlayer;
  var rightV = board.topRight == currentPlayer && board.right == currentPlayer && board.bottomRight == currentPlayer;
  var downwardDiagonal = board.topLeft == currentPlayer && board.middle == currentPlayer && board.bottomRight == currentPlayer;
  var upwardDiagonal = board.bottomLeft == currentPlayer && board.middle == currentPlayer && board.topRight == currentPlayer;
  
  // Return the currentPlayer if someone won; returns "Tie" if board is filled (turn 9)
  if (topH || middleH || bottomH || leftV || middleV || rightV || downwardDiagonal || upwardDiagonal) {
    return currentPlayer;
  } else if (turn == 9) {
    return "Tie";
  }
}

// Returns the computer's move given the current board state
function getComputerMove(board) {
  var tempBoard; // Copy of board
  var position; // Key of board object
  
  // Win if possible (iterates through tempBoard and plays every available position looking for a win)
  for (position in board) {
    tempBoard = copyObject(board);
    
    if (tempBoard[position] == "") {
      tempBoard[position] = currentPlayer;
      
      if (getGameStatus(tempBoard, currentPlayer) == currentPlayer) {
        return position;
      }
    }
  }
  
  var tempPlayer = swapPlayer(currentPlayer); // Opposite player
  
  // Block if possible (iterates through tempBoard and plays every possible position (as the opposite player) looking for a loss)
  for (position in board) {
    tempBoard = copyObject(board);
    
    if (tempBoard[position] == "") {
      tempBoard[position] = tempPlayer;
      
      if (getGameStatus(tempBoard, tempPlayer) == tempPlayer) {
        return position;
      }
    }
  }
  
  // If computer is "X", try to take opposite corners to force a win
  if (computer == "X") {
    if (board.topLeft == "") { return "topLeft"; }
    if (board.bottomRight == "") { return "bottomRight"; }
    if (board.topRight == "") { return "topRight"; }
    if (board.bottomLeft == "") { return "bottomLeft"; }
  }
  
  // If computer is "O", defend
  if (computer == "O") {
    // If X took the middle, take corners to defend
    // If X took a side, take middle and corners to defend
    // If X took a corner, take middle sides to defend
    if (board.middle == "X") {
      if (board.topLeft == "") { return "topLeft"; }
      if (board.bottomRight == "") { return "bottomRight"; }
      if (board.topRight == "") { return "topRight"; }
      if (board.bottomLeft == "") { return "bottomLeft"; }
    } else if (board.top == "X" || board.left == "X" || board.right == "X" || board.bottom == "X") {
      if (board.middle == "") { return "middle"; }
      if (board.topLeft == "") { return "topLeft"; }
      if (board.bottomRight == "") { return "bottomRight"; }
      if (board.topRight == "") { return "topRight"; }
      if (board.bottomLeft == "") { return "bottomLeft"; }
    } else {
      if (board.middle == "") { return "middle"; }
      if (board.top == "") { return "top"; }
      if (board.bottom == "") { return "bottom"; }
      if (board.left == "") { return "left"; }
      if (board.right == "") { return "right"; }
    }
  }
  
  // If all spots are already taken, pick an empty position at random
  for (position in board) {
    if (board[position] == "") { return position }
  }
}

// Ends the game, updating the player scores and returning the status message
function endGame(result) {
  gameOver = true;
  
  if (result == "X") {
    scoreX++;
  } else if (result == "O") {
    scoreO++;
  }
  
  var status;
  if (computer == "") {
    if (result == "X" || result == "O") {
      status = result+" won!";
    } else {
      status = "Tie!";
    }
  } else {
    if (result == computer) {
      status = "You Lost!";
    } else if (result == "Tie") {
      status = "Tie!";
    } else {
      status = "You Won!";
    }
  }

  return status;
}

// Returns a copy of a given object (If you used the assignment operator, you would only create a reference to the existing object)
function copyObject(object) {
  var copy = {};

  for (var key in object) {
    copy[key] = object[key];
  }
  
  return copy;
}

// Updates the board UI, given the board object
function updateBoardUI(board, status) {
  setText("status_label", "Current Player: "+currentPlayer);
    
  setText("scoreX_label", "X - "+scoreX);
  setText("scoreO_label", "O - "+scoreO);

  // Updates game board
  for (var position in board) {
    var buttonID = position + "_button";
    var imageURL = "";
    
    if (board[position] == "X") {
      imageURL = "icon://fa-times"; // X
    } else if (board[position] == "O") {
      imageURL = "icon://fa-circle-o"; // O
    }
    
    setProperty(buttonID, "image", imageURL);
  }
  
  // Update the status label if game ended
  if (status != undefined) {
    setText("status_label", status);
  }
}

// Resets the main menu
function resetMain() {
  computer = "";
  scoreX = 0;
  scoreO = 0;
  
  showElement("singlePlayer_button");
  hideElement("playerX_button");
  hideElement("playerO_button");
}

// Resets the gameplay screen
function resetBoard() {
  currentPlayer = "X";
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
  
  updateBoardUI(board);
  
  // If computer is X, prompt first move
  if (computer == "X") {
    playerMove(getComputerMove(board));
  }
}

// Image Sources
// board.jpg (Empty Tic-Tac-Toe Board): https://i.pinimg.com/originals/7f/d6/54/7fd654e4ed2675f4606bd72177eb1fb2.jpg
// titleImage.png (Tic-Tac-Toe Art): https://cdn3.vectorstock.com/i/1000x1000/73/02/tic-tac-toe-xo-game-vector-23217302.jpg
// icon://fa-times (X Tile): Icon provided by Code.org
// icon://fa-circle-o (O Tile): Icon provided by Code.org
