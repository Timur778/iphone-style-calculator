import { state } from "./state.js";
import { elements } from "./dom.js";
import {
  formatNumber,
  muldiv,
  addsub,
  applyOperator,
  isOperator,
} from "./evaluator.js";

export function displayUI() {
  elements.display.textContent = state.finalInput || "0";
}

function finishCurrentInput() {
  state.tokens.push(Number(state.currentInput));
  state.currentInput = "";
  state.lastInputType = "equals";
}

function saveRepeatMemory() {
  state.repeatMemory = [];
  state.repeatMemory.push(state.tokens.at(-2));
  state.repeatMemory.push(state.tokens.at(-1));
}

function calculateAndPrepareResult() {
  muldiv(state.tokens);
  addsub(state.tokens);
  state.repeatMemory.unshift(state.tokens[0]);
  state.finalInput = String(state.tokens[0]);
}

export function resetCalculator() {
  state.currentInput = "";
  state.finalInput = "";
  state.lastInputType = "";
  state.tokens.length = 0;
  state.repeatMemory = [];

  clearPercentageMemory();
  displayUI();
}

function repeatLastOperation() {
  const left = state.repeatMemory[0];
  const operator = state.repeatMemory[1];
  const right = state.repeatMemory[2];

  const result = applyOperator(left, operator, right);
  state.repeatMemory[0] = result;
}

function toggleResult() {
  state.tokens[0] = -state.tokens[0];
  state.repeatMemory[0] = state.tokens[0];
  state.finalInput = String(state.tokens[0]);
}

function togglePositiveCurrentInput() {
  const oldInput = state.currentInput;
  const prevOperator = state.tokens.at(-1);
  const needsParentheses = prevOperator === "x" || prevOperator === "/";

  state.currentInput = "-" + state.currentInput;

  if (needsParentheses) {
    state.finalInput =
      state.finalInput.slice(0, -oldInput.length) + `(${state.currentInput})`;
  } else if (prevOperator === "+") {
    state.finalInput =
      state.finalInput.slice(0, -(oldInput.length + 1)) + state.currentInput;
  } else if (prevOperator === "-") {
    state.finalInput =
      state.finalInput.slice(0, -(oldInput.length + 1)) +
      "+" +
      state.currentInput.slice(1);
  } else {
    state.finalInput =
      state.finalInput.slice(0, -oldInput.length) + state.currentInput;
  }
}

function toggleNegativeCurrentInput() {
  const oldInput = state.currentInput;
  const positiveValue = state.currentInput.slice(1);

  if (state.finalInput.endsWith(`(${state.currentInput})`)) {
    state.finalInput =
      state.finalInput.slice(0, -(oldInput.length + 2)) + positiveValue;
  } else if (state.finalInput.length === state.currentInput.length) {
    state.finalInput =
      state.finalInput.slice(0, -oldInput.length) + positiveValue;
  } else if (state.tokens.at(-1) === "-") {
    state.finalInput =
      state.finalInput.slice(0, -oldInput.length) + "-" + positiveValue;
  } else {
    state.finalInput =
      state.finalInput.slice(0, -oldInput.length) + "+" + positiveValue;
  }

  state.currentInput = state.currentInput.slice(1);
}

function backspaceResult() {
  const text = String(state.tokens[0]);
  const resultText = text.slice(0, -1);

  if (resultText === "" || resultText === "-") {
    resetCalculator();
    return;
  }

  state.currentInput = resultText;
  state.finalInput = resultText;
  state.tokens.length = 0;
  state.repeatMemory = [];
  state.lastInputType = "number";
}

function backspaceNormalCurrentInput() {
  const oldInput = state.currentInput;
  const resultText = state.currentInput.slice(0, -1);
  const valid = resultText !== "" && resultText !== "-";
  const isEqual = state.currentInput === state.finalInput;
  const removedCurrentNumber =
    resultText === "" && oldInput !== state.finalInput;

  if (!valid && isEqual) {
    resetCalculator();
    return;
  } else if (removedCurrentNumber) {
    state.lastInputType = "operator";
    state.currentInput = "";
    state.finalInput = state.finalInput.slice(0, -oldInput.length);
  } else {
    state.currentInput = resultText;
    state.finalInput = state.finalInput.slice(0, -oldInput.length) + resultText;
    state.lastInputType = "number";
  }
}

