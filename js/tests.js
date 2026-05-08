const button = document.querySelectorAll(".elements");
let passedTests = 0;
let failedTests = 0;

function findButton(label) {
  for (let i = 0; i < button.length; i++) {
    if (button[i].textContent === label) {
      return button[i];
    }
  }
}

function clickButton(label) {
  const targetButton = findButton(label);

  if (!targetButton) {
    console.error(`Button not found: ${label}`);
    return;
  }

  targetButton.click();
}

function clickSequence(sequence) {
  for (let i = 0; i < sequence.length; i++) {
    clickButton(sequence[i]);
  }
}

function getDisplay() {
  return document.querySelector(".display").textContent;
}

function runTest(name, sequence, expected) {
  clickButton("C");

  clickSequence(sequence);

  const actual = getDisplay();

  if (actual === expected) {
    console.log(`✅ PASS: ${name} | actual: ${actual} | expected: ${expected}`);
    passedTests++;
  } else {
    console.error(
      `❌ FAIL: ${name} | actual: ${actual} | expected: ${expected}`,
    );
    failedTests++;
  }
}

// ============================================== //
// TEST SUITE
// ============================================== //

// Basic arithmetic
runTest("5 + 5 =", ["5", "+", "5", "="], "10");

runTest("9 - 4 =", ["9", "-", "4", "="], "5");

runTest("6 x 7 =", ["6", "x", "7", "="], "42");

runTest("8 / 2 =", ["8", "/", "2", "="], "4");

runTest(
  "20 + 40 x 10% =",
  ["2", "0", "+", "4", "0", "x", "1", "0", "%", "="],
  "24",
);

runTest(
  "20 + 40 / 10% =",
  ["2", "0", "+", "4", "0", "/", "1", "0", "%", "="],
  "420",
);

// Operator precedence
runTest("2 + 3 x 4 =", ["2", "+", "3", "x", "4", "="], "14");

runTest("2 x 3 + 4 =", ["2", "x", "3", "+", "4", "="], "10");

runTest("8 / 2 + 6 =", ["8", "/", "2", "+", "6", "="], "10");

runTest("8 + 12 / 4 =", ["8", "+", "1", "2", "/", "4", "="], "11");

// Decimals
runTest("0.5 + 0.5 =", [".", "5", "+", ".", "5", "="], "1");

runTest("5.5 + 4.5 =", ["5", ".", "5", "+", "4", ".", "5", "="], "10");

runTest("5.. ignored", ["5", ".", ".", "5"], "5.5");

runTest("5 + .5 =", ["5", "+", ".", "5", "="], "5.5");

runTest("-.5 + 1 =", ["-", ".", "5", "+", "1", "="], "0.5");

// Leading zero behaviour
runTest("0 ignored at start", ["0"], "0");

runTest("00 ignored at start", ["0", "0"], "0");

runTest("5 + 0 =", ["5", "+", "0", "="], "5");

runTest("5 + 05 =", ["5", "+", "0", "5", "="], "10");

// Clear
runTest("clear after number", ["7", "C"], "0");

runTest("clear after expression", ["5", "+", "5", "C"], "0");

runTest("clear after result", ["5", "+", "5", "=", "C"], "0");

// Toggle normal numbers
runTest("5 +/- =", ["5", "+/-"], "-5");

runTest("5 +/- +/- =", ["5", "+/-", "+/-"], "5");

runTest("5 + 3 +/- =", ["5", "+", "3", "+/-", "="], "2");

runTest("5 - 3 +/- =", ["5", "-", "3", "+/-", "="], "8");

runTest("5 x 3 +/- =", ["5", "x", "3", "+/-", "="], "-15");

runTest("5 / 2 +/- =", ["5", "/", "2", "+/-", "="], "-2.5");

// Equals and repeated equals
runTest("5 + 5 = =", ["5", "+", "5", "=", "="], "15");

runTest("10 - 2 = =", ["1", "0", "-", "2", "=", "="], "6");

runTest("3 x 4 = =", ["3", "x", "4", "=", "="], "48");

runTest("20 / 2 = =", ["2", "0", "/", "2", "=", "="], "5");

runTest("5 + 5 = + 2 =", ["5", "+", "5", "=", "+", "2", "="], "12");

// Standalone percentage
runTest("800% =", ["8", "0", "0", "%", "="], "8");

runTest("800%% =", ["8", "0", "0", "%", "%", "="], "0.08");

runTest("800%%% =", ["8", "0", "0", "%", "%", "%", "="], "0.0008");

// Percentage with addition/subtraction
runTest("1000 + 50% =", ["1", "0", "0", "0", "+", "5", "0", "%", "="], "1500");

runTest("1000 - 50% =", ["1", "0", "0", "0", "-", "5", "0", "%", "="], "500");

runTest(
  "1000 + 50%% =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "%", "="],
  "1005",
);

