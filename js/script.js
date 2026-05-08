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

// ============================================== //
// ADDS CLICK SOUND
// ============================================== //

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
    const isPressed =
      key === "+" ||
      key === "-" ||
      key === "*" ||
      key === "/" ||
      key === "Enter" ||
      key === "=" ||
      key === "Escape" ||
      key === "n" ||
      key === "F9" ||
      key === "." ||
      key === "Backspace" ||
      key === "%" ||
      (key >= "0" && key <= "9");

    if (isPressed) {
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
    const isOperatorKey =
      key === "+" || key === "-" || key === "*" || key === "/";
    const isEqual = key === "Enter" || key === "=";
    const isClear = key === "Escape";
    const isToggle = key === "n" || key === "F9";
    const isDecimal = key === ".";
    const isBackspace = key === "Backspace";
    const isPercentage = key === "%";

    if (key >= "0" && key <= "9") {
      const canInputNumber = actions.handleNumberInput(key);

      if (!canInputNumber) {
        return;
      }

      actions.appendDigit(key);
      actions.displayUI();
      return;
    } else if (isOperatorKey) {
      let operator = key;
      if (operator === "*") {
        operator = "x";
      }

      actions.handleOperatorInput(operator);
      actions.displayUI();
      return;
    } else if (isEqual) {
      actions.handleEqualsInput();
      return;
    } else if (isClear) {
      actions.resetCalculator();
      return;
    } else if (isToggle) {
      actions.handleToggleInput();
      return;
    } else if (isDecimal) {
      actions.appendDecimal();
      actions.displayUI();
      return;
    } else if (isBackspace) {
      event.preventDefault();
      actions.handleBackspaceInput();
      return;
    } else if (isPercentage) {
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
