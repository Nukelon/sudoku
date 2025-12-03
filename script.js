const difficultyClues = {
  easy: 44,
  medium: 36,
  hard: 28,
};

const presetBoards = {
  killer: {
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
};

const variantConfigs = {
  classic: {
    label: '经典数独',
    description: '行、列、宫均包含完整数字',
    type: 'generator',
    size: 9,
    box: { rows: 3, cols: 3 },
  },
  diagonal: {
    label: '对角线数独',
    description: '额外要求两条对角线包含完整数字',
    type: 'generator',
    size: 9,
    box: { rows: 3, cols: 3 },
    diagonal: true,
  },
  hyper: {
    label: '超数独',
    description: '在四个中心 3×3 宫内也需包含完整数字',
    type: 'generator',
    size: 9,
    box: { rows: 3, cols: 3 },
    hyperStarts: [
      [1, 1],
      [1, 5],
      [5, 1],
      [5, 5],
    ],
  },
  mini: {
    label: '迷你数独',
    description: '6×6 棋盘，使用 1-6，宫为 2×3',
    type: 'generator',
    size: 6,
    box: { rows: 2, cols: 3 },
  },
  irregular: {
    label: '不规则数独',
    description: '九个对角条纹区域替代传统宫格',
    type: 'generator',
    size: 9,
    box: { rows: 3, cols: 3 },
    regionMap: Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => (r + c) % 9),
    ),
  },
  geometry: {
    label: '几何 / 特殊形状数独',
    description: '使用更复杂的几何区域划分',
    type: 'generator',
    size: 9,
    box: { rows: 3, cols: 3 },
    regionMap: Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => (r + 2 * c) % 9),
    ),
  },
  killer: {
    label: '杀手数独',
    description: '传统规则 + 牢笼和合计提示',
    type: 'preset',
    size: 9,
    box: { rows: 3, cols: 3 },
    cages: [
      { cells: [[0, 0], [0, 1], [0, 2]], sum: 12 },
      { cells: [[0, 3], [0, 4], [0, 5]], sum: 21 },
      { cells: [[0, 6], [0, 7], [0, 8]], sum: 12 },
      { cells: [[1, 0], [1, 1], [1, 2]], sum: 15 },
      { cells: [[1, 3], [1, 4], [1, 5]], sum: 15 },
      { cells: [[1, 6], [1, 7], [1, 8]], sum: 15 },
      { cells: [[2, 0], [2, 1], [2, 2]], sum: 18 },
      { cells: [[2, 3], [2, 4], [2, 5]], sum: 9 },
      { cells: [[2, 6], [2, 7], [2, 8]], sum: 18 },
      { cells: [[3, 0], [3, 1], [3, 2]], sum: 22 },
      { cells: [[3, 3], [3, 4], [3, 5]], sum: 14 },
      { cells: [[3, 6], [3, 7], [3, 8]], sum: 9 },
      { cells: [[4, 0], [4, 1], [4, 2]], sum: 12 },
      { cells: [[4, 3], [4, 4], [4, 5]], sum: 16 },
      { cells: [[4, 6], [4, 7], [4, 8]], sum: 17 },
      { cells: [[5, 0], [5, 1], [5, 2]], sum: 11 },
      { cells: [[5, 3], [5, 4], [5, 5]], sum: 15 },
      { cells: [[5, 6], [5, 7], [5, 8]], sum: 19 },
      { cells: [[6, 0], [6, 1], [6, 2]], sum: 16 },
      { cells: [[6, 3], [6, 4], [6, 5]], sum: 15 },
      { cells: [[6, 6], [6, 7], [6, 8]], sum: 14 },
      { cells: [[7, 0], [7, 1], [7, 2]], sum: 17 },
      { cells: [[7, 3], [7, 4], [7, 5]], sum: 14 },
      { cells: [[7, 6], [7, 7], [7, 8]], sum: 14 },
      { cells: [[8, 0], [8, 1], [8, 2]], sum: 12 },
      { cells: [[8, 3], [8, 4], [8, 5]], sum: 16 },
      { cells: [[8, 6], [8, 7], [8, 8]], sum: 17 },
    ],
  },
};