function clearPercentageMemory() {
  state.percentageMemory.originalInput = "";
  state.percentageMemory.calculatedInput = "";
  state.percentageMemory.visibleInput = "";
  state.percentageMemory.results = [];
}

function removeLastCharacter() {
  state.finalInput = state.finalInput.slice(0, -1);
  state.percentageMemory.visibleInput =
    state.percentageMemory.visibleInput.slice(0, -1);
}

function updateCurrentInput() {
  const lastOperator = state.tokens.at(-1);

  if (lastOperator === "+" && state.currentInput.startsWith("-")) {
    state.currentInput = "-" + state.percentageMemory.results.at(-1);
  } else if (lastOperator === "-" && state.currentInput.startsWith("-")) {
    state.currentInput = state.percentageMemory.results.at(-1);
  } else {
    state.currentInput = state.percentageMemory.results.at(-1);
  }
}

function checkVisibleInput() {
  return (
    state.percentageMemory.visibleInput.startsWith("(") &&
    state.percentageMemory.visibleInput.endsWith(")") &&
    state.percentageMemory.visibleInput !== "(-)"
  );
}

function backspacePercentage() {
  const prevElement = state.finalInput.slice(-2, -1); //find out whether second last element is % or number (e.g. 800 + 50%%%)
  const lastOperator = state.tokens.at(-1);
  const negativeVisibleInput = state.percentageMemory.visibleInput === "(-)";

  // e.g. 800 + 200 - 50%%%
  if (state.finalInput.endsWith("%") && prevElement === "%") {
    removeLastCharacter();
    state.lastInputType = "percentage";
    state.percentageMemory.results.pop();
    updateCurrentInput();
  } else if (checkVisibleInput()) {
    state.percentageMemory.visibleInput =
      state.percentageMemory.visibleInput.slice(0, -2) + ")";
    state.finalInput = state.finalInput.slice(0, -2) + ")";
    state.percentageMemory.results.pop();

    const checkLastOperator = lastOperator === "x" || lastOperator === "/";
    const noPercentage = !state.percentageMemory.visibleInput.includes("%");

    if (checkLastOperator && noPercentage) {
      const withoutParentheses = state.percentageMemory.visibleInput.slice(
        1,
        -1,
      );
      if (withoutParentheses.startsWith("-")) {
        state.currentInput = "-" + state.percentageMemory.originalInput;
        state.lastInputType = "number";
      }
    } else {
      state.currentInput = "-" + state.percentageMemory.results.at(-1);
    }
  } else if (negativeVisibleInput) {
    state.finalInput = state.finalInput.slice(
      0,
      -state.percentageMemory.visibleInput.length,
    );
    state.currentInput = "";
    state.lastInputType = "operator";
    clearPercentageMemory();
  } else {
    removeLastCharacter();
    state.lastInputType = "number";
    state.currentInput = state.percentageMemory.originalInput;
    clearPercentageMemory();
  }
}

function backspaceParenthesizedCurrentInput() {
  const visibleInput = "(" + state.currentInput + ")";
  const resultText = state.currentInput.slice(0, -1);

  if (resultText === "" || resultText === "-") {
    state.currentInput = "";
    state.finalInput = state.finalInput.slice(0, -visibleInput.length);
    state.lastInputType = "operator";
  } else {
    state.currentInput = resultText;
    state.finalInput =
      state.finalInput.slice(0, -visibleInput.length) + "(" + resultText + ")";
  }
}

function backspaceOperator() {
  if (state.tokens.length >= 2) {
    state.tokens.pop();
    state.currentInput = String(state.tokens.pop());
    state.finalInput = state.finalInput.slice(0, -1);
    state.lastInputType = "number";
  } else {
    resetCalculator();
  }
}

export function appendDigit(clickedDigit) {
  if (state.lastInputType === "equals") {
    state.currentInput = clickedDigit;
    state.finalInput = clickedDigit;
    state.lastInputType = "number";
    state.tokens.length = 0;
    state.repeatMemory = [];
  } else {
    state.currentInput += clickedDigit;
    state.finalInput += clickedDigit;
    state.lastInputType = "number";
  }
}

