const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const variantConfigs = {
  classic: { label: '经典数独', description: '行、列、宫均包含 1-9' },
  diagonal: { label: '对角线数独', description: '额外要求两条对角线包含 1-9' },
  hyper: {
    label: '超数独',
    description: '在四个中心 3×3 宫内也需包含 1-9',
  },
};
const difficultyClues = {
  easy: 44,
  medium: 36,
  hard: 28,
};

const APP_VERSION = '1.1.0';

function ensureFreshAssets() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  }

  const savedVersion = localStorage.getItem('sudoku:version');
  if (savedVersion && savedVersion !== APP_VERSION) {
    window.location.reload();
  }
  if (savedVersion !== APP_VERSION) {
    localStorage.setItem('sudoku:version', APP_VERSION);
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });
}

let basePuzzle = [];
let puzzle = [];
let solution = [];
let selected = null;
let currentVariant = 'classic';

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');
const variantEl = document.getElementById('variant');

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

function getVariantPeers(row, col, variant) {
  const peers = new Set();

  for (let i = 0; i < BOARD_SIZE; i += 1) {
    peers.add(`${row}-${i}`);
    peers.add(`${i}-${col}`);
  }

  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = 0; r < BOX_SIZE; r += 1) {
    for (let c = 0; c < BOX_SIZE; c += 1) {
      peers.add(`${boxRow + r}-${boxCol + c}`);
    }
  }

  if (variant === 'diagonal') {
    if (row === col) {
      for (let i = 0; i < BOARD_SIZE; i += 1) {
        peers.add(`${i}-${i}`);
      }
    }
    if (row + col === BOARD_SIZE - 1) {
      for (let i = 0; i < BOARD_SIZE; i += 1) {
        peers.add(`${i}-${BOARD_SIZE - 1 - i}`);
      }
    }
  }

  if (variant === 'hyper') {
    const hyperStarts = [
      [1, 1],
      [1, 5],
      [5, 1],
      [5, 5],
    ];
    const inHyper = hyperStarts.find(
      ([startRow, startCol]) =>
        row >= startRow && row < startRow + BOX_SIZE && col >= startCol && col < startCol + BOX_SIZE,
    );
    if (inHyper) {
      const [startRow, startCol] = inHyper;
      for (let r = 0; r < BOX_SIZE; r += 1) {
        for (let c = 0; c < BOX_SIZE; c += 1) {
          peers.add(`${startRow + r}-${startCol + c}`);
        }
      }
    }
  }

  peers.delete(`${row}-${col}`);
  return Array.from(peers).map((key) => key.split('-').map(Number));
}

function isSafe(board, row, col, num, variant) {
  const peers = getVariantPeers(row, col, variant);
  return peers.every(([r, c]) => board[r][c] !== num);
}

function solve(board, variant) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (board[row][col] === 0) {
        for (const num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(board, row, col, num, variant)) {
            board[row][col] = num;
            if (solve(board, variant)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board, limit = 2, variant) {
  let count = 0;
  function backtrack() {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= BOARD_SIZE; num += 1) {
            if (isSafe(board, row, col, num, variant)) {
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

function generateSolved(variant) {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
  solve(board, variant);
  return board;
}

function generatePuzzle(difficulty, variant) {
  const filled = generateSolved(variant);
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
    const solutions = countSolutions(temp, 2, variant);
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
  const peers = getVariantPeers(row, col, currentVariant);
  const peerKeys = new Set(peers.map(([r, c]) => `${r}-${c}`));
  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (peerKeys.has(`${r}-${c}`)) {
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
    const hasConflict = getVariantPeers(row, col, currentVariant).some(
      ([r, c]) => puzzle[r][c] === value,
    );

    if (hasConflict) cell.classList.add('conflict');
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
  currentVariant = variantEl.value;
  const { puzzleBoard, solutionBoard } = generatePuzzle(difficultyEl.value, currentVariant);
  basePuzzle = deepCopy(puzzleBoard);
  puzzle = deepCopy(puzzleBoard);
  solution = solutionBoard;
  buildBoard();
  renderBoard();
  selected = null;
  setStatus(
    `已生成${variantConfigs[currentVariant]?.label ?? '新玩法'}棋盘，祝解谜愉快！`,
  );
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
  ensureFreshAssets();
  attachPadEvents();
  document.getElementById('new-game').addEventListener('click', newGame);
  difficultyEl.addEventListener('change', newGame);
  variantEl.addEventListener('change', newGame);
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
