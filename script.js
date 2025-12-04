const APP_VERSION = '1.2.0';

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const difficultyEl = document.getElementById('difficulty');
const variantEl = document.getElementById('variant');
const padEl = document.getElementById('pad');

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

function indexFromRC(row, col, size) {
  return row * size + col;
}

function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function buildRowRegions(size) {
  const regions = [];
  for (let r = 0; r < size; r += 1) {
    const region = [];
    for (let c = 0; c < size; c += 1) {
      region.push(indexFromRC(r, c, size));
    }
    regions.push(region);
  }
  return regions;
}

function buildColumnRegions(size) {
  const regions = [];
  for (let c = 0; c < size; c += 1) {
    const region = [];
    for (let r = 0; r < size; r += 1) {
      region.push(indexFromRC(r, c, size));
    }
    regions.push(region);
  }
  return regions;
}

function buildBoxRegions(size, boxRows, boxCols) {
  const regions = [];
  for (let br = 0; br < size; br += boxRows) {
    for (let bc = 0; bc < size; bc += boxCols) {
      const region = [];
      for (let r = 0; r < boxRows; r += 1) {
        for (let c = 0; c < boxCols; c += 1) {
          region.push(indexFromRC(br + r, bc + c, size));
        }
      }
      regions.push(region);
    }
  }
  return regions;
}

function buildStandardRegions(size, boxRows, boxCols) {
  return [...buildRowRegions(size), ...buildColumnRegions(size), ...buildBoxRegions(size, boxRows, boxCols)];
}

function buildDiagonalRegions(size) {
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < size; i += 1) {
    diag1.push(indexFromRC(i, i, size));
    diag2.push(indexFromRC(i, size - 1 - i, size));
  }
  return [diag1, diag2];
}

function buildHyperRegions() {
  const regions = [];
  const starts = [1, 5];
  for (const rStart of starts) {
    for (const cStart of starts) {
      const region = [];
      for (let r = 0; r < 3; r += 1) {
        for (let c = 0; c < 3; c += 1) {
          region.push(indexFromRC(rStart + r, cStart + c, 9));
        }
      }
      regions.push(region);
    }
  }
  return regions;
}

function buildJigsawRegions(layout) {
  const regions = [];
  const size = layout.length;
  const regionCount = Math.max(...layout.flat()) + 1;
  for (let i = 0; i < regionCount; i += 1) {
    regions.push([]);
  }
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const idx = layout[r][c];
      regions[idx].push(indexFromRC(r, c, size));
    }
  }
  return regions;
}

function buildRingRegions() {
  const size = 9;
  const regions = [];
  // rings (inner to outer)
  for (let ring = 0; ring < size; ring += 1) {
    const region = [];
    for (let ray = 0; ray < size; ray += 1) {
      region.push(indexFromRC(ring, ray, size));
    }
    regions.push(region);
  }
  // rays (center to outside)
  for (let ray = 0; ray < size; ray += 1) {
    const region = [];
    for (let ring = 0; ring < size; ring += 1) {
      region.push(indexFromRC(ring, ray, size));
    }
    regions.push(region);
  }
  return regions;
}

const jigsaw7Layout = [
  [1, 1, 1, 1, 0, 4, 4],
  [1, 1, 0, 0, 0, 0, 4],
  [1, 2, 2, 0, 0, 3, 4],
  [5, 2, 2, 3, 3, 3, 4],
  [5, 5, 2, 3, 6, 4, 4],
  [5, 5, 2, 3, 6, 6, 6],
  [5, 5, 2, 3, 6, 6, 6],
];

