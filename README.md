# iPhone-Style Calculator

iPhone-style calculator built with vanilla JavaScript, HTML, and CSS.  
The project focuses on calculator state management, operator precedence, percentage behaviour, repeated equals, sign toggling, backspace handling, and modular JavaScript structure.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, and division
- Operator precedence support
- Decimal input handling
- Clear/reset functionality
- Backspace support across numbers, operators, results, and percentages
- Positive/negative toggle
- Repeated equals behaviour
- Percentage calculations
- Repeated percentage handling
- Percentage with toggle and backspace support
- Modular JavaScript file structure
- Browser-based regression test suite with 82 passing tests

## Tech Stack

- HTML
- CSS
- JavaScript
- Git/GitHub

## Project Structure

```text
.
├── index.html
├── style.css
├── js/
│   ├── script.js
│   ├── actions.js
│   ├── state.js
│   ├── dom.js
│   ├── evaluator.js
│   ├── debug.js
│   └── tests.js
└── README.md
```

## File Responsibilities

```text
script.js    → initializes the calculator and attaches event listeners
actions.js   → handles calculator behaviour and state transitions
state.js     → stores shared calculator state
dom.js       → stores DOM element references
evaluator.js → handles arithmetic evaluation helpers
debug.js     → optional debugging utilities
tests.js     → browser-based regression tests
```

## Testing

The project includes a browser-based regression test suite in:

```text
js/tests.js
```

The test suite simulates real button clicks and checks the calculator display against expected results.

Current result:

```text
82 passed / 82 total
```

To run tests, temporarily enable this script in `index.html`:

```html
<script type="module" src="./js/tests.js"></script>
```

For normal app usage, keep it commented out:

```html
<!-- <script type="module" src="./js/tests.js"></script> -->
```

## Key Learning

This project helped me practise:

- DOM event handling
- JavaScript state management
- Modular JavaScript using ES modules
- Debugging complex state transitions
- Implementing custom percentage logic
- Refactoring without breaking existing behaviour
- Creating a simple automated regression test suite

## Current Scope

This calculator is designed as a basic iPhone-style calculator clone.  
It does not currently include scientific calculator features such as trigonometry, logarithms, manual parentheses, or advanced expression parsing.

## Future Improvements

- Add keyboard support
- Add division-by-zero error handling
- Improve long number formatting
- Add more edge-case tests
- Improve mobile responsiveness further
- Add optional top status bar icons for a more complete iPhone-style design

## Author

Built by Timur Bagirov.
