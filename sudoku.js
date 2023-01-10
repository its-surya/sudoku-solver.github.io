solveBtn = document.querySelector(".btn-primary");
Input = document.querySelectorAll("input");
Container = document.querySelector(".container");
validate = document.querySelector(".validate");
reset = document.querySelector(".reset");

function InputBoard() {
  var startingBoard = [[]];
  var j = 0;
  for (var i = 1; i <= 81; i++) {
    const val = document.getElementById(String(i)).value;
    if (val == "") {
      startingBoard[j].push(null);
    } else {
      startingBoard[j].push(Number(val));
    }
    if (i % 9 == 0 && i < 81) {
      startingBoard.push([]);
      j++;
    }
  }
  return startingBoard;
}

function initiate() {
  // null -> null
  // populate the board with whatever the user inputted
  var startingBoard = InputBoard();

  const inputValid = validBoard(startingBoard);
  if (!inputValid) {
    inputIsInvalid();
  } else {
    const answer = solve(startingBoard);
    updateBoard(answer, inputValid);
  }
}

function solve(board) {
  // solves the given sudoku board
  // ASSUME the given sudoku board is valid
  if (solved(board)) {
    return board;
  } else {
    const possibilities = nextBoards(board);
    const validBoards = keepOnlyValid(possibilities);
    return searchForSolution(validBoards);
  }
}

function searchForSolution(boards) {
  // List[Board] -> Board or false
  // finds a valid solution to the sudoku problem
  if (boards.length < 1) {
    return false;
  } else {
    // backtracking search for solution
    var first = boards.shift();
    const tryPath = solve(first);
    if (tryPath != false) {
      return tryPath;
    } else {
      return searchForSolution(boards);
    }
  }
}

function solved(board) {
  // Board -> Boolean
  // checks to see if the given puzzle is solved
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] == null) {
        return false;
      }
    }
  }
  return true;
}

function nextBoards(board) {
  // THIS FUNCTION WORKS.
  // Board -> List[Board]
  // finds the first emply square and generates 9 different boards filling in that square with numbers 1...9
  var res = [];
  const firstEmpty = findEmptySquare(board);
  if (firstEmpty != undefined) {
    const y = firstEmpty[0];
    const x = firstEmpty[1];
    for (var i = 1; i <= 9; i++) {
      var newBoard = [...board];
      var row = [...newBoard[y]];
      row[x] = i;
      newBoard[y] = row;
      res.push(newBoard);
    }
  }
  return res;
}

function findEmptySquare(board) {
  // Board -> [Int, Int]
  // (get the i j coordinates for the first empty square)
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] == null) {
        return [i, j];
      }
    }
  }
}

function keepOnlyValid(boards) {
  // List[Board] -> List[Board]
  // filters out all of the invalid boards from the list
  var res = [];
  for (var i = 0; i < boards.length; i++) {
    if (validBoard(boards[i])) {
      res.push(boards[i]);
    }
  }
  return res;
}

//To check if the board is valid
function validBoard(board) {
  // Board -> Boolean
  // checks to see if given board is valid
  return rowsGood(board) && columnsGood(board) && boxesGood(board);
}

//To check if the rows are valid
function rowsGood(board) {
  // Board -> Boolean
  // makes sure there are no repeating numbers for each row
  for (var i = 0; i < 9; i++) {
    var cur = [];
    for (var j = 0; j < 9; j++) {
      if (cur.includes(board[i][j])) {
        return false;
      } else if (board[i][j] != null) {
        cur.push(board[i][j]);
      }
    }
  }
  return true;
}

//To check if the columns are valid
function columnsGood(board) {
  // Board -> Boolean
  // makes sure there are no repeating numbers for each column
  for (var i = 0; i < 9; i++) {
    var cur = [];
    for (var j = 0; j < 9; j++) {
      if (cur.includes(board[j][i])) {
        return false;
      } else if (board[j][i] != null) {
        cur.push(board[j][i]);
      }
    }
  }
  return true;
}

//To check if the 3X3 boxes are valid
function boxesGood(board) {
  const boxCoordinates = [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 0],
    [2, 1],
    [2, 2],
  ];
  // Board -> Boolean
  // makes sure there are no repeating numbers for each box
  for (var y = 0; y < 9; y += 3) {
    for (var x = 0; x < 9; x += 3) {
      // each traversal should examine each box
      var cur = [];
      for (var i = 0; i < 9; i++) {
        var coordinates = [...boxCoordinates[i]];
        coordinates[0] += y;
        coordinates[1] += x;
        if (cur.includes(board[coordinates[0]][coordinates[1]])) {
          return false;
        } else if (board[coordinates[0]][coordinates[1]] != null) {
          cur.push(board[coordinates[0]][coordinates[1]]);
        }
      }
    }
  }
  return true;
}