export function handleOperatorInput(clickedOperator) {
  const canAddOperatorAfterNumber =
    state.lastInputType === "number" ||
    (state.lastInputType === "percentage" && state.currentInput !== "-");
  const canContinueFromResult = state.lastInputType === "equals";
  const isStartingWithOperator = state.lastInputType === "";
  if (isStartingWithOperator && clickedOperator === "-") {
    state.currentInput = clickedOperator;
    state.finalInput = clickedOperator;
    state.lastInputType = "number";
  } else if (canAddOperatorAfterNumber) {
    state.tokens.push(Number(state.currentInput), clickedOperator);
    state.currentInput = "";
    state.lastInputType = "operator";
    state.finalInput += clickedOperator;
  } else if (canContinueFromResult) {
    state.tokens.push(clickedOperator);
    state.currentInput = "";
    state.lastInputType = "operator";
    state.finalInput += clickedOperator;
    state.repeatMemory = [];
  } else if (isStartingWithOperator) {
    state.tokens.push(0, clickedOperator);
    state.lastInputType = "operator";
    state.finalInput = "0" + clickedOperator;
  }
}

export function appendDecimal() {
  if (state.lastInputType === "equals") {
    if (String(state.tokens[0]).includes(".")) {
      return;
    } else {
      state.currentInput = String(state.tokens[0]) + ".";
      state.finalInput = String(state.tokens[0]) + ".";
      state.tokens.length = 0;
      state.repeatMemory = [];
    }
  } else if (state.currentInput === "") {
    state.currentInput = "0.";
    state.finalInput += "0.";
  } else if (state.currentInput === "-") {
    state.currentInput = "-0.";
    state.finalInput += "0.";
  } else if (state.currentInput.includes(".")) {
    return;
  } else {
    state.currentInput += ".";
    state.finalInput += ".";
  }

  state.lastInputType = "number";
}

function togglePercentageAfterPlus() {
  const isNegative = state.currentInput.startsWith("-");

  if (!isNegative) {
    state.finalInput =
      state.finalInput.slice(
        0,
        -(state.percentageMemory.visibleInput.length + 1),
      ) +
      "-" +
      state.percentageMemory.visibleInput;

    state.percentageMemory.visibleInput =
      "-" + state.percentageMemory.visibleInput;
    state.currentInput = "-" + state.currentInput;
  } else {
    state.finalInput =
      state.finalInput.slice(0, -state.percentageMemory.visibleInput.length) +
      "+" +
      state.percentageMemory.visibleInput.slice(1);

    state.percentageMemory.visibleInput =
      state.percentageMemory.visibleInput.slice(1);
    state.currentInput = state.currentInput.slice(1);
  }
}

function togglePercentageAfterMinus() {
  const isNegative = state.currentInput.startsWith("-");

  if (!isNegative) {
    state.finalInput =
      state.finalInput.slice(
        0,
        -(state.percentageMemory.visibleInput.length + 1),
      ) +
      "+" +
      state.percentageMemory.visibleInput;

    state.currentInput = "-" + state.currentInput;
  } else {
    state.finalInput =
      state.finalInput.slice(
        0,
        -(state.percentageMemory.visibleInput.length + 1),
      ) +
      "-" +
      state.percentageMemory.visibleInput;

    state.currentInput = state.currentInput.slice(1);
  }
}

function untoggleParenthesizedPercentage() {
  state.percentageMemory.visibleInput =
    state.percentageMemory.visibleInput.slice(2, -1);
  state.finalInput =
    state.finalInput.slice(
      0,
      -(state.percentageMemory.visibleInput.length + 3),
    ) + state.percentageMemory.visibleInput;
  state.currentInput = state.currentInput.slice(1);
}

function togglePercentageAfterMulDiv() {
  const isNegative = state.currentInput.startsWith("-");

  if (!isNegative) {
    state.finalInput =
      state.finalInput.slice(0, -state.percentageMemory.visibleInput.length) +
      `(-${state.percentageMemory.visibleInput})`;
    state.currentInput = "-" + state.currentInput;
    state.percentageMemory.visibleInput =
      "(-" + state.percentageMemory.visibleInput + ")";
  } else {
    untoggleParenthesizedPercentage();
  }
}

function togglePercentage() {
  const lastOperator = state.tokens.at(-1);

  if (lastOperator === "x" || lastOperator === "/") {
    togglePercentageAfterMulDiv();
  } else if (lastOperator === "+") {
    togglePercentageAfterPlus();
  } else if (lastOperator === "-") {
    togglePercentageAfterMinus();
  }
}

