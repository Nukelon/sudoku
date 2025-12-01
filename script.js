const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const difficultyClues = {
  easy: 44,
  medium: 36,
  hard: 28,
};

let basePuzzle = [];
let puzzle = [];
let solution = [];
let selected = null;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function deepCopy(board) {
  return board.map((row) => [...row]);
}

function isSafe(board, row, col, num) {
  for (let x = 0; x < BOARD_SIZE; x += 1) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = 0; r < BOX_SIZE; r += 1) {
    for (let c = 0; c < BOX_SIZE; c += 1) {
      if (board[boxRow + r][boxCol + c] === num) return false;
    }
  }
  return true;
}

function solve(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === 0) {
        for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board, limit = 2) {
  let count = 0;
  function backtrack() {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= BOARD_SIZE; num += 1) {
            if (isSafe(board, row, col, num)) {
              board[row][col] = num;
              backtrack();
              if (count >= limit) return;
              board[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count += 1;
  }
  backtrack();
  return count;
}

function generateSolved() {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  solve(board);
  return board;
}

function generatePuzzle(difficulty) {
  const filled = generateSolved();
  const puzzleBoard = deepCopy(filled);
  const clues = difficultyClues[difficulty] ?? difficultyClues.medium;
  const cells = shuffle([...Array(BOARD_SIZE * BOARD_SIZE).keys()]);
  let removed = 0;

  for (const index of cells) {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const backup = puzzleBoard[row][col];
    puzzleBoard[row][col] = 0;

    const temp = deepCopy(puzzleBoard);
    const solutions = countSolutions(temp);
    const remaining = BOARD_SIZE * BOARD_SIZE - removed - 1;
    if (solutions !== 1 || remaining < clues) {
      puzzleBoard[row][col] = backup;
    } else {
      removed += 1;
    }
  }

  return { puzzleBoard, solutionBoard: filled };
}

function buildBoard() {
  boardEl.innerHTML = '';
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      if ((col + 1) % BOX_SIZE === 0 && col !== BOARD_SIZE - 1) {
        cell.classList.add('box-border-right');
      }
      if ((row + 1) % BOX_SIZE === 0 && row !== BOARD_SIZE - 1) {
        cell.classList.add('box-border-bottom');
      }
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `行${row + 1}列${col + 1}`);
      cell.addEventListener('click', () => selectCell(cell));
      boardEl.appendChild(cell);
    }
  }
}

function renderBoard() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = puzzle[row][col];
    cell.textContent = value === 0 ? '' : value;
    const fixed = basePuzzle[row][col] !== 0;
    cell.dataset.fixed = fixed;
    cell.classList.toggle('conflict', false);
  });
}

function selectCell(cell) {
  if (cell.dataset.fixed === 'true') return;
  if (selected) selected.classList.remove('selected');
  selected = cell;
  selected.classList.add('selected');
  highlightRelated();
}

function highlightRelated() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.classList.remove('same-line', 'same-value');
  });
  if (!selected) return;
  const row = Number(selected.dataset.row);
  const col = Number(selected.dataset.col);
  const value = selected.textContent;
  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (r === row || c === col || (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3))) {
      cell.classList.add('same-line');
    }
    if (value && cell.textContent === value) {
      cell.classList.add('same-value');
    }
  });
}

function handleInput(num) {
  if (!selected) return;
  const row = Number(selected.dataset.row);
  const col = Number(selected.dataset.col);
  const fixed = selected.dataset.fixed === 'true';
  if (fixed) return;

  puzzle[row][col] = num;
  selected.textContent = num === 0 ? '' : num;
  validateConflicts();
  highlightRelated();
  if (isComplete()) setStatus('🎉  恭喜完成！', true);
}

function validateConflicts() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => cell.classList.remove('conflict'));

  for (const cell of cells) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = puzzle[row][col];
    if (value === 0) continue;

    const hasRowConflict = puzzle[row].some((v, i) => v === value && i !== col);
    const hasColConflict = puzzle.some((r, i) => r[col] === value && i !== row);
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    let hasBoxConflict = false;
    for (let r = 0; r < 3; r += 1) {
      for (let c = 0; c < 3; c += 1) {
        if ((boxRow + r !== row || boxCol + c !== col) && puzzle[boxRow + r][boxCol + c] === value) {
          hasBoxConflict = true;
        }
      }
    }

    if (hasRowConflict || hasColConflict || hasBoxConflict) {
      cell.classList.add('conflict');
    }
  }
}

function isComplete() {
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (puzzle[r][c] === 0 || puzzle[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

function setStatus(text, success = false) {
  statusEl.textContent = text;
  statusEl.style.color = success ? '#16a34a' : 'var(--muted)';
}

function newGame() {
  const { puzzleBoard, solutionBoard } = generatePuzzle(difficultyEl.value);
  basePuzzle = deepCopy(puzzleBoard);
  puzzle = deepCopy(puzzleBoard);
  solution = solutionBoard;
  buildBoard();
  renderBoard();
  selected = null;
  setStatus('已生成新棋盘，祝解谜愉快！');
}

function resetBoard() {
  puzzle = deepCopy(basePuzzle);
  renderBoard();
  selected = null;
  validateConflicts();
  setStatus('已重置。');
}

function giveHint() {
  const empties = [];
  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c < BOARD_SIZE; c += 1) {
      if (puzzle[r][c] === 0) empties.push([r, c]);
    }
  }
  if (!empties.length) return;
  const [row, col] = empties[Math.floor(Math.random() * empties.length)];
  puzzle[row][col] = solution[row][col];
  basePuzzle[row][col] = solution[row][col];
  const cell = boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (cell) {
    cell.textContent = solution[row][col];
    cell.dataset.fixed = true;
  }
  validateConflicts();
  highlightRelated();
  if (isComplete()) setStatus('🎉  恭喜完成！', true);
}

function checkBoard() {
  const correct = isComplete();
  setStatus(correct ? '答案正确！' : '还有错误或空格，继续加油。', correct);
}

function handleKeyboard(e) {
  if (!selected) return;
  if (e.key >= '1' && e.key <= '9') {
    handleInput(Number(e.key));
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0' || e.key === ' ') {
    handleInput(0);
  }
}

function attachPadEvents() {
  document.querySelectorAll('.pad-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const num = Number(btn.dataset.number);
      handleInput(num);
    });
  });
}

function init() {
  attachPadEvents();
  document.getElementById('new-game').addEventListener('click', newGame);
  difficultyEl.addEventListener('change', newGame);
  document.getElementById('reset').addEventListener('click', () => {
    const confirmReset = window.confirm('确定要重置当前棋盘吗？');
    if (confirmReset) resetBoard();
  });
  document.getElementById('hint').addEventListener('click', giveHint);
  document.getElementById('check').addEventListener('click', checkBoard);
  document.addEventListener('keydown', handleKeyboard);
  newGame();
}

document.addEventListener('DOMContentLoaded', init);