//to print the output to the board
function updateBoard(board) {
  // Board -> null
  // update the DOM with the answer
  if (board == false) {
    for (i = 1; i <= 9; i++) {
      document.getElementById("row " + String(i)).innerHTML =
        "NO SOLUTION EXISTS TO THE GIVEN BOARD";
    }
  } else {
    k = 0;
    for (var i = 1; i <= 9; i++) {
      for (var j = 0; j < 9; j++) {
        Input[k++].value = board[i - 1][j];
      }
    }
  }
}

//The board is invalid
function inputIsInvalid() {
  Container.classList.add("invalid");
}

//Function to check if the entered value is valid
function checkInput(index) {
  board = InputBoard();
  n = Math.floor(index / 9);
  m = index % 9;
  for (i = 0; i < 9; i++) {
    if (i != n) {
      if (board[i][m] != null && board[i][m] == board[n][m]) return false;
    }
    if (i != m) {
      if (board[n][i] != null && board[n][i] == board[n][m]) return false;
    }
  }
  nth = Math.floor(n / 3) * 3;
  mth = Math.floor(m / 3) * 3;
  // window.alert("nth is " + nth + " and mth is " + mth);
  for (i = nth; i < nth + 3; i++) {
    for (j = mth; j < mth + 3; j++) {
      if (i == n && j == m) continue;
      else if (board[i][j] != null && board[i][j] == board[n][m]) return false;
    }
  }

  return true;
}

//function to validate the input board
function ValidateBoard(board) {
  for (i = 0; i < 9; i++) {
    hash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (j = 0; j < 9; j++) {
      if (board[i][j] == null) continue;
      else hash[board[i][j]]++;
    }
    for (j = 0; j < 9; j++) {
      if (board[i][j] == null) continue;
      else if (hash[board[i][j]] > 1) {
        if (!Input[9 * i + j].classList.contains("error")) {
          Input[9 * i + j].classList.add("valerror");
        }
      }
    }
  }
  for (i = 0; i < 9; i++) {
    hash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (j = 0; j < 9; j++) {
      if (board[j][i] == null) continue;
      else {
        hash[board[j][i]]++;
      }
    }

    for (j = 0; j < 9; j++) {
      if (board[j][i] == null) continue;
      else if (hash[board[j][i]] > 1) {
        if (!Input[9 * j + i].classList.contains("error")) {
          //console.log(i + "  " + j);
          Input[9 * j + i].classList.add("valerror");
        }
      }
    }
  }

  submat = [
    [0, 0],
    [0, 3],
    [0, 6],
    [3, 0],
    [3, 3],
    [3, 6],
    [6, 0],
    [6, 3],
    [6, 6],
  ];
  for (k = 0; k < 9; k++) {
    hash = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    n = submat[k][0] + 3;
    m = submat[k][1] + 3;
    for (i = submat[k][0]; i < n; i++) {
      for (j = submat[k][1]; j < m; j++) {
        if (board[i][j] == null) continue;
        else hash[board[i][j]]++;
      }
    }

    for (i = submat[k][0]; i < n; i++) {
      for (j = submat[k][1]; j < m; j++) {
        if (board[i][j] == null) continue;
        else if (hash[board[i][j]] > 1) {
          if (!Input[9 * i + j].classList.contains("error"))
            Input[9 * i + j].classList.add("valerror");
        }
      }
    }
  }
  ans = true;
  for (i = 0; i < 81; i++)
    if (Input[i].classList.contains("error")) ans = false;
  return ans;
}

//Event Listeners

Input.forEach((item, index) => {
  item.addEventListener("input", () => {
    if (item.value != "" && checkInput(index) == false)
      item.classList.add("error");
    else if (item.classList.contains("error")) item.classList.remove("error");
  });
});

Container.addEventListener("click", () => {
  if (Container.classList.contains("invalid"))
    Container.classList.remove("invalid");
  if (Container.classList.contains("correct"))
    Container.classList.remove("correct");
  for (i = 0; i < 81; i++) {
    if (Input[i].value == null) continue;
    if (Input[i].classList.contains("valerror"))
      Input[i].classList.remove("valerror");
  }
});

validate.addEventListener("click", () => {
  board = InputBoard();
  val = ValidateBoard(board);
  if (val) Container.classList.add("correct");
  else Container.classList.add("invalid");
});

reset.addEventListener("click", () => {
  for (i = 0; i < 81; i++) {
    Input[i].value = null;
    if (Input[i].classList.contains("error"))
      Input[i].classList.remove("error");
    if (Input[i].classList.contains("valerror"))
      Input[i].classList.remove("valerror");
  }
  if (Container.classList.contains("invalid"))
    Container.classList.remove("invalid");
  if (Container.classList.contains("correct"))
    Container.classList.remove("correct");
});
