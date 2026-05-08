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
  setupClearDisplay();
  setupDecimalDisplay();
  setupToggleValue();
  setupBackspace();
  setupPercentageCalculate();
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
}

// ============================================== //
// EVENT LISTENERS
// ============================================== //
function setupNumberListener() {
  for (let i = 0; i < elements.numberButtons.length; i++) {
    elements.numberButtons[i].addEventListener("click", function () {
      const clickedDigit = elements.numberButtons[i].textContent;
      const emptyZero = state.currentInput === "" && clickedDigit === "0";
      const zeroAfterOperator =
        state.lastInputType === "operator" && clickedDigit === "0";

      if (emptyZero && !zeroAfterOperator) {
        return;
      }

      actions.appendDigit(clickedDigit);
      actions.displayUI();
    });
  }
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
    const hasValidCurrentNumber =
      state.lastInputType === "number" ||
      (state.lastInputType === "percentage" && state.currentInput !== "-");
    const isRepeatingEquals = state.lastInputType === "equals";
    if (hasValidCurrentNumber) {
      actions.finishCurrentInput();
      actions.saveRepeatMemory();
      actions.calculateAndPrepareResult();
    } else if (isRepeatingEquals) {
      actions.repeatLastOperation();
      state.tokens[0] = state.repeatMemory[0];
      state.finalInput = String(state.repeatMemory[0]);
      state.lastInputType = "equals";
    }

    actions.displayUI();
  });
}

function setupClearDisplay() {
  elements.clearbtn.addEventListener("click", function () {
    actions.resetCalculator();
  });
}

function setupDecimalDisplay() {
  elements.dotbtn.addEventListener("click", function () {
    actions.appendDecimal();
    actions.displayUI();
  });
}

function setupToggleValue() {
  elements.togglebtn.addEventListener("click", function () {
    const isNegative = state.currentInput.startsWith("-");

    if (state.lastInputType === "equals") {
      actions.toggleResult();
      actions.displayUI();
      return;
    } else if (state.currentInput === "") {
      return;
    } else if (!isNegative && state.lastInputType !== "percentage") {
      actions.togglePositiveCurrentInput();
    } else if (state.lastInputType === "percentage") {
      actions.togglePercentage();
    } else {
      actions.toggleNegativeCurrentInput();
    }

    actions.displayUI();
  });
}

function setupBackspace() {
  elements.backspacebtn.addEventListener("click", function () {
    if (state.lastInputType === "equals") {
      actions.backspaceResult();
    } else if (state.lastInputType === "number") {
      const hasParentheses = state.finalInput.endsWith(
        "(" + state.currentInput + ")",
      );
      if (hasParentheses) {
        actions.backspaceParenthesizedCurrentInput();
      } else {
        actions.backspaceNormalCurrentInput();
      }
    } else if (state.lastInputType === "percentage") {
      actions.backspacePercentage();
    } else if (state.lastInputType === "operator") {
      actions.backspaceOperator();
    }

    actions.displayUI();
  });
}

function setupPercentageCalculate() {
  elements.percentbtn.addEventListener("click", function () {
    const isFirstButton =
      state.currentInput === "" || state.currentInput === "-";
    const standAloneNumber =
      state.lastInputType === "number" &&
      state.currentInput === state.finalInput;
    const isExpression =
      state.currentInput !== state.finalInput &&
      state.lastInputType === "number";

    if (isFirstButton) return;

    if (standAloneNumber) {
      actions.calculateStandAlonePercentage();
    } else if (state.lastInputType === "percentage") {
      actions.handlePercentageAfterPercentage();
    } else if (isExpression) {
      actions.addPercentageToExpression();
    }
    actions.displayUI();
  });
}

initCalculator();
