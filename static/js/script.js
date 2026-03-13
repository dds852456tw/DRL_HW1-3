let rows = 5;
let cols = 5;
let start = [0, 0];
let target = [4, 4];
let walls = [];
let mode = 'start'; // start, target, wall

const gridContainer = document.getElementById('gridContainer');
const valueGridContainer = document.getElementById('valueGridContainer');
const solveBtn = document.getElementById('solveBtn');
const gridSizeInput = document.getElementById('gridSize');

function init() {
    renderGrid();

    gridSizeInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value);
        if (val >= 3 && val <= 10) {
            rows = cols = val;
            start = [0, 0];
            target = [rows - 1, cols - 1];
            walls = [];
            renderGrid();
        }
    });

    solveBtn.addEventListener('click', solve);
}

function setMode(newMode) {
    mode = newMode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`set${newMode.charAt(0).toUpperCase() + newMode.slice(1)}Btn`).classList.add('active');
}

function renderGrid(vFunction = null, policy = null) {
    gridContainer.innerHTML = '';
    valueGridContainer.innerHTML = '';

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 60px)`;
    valueGridContainer.style.gridTemplateColumns = `repeat(${cols}, 60px)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Environment Grid
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;

            updateCellClass(cell, r, c);

            if (policy && !isWall(r, c) && !isTarget(r, c)) {
                const arrows = ['↑', '↓', '←', '→'];
                cell.textContent = arrows[policy[r][c]];
                cell.classList.add('policy-arrow');
            } else if (isStart(r, c)) {
                cell.textContent = 'S';
            } else if (isTarget(r, c)) {
                cell.textContent = 'T';
            }

            cell.addEventListener('click', () => handleCellClick(r, c));
            gridContainer.appendChild(cell);

            // Value Grid
            const vCell = document.createElement('div');
            vCell.className = 'cell value-cell';
            if (isWall(r, c)) vCell.classList.add('wall');
            if (vFunction) {
                vCell.textContent = vFunction[r][c].toFixed(2);
            } else {
                vCell.textContent = '0.00';
            }
            valueGridContainer.appendChild(vCell);
        }
    }
}

function updateCellClass(cell, r, c) {
    cell.classList.remove('start', 'target', 'wall');
    if (isStart(r, c)) cell.classList.add('start');
    else if (isTarget(r, c)) cell.classList.add('target');
    else if (isWall(r, c)) cell.classList.add('wall');
}

function isStart(r, c) { return start[0] === r && start[1] === c; }
function isTarget(r, c) { return target[0] === r && target[1] === c; }
function isWall(r, c) { return walls.some(w => w[0] === r && w[1] === c); }

function handleCellClick(r, c) {
    if (mode === 'start') {
        if (isTarget(r, c) || isWall(r, c)) return;
        start = [r, c];
    } else if (mode === 'target') {
        if (isStart(r, c) || isWall(r, c)) return;
        target = [r, c];
    } else if (mode === 'wall') {
        if (isStart(r, c) || isTarget(r, c)) return;
        const index = walls.findIndex(w => w[0] === r && w[1] === c);
        if (index > -1) walls.splice(index, 1);
        else walls.push([r, c]);
    }
    renderGrid();
}

async function solve() {
    solveBtn.disabled = true;
    solveBtn.textContent = 'Computing...';

    const gamma = document.getElementById('gamma').value;

    try {
        const response = await fetch('/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rows, cols, start, target, walls, gamma })
        });
        const data = await response.json();
        renderGrid(data.v_function, data.policy);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to compute policy');
    } finally {
        solveBtn.disabled = false;
        solveBtn.textContent = 'Compute Optimal Policy';
    }
}

init();