const variants = [
  {
    id: 'classic',
    name: '经典 9×9',
    size: 9,
    symbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buildRegions: () => buildStandardRegions(9, 3, 3),
    clueTargets: { easy: 44, medium: 36, hard: 28 },
    box: { rows: 3, cols: 3 },
  },
  {
    id: 'mini4',
    name: '迷你数独 4×4',
    size: 4,
    symbols: [1, 2, 3, 4],
    buildRegions: () => buildStandardRegions(4, 2, 2),
    clueTargets: { easy: 10, medium: 8, hard: 6 },
    box: { rows: 2, cols: 2 },
  },
  {
    id: 'mini6',
    name: '迷你数独 6×6',
    size: 6,
    symbols: [1, 2, 3, 4, 5, 6],
    buildRegions: () => buildStandardRegions(6, 2, 3),
    clueTargets: { easy: 20, medium: 16, hard: 14 },
    box: { rows: 2, cols: 3 },
  },
  {
    id: 'mini7',
    name: '迷你数独 7×7（不规则宫）',
    size: 7,
    symbols: [1, 2, 3, 4, 5, 6, 7],
    buildRegions: () => [...buildRowRegions(7), ...buildColumnRegions(7), ...buildJigsawRegions(jigsaw7Layout)],
    clueTargets: { easy: 28, medium: 24, hard: 20 },
  },
  {
    id: 'hyper',
    name: '超数独（Hyper）',
    size: 9,
    symbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buildRegions: () => [...buildStandardRegions(9, 3, 3), ...buildHyperRegions()],
    clueTargets: { easy: 44, medium: 36, hard: 28 },
    box: { rows: 3, cols: 3 },
  },
  {
    id: 'diagonal',
    name: '对角线数独（Sudoku X）',
    size: 9,
    symbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buildRegions: () => [...buildStandardRegions(9, 3, 3), ...buildDiagonalRegions(9)],
    clueTargets: { easy: 44, medium: 36, hard: 28 },
    box: { rows: 3, cols: 3 },
  },
  {
    id: 'ring',
    name: '环形数独',
    size: 9,
    symbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buildRegions: () => buildRingRegions(),
    clueTargets: { easy: 40, medium: 34, hard: 28 },
  },
  {
    id: 'killer',
    name: '杀手数独',
    size: 9,
    symbols: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    buildRegions: () => buildStandardRegions(9, 3, 3),
    clueTargets: { easy: 0, medium: 0, hard: 0 },
    box: { rows: 3, cols: 3 },
    generator: 'killer',
  },
];

let basePuzzle = [];
let puzzle = [];
let solution = [];
let selected = null;
let currentRules = null;
let currentVariant = variants[0];

function createRegionMap(regions, size) {
  const regionMap = Array.from({ length: size * size }, () => []);
  regions.forEach((region, rIndex) => {
    region.forEach((cell) => {
      regionMap[cell].push(rIndex);
    });
  });
  return regionMap;
}

function createCageMap(cages, size) {
  const cageMap = Array(size * size).fill(-1);
  cages.forEach((cage, idx) => {
    cage.cells.forEach((cell) => {
      cageMap[cell] = idx;
    });
  });
  return cageMap;
}

function buildRuleSet(variant, extras = {}) {
  const regions = extras.regions ?? variant.buildRegions();
  const cages = extras.cages ?? [];
  const regionMap = createRegionMap(regions, variant.size);
  const cageMap = cages.length ? createCageMap(cages, variant.size) : null;
  return {
    size: variant.size,
    symbols: variant.symbols,
    regions,
    regionMap,
    cages,
    cageMap,
    box: variant.box,
  };
}

function getCellValue(board, index, size) {
  const row = Math.floor(index / size);
  const col = index % size;
  return board[row][col];
}

function setCellValue(board, index, size, value) {
  const row = Math.floor(index / size);
  const col = index % size;
  board[row][col] = value;
}

function isSafe(board, index, value, rules) {
  if (value === 0) return true;
  const { regionMap, regions, cageMap, cages, size } = rules;
  for (const regionIndex of regionMap[index]) {
    const region = regions[regionIndex];
    for (const cell of region) {
      if (cell === index) continue;
      if (getCellValue(board, cell, size) === value) return false;
    }
  }

  if (cageMap && cageMap[index] !== -1) {
    const cage = cages[cageMap[index]];
    let sum = value;
    for (const cell of cage.cells) {
      if (cell === index) continue;
      const v = getCellValue(board, cell, size);
      if (v === 0) continue;
      if (v === value) return false;
      sum += v;
    }
    if (sum > cage.sum) return false;
    const remaining = cage.cells.filter((cell) => getCellValue(board, cell, size) === 0).length;
    if (remaining === 0 && sum !== cage.sum) return false;
  }
  return true;
}

function solve(board, rules) {
  const { size, symbols } = rules;
  for (let index = 0; index < size * size; index += 1) {
    const value = getCellValue(board, index, size);
    if (value === 0) {
      for (const num of shuffle(symbols)) {
        if (isSafe(board, index, num, rules)) {
          setCellValue(board, index, size, num);
          if (solve(board, rules)) return true;
          setCellValue(board, index, size, 0);
        }
      }
      return false;
    }
  }
  return true;
}

