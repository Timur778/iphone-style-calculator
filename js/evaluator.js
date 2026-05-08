export function formatNumber(value) {
  return String(Number(Number(value).toPrecision(12)));
}

// Multiplication && Division (Higher precedence)
export function muldiv(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === "x") {
      array.splice(i - 1, 3, array[i - 1] * array[i + 1]);
      i--;
    } else if (array[i] === "/") {
      array.splice(i - 1, 3, array[i - 1] / array[i + 1]);
      i--;
    }
  }
}

// Addition && Subtraction (Lower precedence)
export function addsub(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === "+") {
      array.splice(i - 1, 3, array[i - 1] + array[i + 1]);
      i--;
    } else if (array[i] === "-") {
      array.splice(i - 1, 3, array[i - 1] - array[i + 1]);
      i--;
    }
  }
}

export function applyOperator(left, operator, right) {
  if (operator === "x") {
    return left * right;
  } else if (operator === "/") {
    return left / right;
  } else if (operator === "+") {
    return left + right;
  } else if (operator === "-") {
    return left - right;
  }
}

export function isOperator(value) {
  return value === "+" || value === "-" || value === "x" || value === "/";
}
