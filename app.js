let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

const currentEl = document.getElementById('current');
const historyEl = document.getElementById('history');
const symbols = { '/': '÷', '*': '×', '-': '−', '+': '+' };

function update() {
  currentEl.textContent = current;
  historyEl.textContent = previous !== null && operator
    ? `${previous} ${symbols[operator]}` : '';
}

function inputNumber(n) {
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (n === '.' && current.includes('.')) return;
  current = current === '0' && n !== '.' ? n : current + n;
  update();
}

function compute(a, b, op) {
  a = parseFloat(a); b = parseFloat(b);
  let r;
  if (op === '+') r = a + b;
  if (op === '-') r = a - b;
  if (op === '*') r = a * b;
  if (op === '/') r = b === 0 ? 'Error' : a / b;
  return r === 'Error' ? r : String(parseFloat(r.toFixed(10)));
}

function chooseOperator(op) {
  if (current === 'Error') return;
  if (previous !== null && operator && !justEvaluated) {
    current = compute(previous, current, operator);
  }
  previous = current;
  operator = op;
  justEvaluated = false;
  current = '0';
  historyEl.textContent = `${previous} ${symbols[op]}`;
  currentEl.textContent = previous;
}

function equals() {
  if (previous === null || !operator) return;
  const expr = `${previous} ${symbols[operator]} ${current} =`;
  current = compute(previous, current, operator);
  previous = null;
  operator = null;
  justEvaluated = true;
  currentEl.textContent = current;
  historyEl.textContent = expr;
}

function clearAll() { current = '0'; previous = null; operator = null; justEvaluated = false; update(); }
function del() {
  if (justEvaluated || current === 'Error') return clearAll();
  current = current.length > 1 ? current.slice(0, -1) : '0';
  update();
}
function percent() {
  if (current === 'Error') return;
  current = String(parseFloat(current) / 100);
  update();
}

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
    else if (btn.dataset.op) chooseOperator(btn.dataset.op);
    else if (btn.dataset.action === 'equals') equals();
    else if (btn.dataset.action === 'clear') clearAll();
    else if (btn.dataset.action === 'delete') del();
    else if (btn.dataset.action === 'percent') percent();
  });
});

document.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') inputNumber(e.key);
  else if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
  else if (e.key === 'Backspace') del();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === '%') percent();
});

update();
