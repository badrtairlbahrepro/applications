const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

let currentInput = '0';
let previousInput = null;
let operation = null;
let shouldResetScreen = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendNumber(number) {
  if (currentInput === '0' || shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else {
    if (!(number === '.' && currentInput.includes('.'))) {
      currentInput += number;
    }
  }
}

function chooseOperation(op) {
  if (operation !== null) calculate();
  previousInput = currentInput;
  operation = op;
  shouldResetScreen = true;
}

function calculate() {
  let computation;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  if (isNaN(prev) || isNaN(current)) return;
  switch (operation) {
    case 'add':
      computation = prev + current;
      break;
    case 'subtract':
      computation = prev - current;
      break;
    case 'multiply':
      computation = prev * current;
      break;
    case 'divide':
      if (current === 0) {
        alert('Erreur : division par zéro');
        clear();
        return;
      }
      computation = prev / current;
      break;
    default:
      return;
  }
  currentInput = computation.toString();
  operation = null;
  previousInput = null;
  shouldResetScreen = true;
}

function clear() {
  currentInput = '0';
  previousInput = null;
  operation = null;
  shouldResetScreen = false;
}

function deleteNumber() {
  if (shouldResetScreen) return;
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
}

function percent() {
  let num = parseFloat(currentInput);
  if (!isNaN(num)) {
    num = num / 100;
    currentInput = num.toString();
    shouldResetScreen = true;
  }
}

buttons.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  const btn = e.target;
  if (btn.classList.contains('number')) {
    appendNumber(btn.dataset.value);
    updateDisplay();
  } else if (btn.classList.contains('operator')) {
    chooseOperation(btn.dataset.action);
    updateDisplay();
  } else if (btn.classList.contains('function')) {
    switch (btn.dataset.action) {
      case 'clear':
        clear();
        updateDisplay();
        break;
      case 'del':
        deleteNumber();
        updateDisplay();
        break;
      case 'percent':
        percent();
        updateDisplay();
        break;
    }
  } else if (btn.classList.contains('equals')) {
    calculate();
    updateDisplay();
  }
});

// Keyboard support
window.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
    updateDisplay();
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    const keyMap = {'+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide'};
    chooseOperation(keyMap[e.key]);
    updateDisplay();
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    calculate();
    updateDisplay();
  } else if (e.key === 'Backspace') {
    deleteNumber();
    updateDisplay();
  } else if (e.key === 'Escape') {
    clear();
    updateDisplay();
  }
});

updateDisplay();
