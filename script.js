const variantConfigs = {
  classic: {
    label: '经典数独',
    description: '行、列、宫均包含 1-9',
    size: 9,
    box: { rows: 3, cols: 3 },
  },
  diagonal: {
    label: '对角线数独',
    description: '额外要求两条对角线包含 1-9',
    size: 9,
    box: { rows: 3, cols: 3 },
    diagonal: true,
  },
  hyper: {
    label: '超数独',
    description: '在四个中心 3×3 宫内也需包含 1-9',
    size: 9,
    box: { rows: 3, cols: 3 },
    hyperCenters: [
      [1, 1],
      [1, 5],
      [5, 1],
      [5, 5],
    ],
  },
  mini: {
    label: '迷你数独',
    description: '6×6 棋盘，宫为 2×3，使用数字 1-6',
    size: 6,
    box: { rows: 2, cols: 3 },
    digits: [1, 2, 3, 4, 5, 6],
  },
  irregular: {
    label: '不规则数独',
    description: '宫格为不规则形状，同一色块需包含 1-9',
    size: 9,
    box: null,
    regions: [
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        [3, 0],
        [3, 1],
        [4, 0],
      ],
      [
        [0, 2],
        [0, 3],
        [1, 2],
        [1, 3],
        [2, 2],
        [2, 3],
        [3, 2],
        [3, 3],
        [4, 1],
      ],
      [
        [0, 4],
        [0, 5],
        [1, 4],
        [1, 5],
        [2, 4],
        [2, 5],
        [3, 4],
        [3, 5],
        [4, 2],
      ],
      [
        [0, 6],
        [0, 7],
        [1, 6],
        [1, 7],
        [2, 6],
        [2, 7],
        [3, 6],
        [3, 7],
        [4, 3],
      ],
      [
        [0, 8],
        [1, 8],
        [2, 8],
        [3, 8],
        [4, 4],
        [4, 5],
        [5, 4],
        [5, 5],
        [6, 4],
      ],
      [
        [4, 6],
        [4, 7],
        [4, 8],
        [5, 6],
        [5, 7],
        [5, 8],
        [6, 6],
        [6, 7],
        [6, 8],
      ],
      [
        [5, 0],
        [5, 1],
        [6, 0],
        [6, 1],
        [7, 0],
        [7, 1],
        [8, 0],
        [8, 1],
        [8, 2],
      ],
      [
        [5, 2],
        [5, 3],
        [6, 2],
        [6, 3],
        [7, 2],
        [7, 3],
        [8, 3],
        [8, 4],
        [7, 4],
      ],
      [
        [5, 9 - 1],
        [6, 9 - 1],
        [7, 9 - 1],
        [8, 9 - 1],
        [6, 5],
        [6, 4],
        [7, 5],
        [7, 6],
        [7, 7],
      ],
    ],
  },
  geometry: {
    label: '多重几何',
    description: '对角线 + 超数独的组合，中央高亮提示',
    size: 9,
    box: { rows: 3, cols: 3 },
    diagonal: true,
    hyperCenters: [
      [1, 1],
      [1, 5],
      [5, 1],
      [5, 5],
    ],
  },
  killer: {
    label: '杀手数独',
    description: '无提示数字，按区域和数值和限制',
    size: 9,
    box: { rows: 3, cols: 3 },
    cages: [
      { sum: 10, cells: [ [0, 0], [0, 1], [1, 0] ] },
      { sum: 12, cells: [ [0, 2], [0, 3], [1, 1] ] },
      { sum: 17, cells: [ [0, 4], [1, 4], [1, 3] ] },
      { sum: 20, cells: [ [0, 5], [0, 6], [1, 5], [1, 6] ] },
      { sum: 10, cells: [ [0, 7], [0, 8], [1, 7] ] },
      { sum: 15, cells: [ [1, 2], [2, 2], [2, 1] ] },
      { sum: 13, cells: [ [1, 8], [2, 7], [2, 8] ] },
      { sum: 11, cells: [ [2, 0], [3, 0] ] },
      { sum: 21, cells: [ [2, 3], [2, 4], [3, 1], [3, 2] ] },
      { sum: 12, cells: [ [2, 5], [2, 6], [3, 3] ] },
      { sum: 14, cells: [ [3, 4], [3, 5], [3, 6] ] },
      { sum: 16, cells: [ [3, 7], [4, 7], [4, 8] ] },
      { sum: 12, cells: [ [3, 8], [4, 6] ] },
      { sum: 15, cells: [ [4, 0], [4, 1], [5, 0] ] },
      { sum: 11, cells: [ [4, 2], [4, 3] ] },
      { sum: 19, cells: [ [4, 4], [4, 5], [5, 4], [5, 5] ] },
      { sum: 9, cells: [ [4, 9 - 1], [5, 9 - 1] ] },
      { sum: 10, cells: [ [5, 1], [5, 2], [6, 1] ] },
      { sum: 16, cells: [ [5, 3], [6, 2], [6, 3] ] },
      { sum: 13, cells: [ [5, 6], [5, 7], [5, 8] ] },
      { sum: 10, cells: [ [6, 0], [7, 0], [7, 1] ] },
      { sum: 21, cells: [ [6, 4], [6, 5], [7, 3], [7, 4] ] },
      { sum: 13, cells: [ [6, 6], [6, 7] ] },
      { sum: 11, cells: [ [6, 8], [7, 8] ] },
      { sum: 14, cells: [ [7, 2], [8, 2], [8, 3] ] },
      { sum: 16, cells: [ [7, 5], [7, 6], [8, 5] ] },
      { sum: 7, cells: [ [7, 7], [8, 6] ] },
      { sum: 15, cells: [ [8, 0], [8, 1], [8, 4] ] },
      { sum: 10, cells: [ [8, 7], [8, 8] ] },
    ],
    preset: {
      puzzle: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
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
  },
};