function countSolutions(board, rules, limit = 2) {
  const { size, symbols } = rules;
  let count = 0;
  function backtrack() {
    for (let index = 0; index < size * size; index += 1) {
      const value = getCellValue(board, index, size);
      if (value === 0) {
        for (const num of symbols) {
          if (isSafe(board, index, num, rules)) {
            setCellValue(board, index, size, num);
            backtrack();
            if (count >= limit) return;
            setCellValue(board, index, size, 0);
          }
        }
        return;
      }
    }
    count += 1;
  }
  backtrack();
  return count;
}

function generateSolved(rules) {
  const board = createEmptyBoard(rules.size);
  solve(board, rules);
  return board;
}

function removeCellsForPuzzle(board, rules, targetClues) {
  const size = rules.size;
  const totalCells = size * size;
  const puzzleBoard = deepCopy(board);
  const cells = shuffle([...Array(totalCells).keys()]);
  let removed = 0;
  for (const cell of cells) {
    const backup = getCellValue(puzzleBoard, cell, size);
    setCellValue(puzzleBoard, cell, size, 0);
    const temp = deepCopy(puzzleBoard);
    const solutions = countSolutions(temp, rules);
    const remaining = totalCells - removed - 1;
    if (solutions !== 1 || remaining < targetClues) {
      setCellValue(puzzleBoard, cell, size, backup);
    } else {
      removed += 1;
    }
  }
  return puzzleBoard;
}

function buildRandomCages(solution, size) {
  const allCells = shuffle([...Array(size * size).keys()]);
  const remaining = new Set(allCells);
  const cages = [];
  while (remaining.size) {
    const [start] = remaining;
    const cageSize = Math.min(remaining.size, Math.floor(Math.random() * 4) + 1);
    const cageCells = [start];
    remaining.delete(start);
    while (cageCells.length < cageSize && remaining.size) {
      const neighbors = [];
      for (const cell of cageCells) {
        const row = Math.floor(cell / size);
        const col = cell % size;
        const options = [
          indexFromRC(row - 1, col, size),
          indexFromRC(row + 1, col, size),
          indexFromRC(row, col - 1, size),
          indexFromRC(row, col + 1, size),
        ];
        options.forEach((opt) => {
          if (opt >= 0 && opt < size * size && remaining.has(opt)) neighbors.push(opt);
        });
      }
      if (!neighbors.length) break;
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      cageCells.push(next);
      remaining.delete(next);
    }
    const sum = cageCells.reduce((acc, idx) => acc + getCellValue(solution, idx, size), 0);
    cages.push({ cells: cageCells, sum });
  }
  return cages;
}

function generateKillerPuzzle(variant, difficulty) {
  const maxAttempts = 6;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const baseRules = buildRuleSet(variant);
    const solved = generateSolved(baseRules);
    const cages = buildRandomCages(solved, variant.size);
    const rulesWithCage = buildRuleSet(variant, { cages });
    const puzzleBoard = createEmptyBoard(variant.size);
    const givens = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 4 : 2;
    const filler = shuffle([...Array(variant.size * variant.size).keys()]).slice(0, givens);
    filler.forEach((idx) => setCellValue(puzzleBoard, idx, variant.size, getCellValue(solved, idx, variant.size)));
    const temp = deepCopy(puzzleBoard);
    if (countSolutions(temp, rulesWithCage) === 1) {
      return { puzzleBoard, solutionBoard: solved, rules: rulesWithCage };
    }
  }
  const fallbackRules = buildRuleSet(variant);
  const solved = generateSolved(fallbackRules);
  const cages = buildRandomCages(solved, variant.size);
  const rulesWithCage = buildRuleSet(variant, { cages });
  return { puzzleBoard: createEmptyBoard(variant.size), solutionBoard: solved, rules: rulesWithCage };
}

function generatePuzzleForVariant(variant, difficulty) {
  if (variant.generator === 'killer') {
    return generateKillerPuzzle(variant, difficulty);
  }
  const rules = buildRuleSet(variant);
  const solved = generateSolved(rules);
  const targetClues = variant.clueTargets[difficulty] ?? variant.clueTargets.medium;
  const puzzleBoard = removeCellsForPuzzle(solved, rules, targetClues);
  return { puzzleBoard, solutionBoard: solved, rules };
}