const APP_VERSION = '1.2.0';

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
let currentVariantConfig = variantConfigs[currentVariant];
let boardSize = currentVariantConfig.size;
let boxRows = currentVariantConfig.box.rows;
let boxCols = currentVariantConfig.box.cols;
let regionMap = currentVariantConfig.regionMap ?? null;
let cageLookup = new Map();
const puzzleCache = new Map();

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
  const config = variantConfigs[variant];

  for (let i = 0; i < boardSize; i += 1) {
    peers.add(`${row}-${i}`);
    peers.add(`${i}-${col}`);
  }

  if (regionMap) {
    const targetRegion = regionMap[row][col];
    for (let r = 0; r < boardSize; r += 1) {
      for (let c = 0; c < boardSize; c += 1) {
        if (regionMap[r][c] === targetRegion) peers.add(`${r}-${c}`);
      }
    }
  } else {
    const boxRow = Math.floor(row / boxRows) * boxRows;
    const boxCol = Math.floor(col / boxCols) * boxCols;
    for (let r = 0; r < boxRows; r += 1) {
      for (let c = 0; c < boxCols; c += 1) {
        peers.add(`${boxRow + r}-${boxCol + c}`);
      }
    }
  }

  if (config.diagonal) {
    if (row === col) {
      for (let i = 0; i < boardSize; i += 1) {
        peers.add(`${i}-${i}`);
      }
    }
    if (row + col === boardSize - 1) {
      for (let i = 0; i < boardSize; i += 1) {
        peers.add(`${i}-${boardSize - 1 - i}`);
      }
    }
  }

  if (config.hyperStarts) {
    const inHyper = config.hyperStarts.find(
      ([startRow, startCol]) =>
        row >= startRow && row < startRow + boxRows && col >= startCol && col < startCol + boxCols,
    );
    if (inHyper) {
      const [startRow, startCol] = inHyper;
      for (let r = 0; r < boxRows; r += 1) {
        for (let c = 0; c < boxCols; c += 1) {
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
  const noConflict = peers.every(([r, c]) => board[r][c] !== num);
  if (!noConflict) return false;

  const config = variantConfigs[variant];
  if (config.cages) {
    const cageKey = `${row}-${col}`;
    const cageIndex = cageLookup.get(cageKey);
    if (typeof cageIndex === 'number') {
      const cage = config.cages[cageIndex];
      const filled = cage.cells.map(([r, c]) => (r === row && c === col ? num : board[r][c]));
      const filledValues = filled.filter((v) => v !== 0);
      if (new Set(filledValues).size !== filledValues.length) return false;
      const currentSum = filled.reduce((acc, val) => acc + val, 0);
      if (currentSum > cage.sum) return false;
      const allFilled = filled.every((v) => v !== 0);
      if (allFilled && currentSum !== cage.sum) return false;
    }
  }
  return true;
}

function solve(board, variant) {
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      if (board[row][col] === 0) {
        for (const num of shuffle([...Array(boardSize).keys()].map((n) => n + 1))) {
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
    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= boardSize; num += 1) {
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
  const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  solve(board, variant);
  return board;
}

function generatePuzzle(difficulty, variant) {
  const filled = generateSolved(variant);
  const puzzleBoard = deepCopy(filled);
  const baseClues = difficultyClues[difficulty] ?? difficultyClues.medium;
  const clues = Math.max(Math.floor((baseClues / 81) * boardSize * boardSize), boardSize * 2);
  const cells = shuffle([...Array(boardSize * boardSize).keys()]);
  let removed = 0;

  for (const index of cells) {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const backup = puzzleBoard[row][col];
    puzzleBoard[row][col] = 0;

    const temp = deepCopy(puzzleBoard);
    const solutions = countSolutions(temp, 2, variant);
    const remaining = boardSize * boardSize - removed - 1;
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
  boardEl.style.gridTemplateColumns = `repeat(${boardSize}, minmax(0, 1fr))`;
  boardEl.style.gridTemplateRows = `repeat(${boardSize}, minmax(0, 1fr))`;
  boardEl.dataset.variant = currentVariant;
  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      if ((col + 1) % boxCols === 0 && col !== boardSize - 1) {
        cell.classList.add('box-border-right');
      }
      if ((row + 1) % boxRows === 0 && row !== boardSize - 1) {
        cell.classList.add('box-border-bottom');
      }
      if (currentVariantConfig.hyperStarts) {
        const isHyper = currentVariantConfig.hyperStarts.some(
          ([startRow, startCol]) =>
            row >= startRow && row < startRow + boxRows && col >= startCol && col < startCol + boxCols,
        );
        if (isHyper) cell.classList.add('hyper-region');
      }
      if (regionMap) {
        const regionId = regionMap[row][col];
        cell.dataset.region = regionId;
        cell.style.setProperty('--region-hue', (regionId * 40) % 360);
        cell.classList.add('region-cell');
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
    cell.classList.remove('same-line', 'same-value', 'same-cage');
  });
  if (!selected) return;
  const row = Number(selected.dataset.row);
  const col = Number(selected.dataset.col);
  const value = selected.textContent;
  const peers = getVariantPeers(row, col, currentVariant);
  const peerKeys = new Set(peers.map(([r, c]) => `${r}-${c}`));
  const cageKey = `${row}-${col}`;
  const cageIndex = cageLookup.get(cageKey);
  const cageCells = cageIndex !== undefined ? currentVariantConfig.cages?.[cageIndex]?.cells ?? [] : [];
  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (peerKeys.has(`${r}-${c}`)) {
      cell.classList.add('same-line');
    }
    if (value && cell.textContent === value) {
      cell.classList.add('same-value');
    }
    if (cageCells.some(([cr, cc]) => cr === r && cc === c)) {
      cell.classList.add('same-cage');
    }
  });
}

function handleInput(num) {
  if (num > boardSize) return;
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
    const hasConflict = !isSafe(puzzle, row, col, value, currentVariant);
    if (hasConflict) cell.classList.add('conflict');
  }
}

function isComplete() {
  for (let r = 0; r < boardSize; r += 1) {
    for (let c = 0; c < boardSize; c += 1) {
      if (puzzle[r][c] === 0 || puzzle[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

function setStatus(text, success = false) {
  statusEl.textContent = text;
  statusEl.style.color = success ? '#16a34a' : 'var(--muted)';
}

function applyVariantSettings(variant) {
  currentVariantConfig = variantConfigs[variant];
  boardSize = currentVariantConfig.size;
  boxRows = currentVariantConfig.box.rows;
  boxCols = currentVariantConfig.box.cols;
  regionMap = currentVariantConfig.regionMap ?? null;
  cageLookup = new Map();
  if (currentVariantConfig.cages) {
    currentVariantConfig.cages.forEach((cage, index) => {
      cage.cells.forEach(([r, c]) => cageLookup.set(`${r}-${c}`, index));
    });
  }
  updatePad();
}

function usePuzzle(puzzleBoard, solutionBoard) {
  basePuzzle = deepCopy(puzzleBoard);
  puzzle = deepCopy(puzzleBoard);
  solution = solutionBoard;
  buildBoard();
  renderBoard();
  validateConflicts();
  selected = null;
}

function updatePad() {
  document.querySelectorAll('.pad-btn').forEach((btn) => {
    const num = Number(btn.dataset.number);
    const hidden = num > boardSize && num !== 0;
    btn.disabled = hidden;
    btn.classList.toggle('hidden', hidden);
  });
}

function newGame() {
  currentVariant = variantEl.value;
  applyVariantSettings(currentVariant);
  const difficulty = difficultyEl.value;
  const cacheKey = `${currentVariant}-${difficulty}`;
  const cached = puzzleCache.get(cacheKey);
  if (cached) {
    usePuzzle(cached.puzzleBoard, cached.solutionBoard);
    setStatus(`已切换到缓存的${variantConfigs[currentVariant].label}棋盘，畅玩无等待。`);
    highlightRelated();
    return;
  }

  setStatus('正在准备新的棋盘，请稍等…');
  setTimeout(() => {
    if (currentVariantConfig.type === 'preset') {
      const preset = presetBoards[currentVariant];
      const puzzleBoard = deepCopy(preset.puzzle);
      const solutionBoard = deepCopy(preset.solution);
      puzzleCache.set(cacheKey, { puzzleBoard, solutionBoard });
      usePuzzle(puzzleBoard, solutionBoard);
    } else {
      const { puzzleBoard, solutionBoard } = generatePuzzle(difficulty, currentVariant);
      puzzleCache.set(cacheKey, { puzzleBoard, solutionBoard });
      usePuzzle(puzzleBoard, solutionBoard);
    }
    setStatus(`已生成${variantConfigs[currentVariant]?.label ?? '新玩法'}棋盘，祝解谜愉快！`);
    highlightRelated();
  }, 10);
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
  for (let r = 0; r < boardSize; r += 1) {
    for (let c = 0; c < boardSize; c += 1) {
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
  const maxDigit = boardSize;
  if (e.key >= '1' && Number(e.key) <= maxDigit) {
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