const difficultyClues = {
  easy: 44,
  medium: 36,
  hard: 28,
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

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');
const variantEl = document.getElementById('variant');
const padEl = document.querySelector('.pad');

const peerCache = new Map();
const puzzleCache = new Map();

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

function digitsForVariant(variantKey) {
  const { size, digits } = variantConfigs[variantKey];
  if (digits) return digits;
  return Array.from({ length: size }, (_, i) => i + 1);
}

function getVariantPeers(row, col, variantKey) {
  const config = variantConfigs[variantKey];
  const cacheKey = `${variantKey}-${row}-${col}`;
  if (peerCache.has(cacheKey)) return peerCache.get(cacheKey);

  const peers = new Set();

  for (let i = 0; i < config.size; i += 1) {
    peers.add(`${row}-${i}`);
    peers.add(`${i}-${col}`);
  }

  if (config.box) {
    const { rows, cols } = config.box;
    const boxRow = Math.floor(row / rows) * rows;
    const boxCol = Math.floor(col / cols) * cols;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        peers.add(`${boxRow + r}-${boxCol + c}`);
      }
    }
  }

  if (config.diagonal) {
    if (row === col) {
      for (let i = 0; i < config.size; i += 1) {
        peers.add(`${i}-${i}`);
      }
    }
    if (row + col === config.size - 1) {
      for (let i = 0; i < config.size; i += 1) {
        peers.add(`${i}-${config.size - 1 - i}`);
      }
    }
  }

  if (config.hyperCenters) {
    const { rows, cols } = config.box;
    const inHyper = config.hyperCenters.find(
      ([startRow, startCol]) =>
        row >= startRow && row < startRow + rows && col >= startCol && col < startCol + cols,
    );
    if (inHyper) {
      const [startRow, startCol] = inHyper;
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          peers.add(`${startRow + r}-${startCol + c}`);
        }
      }
    }
  }

  if (config.regions) {
    const regionIndex = config.regions.findIndex((region) =>
      region.some(([r, c]) => r === row && c === col),
    );
    if (regionIndex !== -1) {
      config.regions[regionIndex].forEach(([r, c]) => peers.add(`${r}-${c}`));
    }
  }

  if (config.extraRegions) {
    const region = config.extraRegions.find((cells) => cells.some(([r, c]) => r === row && c === col));
    if (region) {
      region.forEach(([r, c]) => peers.add(`${r}-${c}`));
    }
  }

  peers.delete(`${row}-${col}`);
  const result = Array.from(peers).map((key) => key.split('-').map(Number));
  peerCache.set(cacheKey, result);
  return result;
}

