import { state } from "./state.js";
import { elements } from "./dom.js";
import * as actions from "./actions.js";

// ============================================== //
// INITIALIZATION
// ============================================== //

function initCalculator() {
  setupNumberListener();
  setupOperatorListener();
  setupEqualsListener();
  setupClearListener();
  setupDecimalListener();
  setupToggleListener();
  setupBackspaceListener();
  setupPercentageListener();
  setupKeyboardListener();
  playClickSound();
}

function isCalculatorKey(key) {
  return (
    isNumberKey(key) ||
    isOperatorKey(key) ||
    isEqualKey(key) ||
    isClearKey(key) ||
    isToggleKey(key) ||
    isDecimalKey(key) ||
    isBackspaceKey(key) ||
    isPercentageKey(key)
  );
}

function getOperatorFromKey(key) {
  if (key === "*") return "x";
  return key;
}

function isNumberKey(key) {
  return key >= "0" && key <= "9";
}

function isOperatorKey(key) {
  return key === "+" || key === "-" || key === "*" || key === "/";
}

function isEqualKey(key) {
  return key === "Enter" || key === "=";
}

function isClearKey(key) {
  return key === "Escape";
}

function isToggleKey(key) {
  return key === "n" || key === "F9";
}

function isDecimalKey(key) {
  return key === ".";
}

function isBackspaceKey(key) {
  return key === "Backspace";
}

function isPercentageKey(key) {
  return key === "%";
}

// ============================================== //
// INPUT FEEDBACK HELPERS
// ============================================== //
function getButtonLabelFromKey(key) {
  if (key === "Enter") return "=";
  if (key === "*") return "x";
  if (key === "Escape") return "C";
  if (key === "Backspace") return "<";
  if (key === "n" || key === "F9") return "+/-";

  return key;
}

function findButtonByKeyboardKey(key) {
  const label = getButtonLabelFromKey(key);
  for (let i = 0; i < elements.buttons.length; i++) {
    if (elements.buttons[i].textContent === label) {
      return elements.buttons[i];
    }
  }
}

function showKeyboardPressEffect(key) {
  const matchingButton = findButtonByKeyboardKey(key);

  if (!matchingButton) return;

  matchingButton.classList.add("keyboard-active");

  setTimeout(function () {
    matchingButton.classList.remove("keyboard-active");
  }, 120);
}

function playClickSound() {
  const clickSound = new Audio("click.mp3");
  clickSound.volume = 0.2;

  for (let i = 0; i < elements.buttons.length; i++) {
    elements.buttons[i].addEventListener("click", function () {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  }

  document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (isCalculatorKey(key)) {
      clickSound.currentTime = 0;
      clickSound.play();
      return;
    }
  });
}

// ============================================== //
// EVENT LISTENERS
// ============================================== //

function setupNumberListener() {
  for (let i = 0; i < elements.numberButtons.length; i++) {
    elements.numberButtons[i].addEventListener("click", function () {
      const clickedDigit = elements.numberButtons[i].textContent;
      const canInputNumber = actions.handleNumberInput(clickedDigit);

      if (!canInputNumber) return;

      actions.appendDigit(clickedDigit);
      actions.displayUI();
    });
  }
}

function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    const key = event.key;
    if (key === " ") {
      event.preventDefault();
      return;
    }
    if (!isCalculatorKey(key)) {
      return;
    }

    showKeyboardPressEffect(key);

    if (isNumberKey(key)) {
      const canInputNumber = actions.handleNumberInput(key);

      if (!canInputNumber) {
        return;
      }

      actions.appendDigit(key);
      actions.displayUI();
      return;
    } else if (isOperatorKey(key)) {
      const operator = getOperatorFromKey(key);

      actions.handleOperatorInput(operator);
      actions.displayUI();
      return;
    } else if (isEqualKey(key)) {
      actions.handleEqualsInput();
      return;
    } else if (isClearKey(key)) {
      actions.resetCalculator();
      return;
    } else if (isToggleKey(key)) {
      actions.handleToggleInput();
      return;
    } else if (isDecimalKey(key)) {
      actions.appendDecimal();
      actions.displayUI();
      return;
    } else if (isBackspaceKey(key)) {
      event.preventDefault();
      actions.handleBackspaceInput();
      return;
    } else if (isPercentageKey(key)) {
      actions.handlePercentageInput();
      return;
    }
  });
}

function setupOperatorListener() {
  for (let i = 0; i < elements.operation.length; i++) {
    elements.operation[i].addEventListener("click", function () {
      const clickedOperator = elements.operation[i].textContent;
      actions.handleOperatorInput(clickedOperator);
      actions.displayUI();
    });
  }
}

function setupEqualsListener() {
  elements.equals.addEventListener("click", function () {
    actions.handleEqualsInput();
  });
}

function setupClearListener() {
  elements.clearbtn.addEventListener("click", function () {
    actions.resetCalculator();
  });
}

function setupDecimalListener() {
  elements.dotbtn.addEventListener("click", function () {
    actions.appendDecimal();
    actions.displayUI();
  });
}

function setupToggleListener() {
  elements.togglebtn.addEventListener("click", function () {
    actions.handleToggleInput();
  });
}

function setupBackspaceListener() {
  elements.backspacebtn.addEventListener("click", function () {
    actions.handleBackspaceInput();
  });
}

function setupPercentageListener() {
  elements.percentbtn.addEventListener("click", function () {
    actions.handlePercentageInput();
  });
}

initCalculator();
