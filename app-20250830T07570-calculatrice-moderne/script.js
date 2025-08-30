const display = document.getElementById('display');
let currentInput = '';
let lastInput = '';
let resultDisplayed = false;

function updateDisplay() {
  display.textContent = currentInput || '0';
}

function clearAll() {
  currentInput = '';
  lastInput = '';
  resultDisplayed = false;
  updateDisplay();
}

function deleteLast() {
  if (resultDisplayed) {
    clearAll();
    return;
  }
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = num;
    resultDisplayed = false;
  } else {
    if (num === ',' && currentInput.slice(-1) === ',') {
      return; // Disallow multiple decimals in a row
    }
    // Replace ',' with '.' for calculations
    const lastChar = currentInput.slice(-1);
    if (num === ',' && currentInput === '') {
      currentInput = '0,';
    } else {
      currentInput += num;
    }
  }
  updateDisplay();
}

function appendOperator(operator) {
  if (currentInput === '') {
    if (operator === '-') {
      currentInput = operator; // Allow negative number start
      updateDisplay();
    }
    return;
  }
  const lastChar = currentInput.slice(-1);
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    currentInput = currentInput.slice(0, -1) + operator; // Replace operator
  } else {
    currentInput += operator;
  }
  resultDisplayed = false;
  updateDisplay();
}

function calculate() {
  if (currentInput === '') return;
  // Replace ',' by '.' for JS evaluation
  let expression = currentInput.replace(/,/g, '.');

  // To prevent dangerous eval injections, allow only numbers and operators
  if (!/^[0-9.+\-*/()%\s]+$/.test(expression)) {
    display.textContent = 'Erreur';
    currentInput = '';
    return;
  }

  try {
    let evalResult = Function('return ' + expression)();
    if (evalResult === Infinity || evalResult === -Infinity) {
      throw new Error('Division par zéro');
    }
    if (typeof evalResult === 'number') {
      if (!Number.isInteger(evalResult)) {
        evalResult = evalResult.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
      }
      currentInput = evalResult.toString().replace('.', ',');
      resultDisplayed = true;
      updateDisplay();
    } else {
      throw new Error('Résultat invalide');
    }
  } catch (error) {
    display.textContent = 'Erreur';
    currentInput = '';
  }
}

function handleKeyDown(event) {
  const { key } = event;
  if (//.test(key)) return; // Ignore delete key
  if ((//.test(key) || key === '=')) { // Enter key or = key
    event.preventDefault();
    calculate();
    return;
  }
  if (//.test(key)) { // Backspace
    event.preventDefault();
    deleteLast();
    return;
  }
  if (//.test(key)) { // Delete
    event.preventDefault();
    clearAll();
    return;
  }
  if ('0123456789'.includes(key)) {
    appendNumber(key);
  } else if (key === ',') {
    appendNumber(',');
  } else if ('+-/*%'.includes(key)) {
    appendOperator(key);
  }
}

document.querySelector('.calculator__keys').addEventListener('click', (event) => {
  const target = event.target;
  if (!target.matches('button.key')) return;

  const action = target.getAttribute('data-action');
  if (action === 'number') {
    const value = target.getAttribute('data-value');
    appendNumber(value);
  } else if (action === 'operator') {
    const value = target.getAttribute('data-value');
    appendOperator(value);
  } else if (action === 'clear') {
    clearAll();
  } else if (action === 'delete') {
    deleteLast();
  } else if (action === 'decimal') {
    appendNumber(',');
  } else if (action === 'calculate') {
    calculate();
  }
});

document.addEventListener('keydown', handleKeyDown);

clearAll();