function isSafe(board, row, col, num, variant) {
  const peers = getVariantPeers(row, col, variant);
  return peers.every(([r, c]) => board[r][c] !== num);
}

function solve(board, variant) {
  const { size } = variantConfigs[variant];
  const numbers = digitsForVariant(variant);
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] === 0) {
        for (const num of shuffle(numbers)) {
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
  const numbers = digitsForVariant(variant);
  const { size } = variantConfigs[variant];
  function backtrack() {
    for (let row = 0; row < size; row += 1) {
      for (let col = 0; col < size; col += 1) {
        if (board[row][col] === 0) {
          for (const num of numbers) {
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
  const { size } = variantConfigs[variant];
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  solve(board, variant);
  return board;
}

function generatePuzzle(difficulty, variant) {
  const config = variantConfigs[variant];
  if (config.preset) {
    return { puzzleBoard: deepCopy(config.preset.puzzle), solutionBoard: deepCopy(config.preset.solution) };
  }
  const filled = generateSolved(variant);
  const puzzleBoard = deepCopy(filled);
  const totalCells = config.size * config.size;
  const baseClues = difficultyClues[difficulty] ?? difficultyClues.medium;
  const clues = Math.min(baseClues, Math.max(Math.floor(totalCells * 0.45), config.size * 2));
  const cells = shuffle([...Array(totalCells).keys()]);
  let removed = 0;

  for (const index of cells) {
    const row = Math.floor(index / config.size);
    const col = index % config.size;
    const backup = puzzleBoard[row][col];
    puzzleBoard[row][col] = 0;

    const temp = deepCopy(puzzleBoard);
    const solutions = countSolutions(temp, 2, variant);
    const remaining = config.size * config.size - removed - 1;
    if (solutions !== 1 || remaining < clues) {
      puzzleBoard[row][col] = backup;
    } else {
      removed += 1;
    }
  }

  return { puzzleBoard, solutionBoard: filled };
}

function clearBoardClasses() {
  boardEl.querySelectorAll('.cell').forEach((cell) => {
    cell.classList.remove('same-line', 'same-value', 'hyper', 'diagonal', 'irregular', 'geometry', 'cage');
    cell.removeAttribute('data-cage-label');
  });
}

function buildBoard() {
  const config = variantConfigs[currentVariant];
  boardEl.innerHTML = '';
  boardEl.style.gridTemplateColumns = `repeat(${config.size}, minmax(0, 1fr))`;
  boardEl.style.gridTemplateRows = `repeat(${config.size}, minmax(0, 1fr))`;

  for (let row = 0; row < config.size; row += 1) {
    for (let col = 0; col < config.size; col += 1) {
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      if (config.box) {
        if ((col + 1) % config.box.cols === 0 && col !== config.size - 1) {
          cell.classList.add('box-border-right');
        }
        if ((row + 1) % config.box.rows === 0 && row !== config.size - 1) {
          cell.classList.add('box-border-bottom');
        }
      }
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `行${row + 1}列${col + 1}`);
      cell.addEventListener('click', () => selectCell(cell));
      boardEl.appendChild(cell);
    }
  }
}

function renderBoard() {
  const config = variantConfigs[currentVariant];
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
  applyConstraintHints(config);
}

function applyConstraintHints(config) {
  clearBoardClasses();
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    if (config.diagonal && (row === col || row + col === config.size - 1)) {
      cell.classList.add('diagonal');
    }
    if (config.hyperCenters && config.box) {
      config.hyperCenters.forEach(([startRow, startCol]) => {
        if (
          row >= startRow && row < startRow + config.box.rows &&
          col >= startCol && col < startCol + config.box.cols
        ) {
          cell.classList.add('hyper');
        }
      });
    }
    if (config.regions) {
      const regionIndex = config.regions.findIndex((region) =>
        region.some(([r, c]) => r === row && c === col),
      );
      if (regionIndex !== -1) {
        cell.dataset.region = regionIndex;
        cell.classList.add('irregular');
      }
    } else {
      cell.removeAttribute('data-region');
    }
  });

  if (config.cages) {
    config.cages.forEach((cage, idx) => {
      const sorted = [...cage.cells].sort(([r1, c1], [r2, c2]) => (r1 === r2 ? c1 - c2 : r1 - r2));
      const [labelRow, labelCol] = sorted[0];
      cage.cells.forEach(([r, c]) => {
        const cell = boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
          cell.classList.add('cage');
          if (r === labelRow && c === labelCol) {
            cell.dataset.cageLabel = `${cage.sum} (#${idx + 1})`;
          }
        }
      });
    });
  }
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
  const config = variantConfigs[currentVariant];
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

  if (config.cages) {
    config.cages.forEach((cage) => {
      const values = cage.cells.map(([r, c]) => puzzle[r][c]).filter((v) => v !== 0);
      const hasDuplicates = new Set(values).size !== values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      const exceeds = sum > cage.sum;
      if (hasDuplicates || exceeds || (values.length === cage.cells.length && sum !== cage.sum)) {
        cage.cells.forEach(([r, c]) => {
          const cell = boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
          if (cell) cell.classList.add('conflict');
        });
      }
    });
  }
}

function isComplete() {
  const config = variantConfigs[currentVariant];
  for (let r = 0; r < config.size; r += 1) {
    for (let c = 0; c < config.size; c += 1) {
      if (puzzle[r][c] === 0 || puzzle[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

function setStatus(text, success = false) {
  statusEl.textContent = text;
  statusEl.style.color = success ? '#16a34a' : 'var(--muted)';
}

function buildPad() {
  const digits = digitsForVariant(currentVariant);
  padEl.innerHTML = '';
  digits.forEach((n) => {
    const btn = document.createElement('button');
    btn.className = 'pad-btn';
    btn.dataset.number = n;
    btn.textContent = n;
    btn.addEventListener('click', () => handleInput(Number(n)));
    padEl.appendChild(btn);
  });
  const clearBtn = document.createElement('button');
  clearBtn.className = 'pad-btn secondary';
  clearBtn.dataset.number = 0;
  clearBtn.textContent = '清除';
  clearBtn.addEventListener('click', () => handleInput(0));
  padEl.appendChild(clearBtn);
}

function newGame() {
  currentVariant = variantEl.value;
  const cacheKey = `${currentVariant}-${difficultyEl.value}`;
  setStatus('正在生成棋盘，请稍候…');
  requestAnimationFrame(() => {
    let generated;
    if (puzzleCache.has(cacheKey)) {
      generated = puzzleCache.get(cacheKey);
    } else {
      generated = generatePuzzle(difficultyEl.value, currentVariant);
      puzzleCache.set(cacheKey, generated);
    }
    basePuzzle = deepCopy(generated.puzzleBoard);
    puzzle = deepCopy(generated.puzzleBoard);
    solution = generated.solutionBoard;
    buildBoard();
    renderBoard();
    buildPad();
    selected = null;
    validateConflicts();
    setStatus(`已生成${variantConfigs[currentVariant]?.label ?? '新玩法'}棋盘，祝解谜愉快！`);
  });
}

function resetBoard() {
  puzzle = deepCopy(basePuzzle);
  renderBoard();
  selected = null;
  validateConflicts();
  setStatus('已重置。');
}

function giveHint() {
  const config = variantConfigs[currentVariant];
  const empties = [];
  for (let r = 0; r < config.size; r += 1) {
    for (let c = 0; c < config.size; c += 1) {
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
  const digits = digitsForVariant(currentVariant).map(String);
  if (digits.includes(e.key)) {
    handleInput(Number(e.key));
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0' || e.key === ' ') {
    handleInput(0);
  }
}

function attachPadEvents() {
  padEl.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.number) {
      handleInput(Number(target.dataset.number));
    }
  });
}

function init() {
  ensureFreshAssets();
  attachPadEvents();
  document.getElementById('new-game').addEventListener('click', newGame);
  difficultyEl.addEventListener('change', () => {
    puzzleCache.delete(`${currentVariant}-${difficultyEl.value}`);
    newGame();
  });
  variantEl.addEventListener('change', () => {
    peerCache.clear();
    newGame();
  });
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
