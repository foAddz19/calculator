import readline from 'readline';
import { Calculator } from './calculator.js';
import { History } from './history.js';

export class CLI {
  constructor() {
    this.calculator = new Calculator();
    this.history = new History(50);
    this.isRunning = false;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    this.setupKeyBindings();
  }

  setupKeyBindings() {
    // Handle Ctrl+C gracefully
    this.rl.on('SIGINT', () => {
      console.log('\n\nGoodbye! 👋\n');
      process.exit(0);
    });
  }

  /**
   * Display welcome banner
   */
  displayBanner() {
    console.clear();
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                          ║
║           🧮 ADVANCED CLI CALCULATOR 🧮                 ║
║                                                          ║
║  Type 'help' for available functions & commands        ║
║  Type 'exit' or 'quit' to exit                         ║
║                                                          ║
╚════════════════════════════════════════════════════════╝
`);
  }

  /**
   * Process user input and handle special commands
   */
  processInput(input) {
    input = input.trim().toLowerCase();

    // Handle special commands
    switch (input) {
      case 'help':
        console.log(Calculator.getHelp());
        return;

      case 'clear':
        console.clear();
        return;

      case 'exit':
      case 'quit':
        console.log('\nGoodbye! 👋\n');
        this.isRunning = false;
        this.rl.close();
        process.exit(0);

      case 'history':
        console.log(this.history.getFormattedHistory(20));
        return;

      case 'mode':
        console.log(`\nCurrent angle mode: ${this.calculator.getAngleMode()}\n`);
        return;

      case 'deg':
        this.calculator.setAngleMode('degrees');
        console.log('✓ Switched to degrees mode\n');
        return;

      case 'rad':
        this.calculator.setAngleMode('radians');
        console.log('✓ Switched to radians mode\n');
        return;

      case 'memory':
        console.log(`\n${this.history.getMemoryStatus()}\n`);
        return;

      case 'mc':
        this.history.clearMemory();
        console.log('✓ Memory cleared\n');
        return;

      case 'mr':
        const memValue = this.history.recallMemory();
        console.log(`\nMemory Recall: ${memValue}\n`);
        return;

      case 'm+':
        this.history.addToMemory(this.calculator.getLastResult());
        console.log(`✓ Added to memory: M = ${this.history.recallMemory()}\n`);
        return;

      case 'm-':
        this.history.subtractFromMemory(this.calculator.getLastResult());
        console.log(`✓ Subtracted from memory: M = ${this.history.recallMemory()}\n`);
        return;

      default:
        // If not a command, try to evaluate as expression
        if (input.length > 0 && !input.startsWith('/')) {
          this.evaluateExpression(input);
        }
    }
  }

  /**
   * Evaluate a mathematical expression
   */
  evaluateExpression(expression) {
    const result = this.calculator.evaluate(expression);

    if (result.error) {
      console.log(`\n❌ ${result.error}\n`);
    } else {
      // Format result nicely
      let displayResult = result.result;
      if (typeof displayResult === 'number' && !Number.isInteger(displayResult)) {
        displayResult = displayResult.toFixed(10).replace(/\.?0+$/, '');
      }

      console.log(`\n✓ Result: ${displayResult}`);
      console.log(`   ${this.history.getMemoryStatus()}\n`);

      // Add to history
      this.history.addEntry(result.expression, result.result);
    }
  }

  /**
   * Prompt user for input
   */
  promptUser() {
    const prompt = `[${this.calculator.getAngleMode().charAt(0).toUpperCase()}] > `;
    this.rl.question(prompt, (input) => {
      this.processInput(input);

      if (this.isRunning) {
        this.promptUser();
      }
    });
  }

  /**
   * Start the interactive calculator
   */
  start() {
    this.isRunning = true;
    this.displayBanner();
    this.promptUser();
  }
}