function buildBoard() {
  boardEl.innerHTML = '';
  boardEl.style.setProperty('--board-size', currentRules.size);
  boardEl.style.gridTemplateColumns = `repeat(${currentRules.size}, minmax(0, 1fr))`;
  boardEl.style.gridTemplateRows = `repeat(${currentRules.size}, minmax(0, 1fr))`;
  for (let row = 0; row < currentRules.size; row += 1) {
    for (let col = 0; col < currentRules.size; col += 1) {
      const index = indexFromRC(row, col, currentRules.size);
      const cell = document.createElement('button');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.index = index;
      if (currentRules.box) {
        if ((col + 1) % currentRules.box.cols === 0 && col !== currentRules.size - 1) {
          cell.classList.add('box-border-right');
        }
        if ((row + 1) % currentRules.box.rows === 0 && row !== currentRules.size - 1) {
          cell.classList.add('box-border-bottom');
        }
      }
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('aria-label', `行${row + 1}列${col + 1}`);
      cell.addEventListener('click', () => selectCell(cell));
      boardEl.appendChild(cell);
    }
  }
  applyCageStyles();
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
  const selectedIndex = Number(selected.dataset.index);
  const related = new Set();
  currentRules.regionMap[selectedIndex].forEach((regionIndex) => {
    currentRules.regions[regionIndex].forEach((cell) => related.add(cell));
  });
  const value = selected.textContent;
  cells.forEach((cell) => {
    const idx = Number(cell.dataset.index);
    if (related.has(idx)) {
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
  if (num !== 0 && !currentRules.symbols.includes(num)) return;

  puzzle[row][col] = num;
  selected.textContent = num === 0 ? '' : num;
  validateConflicts();
  highlightRelated();
  if (isComplete()) setStatus('🎉  恭喜完成！', true);
}

function hasRegionConflict(index, value) {
  return currentRules.regionMap[index].some((regionIndex) =>
    currentRules.regions[regionIndex].some((cell) => {
      if (cell === index) return false;
      const v = getCellValue(puzzle, cell, currentRules.size);
      return v === value;
    }),
  );
}

function hasCageConflict(index, value) {
  if (!currentRules.cageMap) return false;
  const cageIndex = currentRules.cageMap[index];
  if (cageIndex === -1) return false;
  const cage = currentRules.cages[cageIndex];
  let sum = 0;
  const seen = new Set();
  for (const cell of cage.cells) {
    const v = getCellValue(puzzle, cell, currentRules.size);
    if (v === 0) continue;
    sum += v;
    if (seen.has(v)) return true;
    seen.add(v);
  }
  if (value === 0) return false;
  const filledCells = cage.cells.filter((cell) => getCellValue(puzzle, cell, currentRules.size) !== 0).length;
  if (filledCells === cage.cells.length && sum !== cage.sum) return true;
  if (sum > cage.sum) return true;
  return false;
}

function validateConflicts() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => cell.classList.remove('conflict'));

  for (const cell of cells) {
    const index = Number(cell.dataset.index);
    const value = getCellValue(puzzle, index, currentRules.size);
    if (value === 0) continue;
    const hasConflict = hasRegionConflict(index, value) || hasCageConflict(index, value);
    if (hasConflict) cell.classList.add('conflict');
  }
}

function isComplete() {
  for (let r = 0; r < currentRules.size; r += 1) {
    for (let c = 0; c < currentRules.size; c += 1) {
      if (puzzle[r][c] === 0 || puzzle[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

function setStatus(text, success = false) {
  statusEl.textContent = text;
  statusEl.style.color = success ? '#16a34a' : 'var(--muted)';
}

function applyCageStyles() {
  const cells = boardEl.querySelectorAll('.cell');
  cells.forEach((cell) => {
    cell.classList.remove('cage-border-top', 'cage-border-bottom', 'cage-border-left', 'cage-border-right', 'cage-label');
    cell.removeAttribute('data-cage-sum');
  });
  if (!currentRules.cages.length) return;
  const size = currentRules.size;
  currentRules.cages.forEach((cage) => {
    const anchor = cage.cells.reduce((best, idx) => {
      if (best === null) return idx;
      const [br, bc] = [Math.floor(best / size), best % size];
      const [r, c] = [Math.floor(idx / size), idx % size];
      if (r < br || (r === br && c < bc)) return idx;
      return best;
    }, null);
    const anchorCell = boardEl.querySelector(`.cell[data-index="${anchor}"]`);
    if (anchorCell) {
      anchorCell.dataset.cageSum = cage.sum;
      anchorCell.classList.add('cage-label');
    }
    cage.cells.forEach((cellIdx) => {
      const row = Math.floor(cellIdx / size);
      const col = cellIdx % size;
      const el = boardEl.querySelector(`.cell[data-index="${cellIdx}"]`);
      if (!el) return;
      const neighbors = {
        top: cage.cells.includes(indexFromRC(row - 1, col, size)),
        bottom: cage.cells.includes(indexFromRC(row + 1, col, size)),
        left: cage.cells.includes(indexFromRC(row, col - 1, size)),
        right: cage.cells.includes(indexFromRC(row, col + 1, size)),
      };
      if (!neighbors.top) el.classList.add('cage-border-top');
      if (!neighbors.bottom) el.classList.add('cage-border-bottom');
      if (!neighbors.left) el.classList.add('cage-border-left');
      if (!neighbors.right) el.classList.add('cage-border-right');
    });
  });
}

function newGame() {
  const variantId = variantEl.value;
  currentVariant = variants.find((v) => v.id === variantId) ?? variants[0];
  const { puzzleBoard, solutionBoard, rules } = generatePuzzleForVariant(currentVariant, difficultyEl.value);
  basePuzzle = deepCopy(puzzleBoard);
  puzzle = deepCopy(puzzleBoard);
  solution = solutionBoard;
  currentRules = rules;
  buildBoard();
  renderBoard();
  selected = null;
  validateConflicts();
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
  for (let r = 0; r < currentRules.size; r += 1) {
    for (let c = 0; c < currentRules.size; c += 1) {
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
  if (e.key >= '0' && e.key <= '9') {
    const value = Number(e.key);
    if (value === 0) {
      handleInput(0);
    } else if (currentRules.symbols.includes(value)) {
      handleInput(value);
    }
  } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ') {
    handleInput(0);
  }
}

function renderPad(symbols) {
  padEl.innerHTML = '';
  symbols.forEach((num) => {
    const btn = document.createElement('button');
    btn.className = 'pad-btn';
    btn.dataset.number = num;
    btn.textContent = num;
    btn.addEventListener('click', () => handleInput(num));
    padEl.appendChild(btn);
  });
  const clearBtn = document.createElement('button');
  clearBtn.className = 'pad-btn secondary';
  clearBtn.dataset.number = 0;
  clearBtn.textContent = '清除';
  clearBtn.addEventListener('click', () => handleInput(0));
  padEl.appendChild(clearBtn);
}

function initVariantOptions() {
  variants.forEach((variant) => {
    const option = document.createElement('option');
    option.value = variant.id;
    option.textContent = variant.name;
    variantEl.appendChild(option);
  });
  variantEl.value = currentVariant.id;
}

function init() {
  ensureFreshAssets();
  initVariantOptions();
  renderPad(currentVariant.symbols);
  document.getElementById('new-game').addEventListener('click', () => {
    renderPad(currentVariant.symbols);
    newGame();
  });
  difficultyEl.addEventListener('change', newGame);
  variantEl.addEventListener('change', () => {
    currentVariant = variants.find((v) => v.id === variantEl.value) ?? variants[0];
    renderPad(currentVariant.symbols);
    newGame();
  });
  document.getElementById('reset').addEventListener('click', () => {
    const confirmReset = window.confirm('确定要重置当前棋盘吗？');
    if (confirmReset) resetBoard();
  });
  document.getElementById('hint').addEventListener('click', giveHint);
  document.getElementById('check').addEventListener('click', checkBoard);
  document.addEventListener('keydown', handleKeyboard);
  const initial = generatePuzzleForVariant(currentVariant, difficultyEl.value);
  basePuzzle = deepCopy(initial.puzzleBoard);
  puzzle = deepCopy(initial.puzzleBoard);
  solution = initial.solutionBoard;
  currentRules = initial.rules;
  buildBoard();
  renderBoard();
  validateConflicts();
}

document.addEventListener('DOMContentLoaded', init);
