class GameBoard {
  constructor() {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.solutionCount = 0;
  }

  isValidNum(board, row, col, num) {
    for (let index = 0; index < 9; index++) {
      const subgridRow = Math.floor(row / 3) * 3 + Math.floor(index / 3);
      const subgridCol = Math.floor(col / 3) * 3 + (index % 3);
      if (
        board[row][index] === num ||
        board[index][col] === num ||
        board[subgridRow][subgridCol] === num
      ) {
        return false;
      }
    }
    return true;
  }

  shuffleArray() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = 8; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }

  populateBoard(row = 0, col = 0) {
    if (row === 9) return true;
    if (col === 9) return this.populateBoard(row + 1, 0);
    if (this.board[row][col] !== 0) return this.populateBoard(row, col + 1);
    let randomNums = this.shuffleArray();
    for (const randomNum of randomNums) {
      if (this.isValidNum(this.board, row, col, randomNum)) {
        this.board[row][col] = randomNum;
        if (this.populateBoard(row, col + 1)) return true;
        this.board[row][col] = 0;
      }
    }
    return false;
  }

  maskCells(maskNum) {
    const allCells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        allCells.push([i, j]);
      }
    }
    for (let i = allCells.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
    }
    for (let k = 0; k < maskNum; k++) {
      const [row, col] = allCells[k];
      this.board[row][col] = 0;
    }
    return allCells;
  }

  solve(row = 0, col = 0) {
    if (row === 9) {
      this.solutionCount++;
      return this.solutionCount > 1;
    }
    if (col === 9) return this.solve(row + 1, 0);
    if (this.board[row][col] !== 0) return this.solve(row, col + 1);
    for (let num = 1; num <= 9; num++) {
      if (this.isValidNum(this.board, row, col, num)) {
        this.board[row][col] = num;
        if (this.solve(row, col + 1)) return true;
        this.board[row][col] = 0;
      }
    }
    return false;
  }

  hasUniqueSolution() {
    this.solutionCount = 0;
    this.solve();
    return this.solutionCount === 1;
  }

  resetBoard() {
    this.board = Array.from({ length: 9 }, () => Array(9).fill(0));
  }
  generatePuzzle(difficulty) {
    let maskNum;
    if (difficulty === "easy") maskNum = 30;
    else if (difficulty === "medium") maskNum = 40;
    else if (difficulty === "hard") maskNum = 50;
    do {
      this.resetBoard();
      this.populateBoard(0, 0);
      this.maskCells(maskNum);
    } while (!this.hasUniqueSolution());
    return this.board;
  }
}

const difficulty = document.querySelector("#difficulty");
const newPuzzle = document.querySelector("#new-puzzle");
// const solution = document.querySelector("#solution");
const hint = document.querySelector("#hint");
const puzzleBoard = document.querySelector("#board");
let difficultyChosen = "easy";
let newBoard = new GameBoard();

function createPuzzle() {
  newBoard.generatePuzzle(difficultyChosen);
  puzzleBoard.innerHTML = "";
  let cellId = 1;

  for (let i = 0; i < 9; i++) {
    for (let value of newBoard.board[i]) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (value !== 0) {
        cell.textContent = value;
        cell.setAttribute("contenteditable", "false");
      } else {
        cell.setAttribute("contenteditable", "true");
      }

      puzzleBoard.appendChild(cell);
      cellId += 1;
    }
  }
}
createPuzzle();
difficulty.addEventListener("input", () => {
  difficultyChosen = difficulty.value;
});

newPuzzle.addEventListener("click", createPuzzle);

// solution.addEventListener("click", newBoard.populateBoard);