runTest(
  "1000 - 50%% =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "%", "="],
  "995",
);

runTest(
  "1000 + 50%%% =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "%", "%", "="],
  "1000.05",
);

runTest(
  "1000 - 50%%% =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "%", "%", "="],
  "999.95",
);

runTest("20 + 40% + 5 =", ["2", "0", "+", "4", "0", "%", "+", "5", "="], "33");

// Percentage with multiplication/division
runTest("1000 x 50% =", ["1", "0", "0", "0", "x", "5", "0", "%", "="], "500");

runTest("1000 / 50% =", ["1", "0", "0", "0", "/", "5", "0", "%", "="], "2000");

runTest(
  "1000 x 50%% =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "%", "="],
  "5",
);

runTest(
  "1000 / 50%% =",
  ["1", "0", "0", "0", "/", "5", "0", "%", "%", "="],
  "200000",
);

runTest(
  "1000 x 50%%% =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "%", "%", "="],
  "0.05",
);

runTest(
  "1000 / 50%%% =",
  ["1", "0", "0", "0", "/", "5", "0", "%", "%", "%", "="],
  "20000000",
);

// Percentage + toggle
runTest(
  "1000 + 50% +/- =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "+/-", "="],
  "500",
);

runTest(
  "1000 + 50% +/- +/- =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "+/-", "+/-", "="],
  "1500",
);

runTest(
  "1000 - 50% +/- =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "+/-", "="],
  "1500",
);

runTest(
  "1000 - 50% +/- +/- =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "+/-", "+/-", "="],
  "500",
);

runTest(
  "1000 + 50%% +/- =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "%", "+/-", "="],
  "995",
);

runTest(
  "1000 - 50%% +/- =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "%", "+/-", "="],
  "1005",
);

runTest(
  "1000 x 50% +/- =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "+/-", "="],
  "-500",
);

runTest(
  "1000 x 50% +/- +/- =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "+/-", "+/-", "="],
  "500",
);

runTest(
  "1000 / 50% +/- =",
  ["1", "0", "0", "0", "/", "5", "0", "%", "+/-", "="],
  "-2000",
);

runTest(
  "1000 / 50% +/- +/- =",
  ["1", "0", "0", "0", "/", "5", "0", "%", "+/-", "+/-", "="],
  "2000",
);

// Backspace normal
runTest("123 backspace", ["1", "2", "3", "<"], "12");

runTest("5 + 3 backspace", ["5", "+", "3", "<"], "5+");

runTest("5 + backspace", ["5", "+", "<"], "5");

runTest("result backspace", ["1", "2", "+", "3", "=", "<"], "1");

runTest("negative number backspace", ["5", "+/-", "<"], "0");

runTest("decimal backspace", ["5", ".", "5", "<"], "5.");

// Backspace percentage
runTest(
  "1000 + 50% backspace",
  ["1", "0", "0", "0", "+", "5", "0", "%", "<"],
  "1000+50",
);

runTest(
  "1000 + 50%% backspace =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "%", "<", "="],
  "1500",
);

runTest(
  "1000 + 50%%% backspace =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "%", "%", "<", "="],
  "1005",
);

runTest(
  "1000 x 50%% backspace =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "%", "<", "="],
  "500",
);

runTest(
  "1000 x 50% +/- backspace",
  ["1", "0", "0", "0", "x", "5", "0", "%", "+/-", "<"],
  "1000x(-50)",
);

// Operator after percentage
runTest(
  "1000 + 50% + 10 =",
  ["1", "0", "0", "0", "+", "5", "0", "%", "+", "1", "0", "="],
  "1510",
);

runTest(
  "1000 - 50% + 10 =",
  ["1", "0", "0", "0", "-", "5", "0", "%", "+", "1", "0", "="],
  "510",
);

runTest(
  "1000 x 50% + 10 =",
  ["1", "0", "0", "0", "x", "5", "0", "%", "+", "1", "0", "="],
  "510",
);

// Starting operators
runTest("start with -5 + 10 =", ["-", "5", "+", "1", "0", "="], "5");

runTest("start with + then 5 =", ["+", "5", "="], "5");

runTest("start with x then 5 =", ["x", "5", "="], "0");

runTest("start with / then 5 =", ["/", "5", "="], "0");

// Mixed edge cases
runTest("5 + 5 then new number", ["5", "+", "5", "=", "7"], "7");

runTest("5 + 5 then decimal", ["5", "+", "5", "=", "."], "10.");

runTest("5 + 5 then toggle", ["5", "+", "5", "=", "+/-"], "-10");

runTest("50 x 10% =", ["5", "0", "x", "1", "0", "%", "="], "5");

runTest("50 / 10% =", ["5", "0", "/", "1", "0", "%", "="], "500");

console.log("====================");
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log(`TOTAL: ${passedTests + failedTests}`);
console.log("====================");