function calculateStandAlonePercentage() {
  const result = formatNumber(Number(state.currentInput) / 100);
  state.currentInput = result;
  state.finalInput = result;
  state.lastInputType = "percentage";
}

function savePercentageResult() {
  state.percentageMemory.calculatedInput = state.currentInput;
  state.percentageMemory.results.push(state.percentageMemory.calculatedInput);
}

function handleRepeatedPercentage() {
  state.finalInput += "%";
  state.percentageMemory.visibleInput += "%";

  state.currentInput = formatNumber(Number(state.currentInput) / 100);

  savePercentageResult();
}

function handlePercentageAfterPercentage() {
  const lastOperator = state.tokens.at(-1);

  if (isOperator(lastOperator)) {
    handleRepeatedPercentage();
  } else {
    const result = formatNumber(Number(state.currentInput) / 100);
    state.currentInput = result;
    state.finalInput = result;
    state.lastInputType = "percentage";
  }
}

function addPercentageToExpression() {
  state.percentageMemory.originalInput = state.currentInput;
  state.percentageMemory.visibleInput = state.currentInput + "%";
  state.finalInput += "%";

  const lastOperator = state.tokens.at(-1);

  const workingTokens = [...state.tokens];

  if (lastOperator === "+" || lastOperator === "-") {
    workingTokens.pop();
    muldiv(workingTokens);
    addsub(workingTokens);

    const result = workingTokens[0];
    const calculatePercentage = result * (Number(state.currentInput) / 100);

    state.currentInput = formatNumber(calculatePercentage);
    savePercentageResult();
  } else if (lastOperator === "x" || lastOperator === "/") {
    state.currentInput = formatNumber(Number(state.currentInput) / 100);
    savePercentageResult();
  }

  state.lastInputType = "percentage";
}

export function handleNumberInput(clickedDigit) {
  const emptyZero = state.currentInput === "" && clickedDigit === "0";
  const zeroAfterOperator =
    state.lastInputType === "operator" && clickedDigit === "0";

  if (emptyZero && !zeroAfterOperator) {
    return false;
  }

  return true;
}

export function handleEqualsInput() {
  const hasValidCurrentNumber =
    state.lastInputType === "number" ||
    (state.lastInputType === "percentage" && state.currentInput !== "-");
  const isRepeatingEquals = state.lastInputType === "equals";
  if (hasValidCurrentNumber) {
    finishCurrentInput();
    saveRepeatMemory();
    calculateAndPrepareResult();
  } else if (isRepeatingEquals) {
    repeatLastOperation();
    state.tokens[0] = state.repeatMemory[0];
    state.finalInput = String(state.repeatMemory[0]);
    state.lastInputType = "equals";
  }

  displayUI();
}

export function handleToggleInput() {
  const isNegative = state.currentInput.startsWith("-");

  if (state.lastInputType === "equals") {
    toggleResult();
    displayUI();
    return;
  } else if (state.currentInput === "") {
    return;
  } else if (!isNegative && state.lastInputType !== "percentage") {
    togglePositiveCurrentInput();
  } else if (state.lastInputType === "percentage") {
    togglePercentage();
  } else {
    toggleNegativeCurrentInput();
  }

  displayUI();
}

export function handlePercentageInput() {
  const isFirstButton = state.currentInput === "" || state.currentInput === "-";
  const standAloneNumber =
    state.lastInputType === "number" && state.currentInput === state.finalInput;
  const isExpression =
    state.currentInput !== state.finalInput && state.lastInputType === "number";

  if (isFirstButton) return;

  if (standAloneNumber) {
    calculateStandAlonePercentage();
  } else if (state.lastInputType === "percentage") {
    handlePercentageAfterPercentage();
  } else if (isExpression) {
    addPercentageToExpression();
  }
  displayUI();
}

export function handleBackspaceInput() {
  if (state.lastInputType === "equals") {
    backspaceResult();
  } else if (state.lastInputType === "number") {
    const hasParentheses = state.finalInput.endsWith(
      "(" + state.currentInput + ")",
    );
    if (hasParentheses) {
      backspaceParenthesizedCurrentInput();
    } else {
      backspaceNormalCurrentInput();
    }
  } else if (state.lastInputType === "percentage") {
    backspacePercentage();
  } else if (state.lastInputType === "operator") {
    backspaceOperator();
  }

  displayUI();
}
