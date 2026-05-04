export class Calculator {
  constructor() {
    this.angleMode = 'degrees'; // 'degrees' or 'radians'
    this.lastResult = 0;
    this.pi = Math.PI;
    this.e = Math.E;
  }

  /**
   * Convert degrees to radians
   */
  toRad(deg) {
    return deg * Math.PI / 180;
  }

  /**
   * Convert radians to degrees
   */
  toDeg(rad) {
    return rad * 180 / Math.PI;
  }

  /**
   * Create a safe math context with all functions
   */
  createMathContext() {
    const ctx = {
      pi: Math.PI,
      e: Math.E,
      phi: (1 + Math.sqrt(5)) / 2,
      sqrt2: Math.sqrt(2),
      
      sqrt: (x) => {
        if (x < 0) throw new Error('Cannot take square root of negative number');
        return Math.sqrt(x);
      },
      cbrt: (x) => Math.cbrt(x),
      abs: (x) => Math.abs(x),
      sin: (x) => this.angleMode === 'degrees' ? Math.sin(this.toRad(x)) : Math.sin(x),
      cos: (x) => this.angleMode === 'degrees' ? Math.cos(this.toRad(x)) : Math.cos(x),
      tan: (x) => this.angleMode === 'degrees' ? Math.tan(this.toRad(x)) : Math.tan(x),
      asin: (x) => {
        if (x < -1 || x > 1) throw new Error('asin domain error');
        const result = Math.asin(x);
        return this.angleMode === 'degrees' ? this.toDeg(result) : result;
      },
      acos: (x) => {
        if (x < -1 || x > 1) throw new Error('acos domain error');
        const result = Math.acos(x);
        return this.angleMode === 'degrees' ? this.toDeg(result) : result;
      },
      atan: (x) => {
        const result = Math.atan(x);
        return this.angleMode === 'degrees' ? this.toDeg(result) : result;
      },
      sinh: (x) => Math.sinh(x),
      cosh: (x) => Math.cosh(x),
      tanh: (x) => Math.tanh(x),
      log: (x) => {
        if (x <= 0) throw new Error('log domain error');
        return Math.log10(x);
      },
      log10: (x) => {
        if (x <= 0) throw new Error('log10 domain error');
        return Math.log10(x);
      },
      log2: (x) => {
        if (x <= 0) throw new Error('log2 domain error');
        return Math.log2(x);
      },
      ln: (x) => {
        if (x <= 0) throw new Error('ln domain error');
        return Math.log(x);
      },
      exp: (x) => Math.exp(x),
      pow: (x, y) => Math.pow(x, y),
      round: (x, digits = 0) => {
        const mult = Math.pow(10, digits);
        return Math.round(x * mult) / mult;
      },
      floor: (x) => Math.floor(x),
      ceil: (x) => Math.ceil(x),
      trunc: (x) => Math.trunc(x),
      factorial: (n) => {
        if (n < 0) throw new Error('factorial of negative number');
        if (!Number.isInteger(n)) throw new Error('factorial requires integer');
        if (n > 170) throw new Error('factorial too large');
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
      },
      min: (...args) => Math.min(...args),
      max: (...args) => Math.max(...args),
      gcd: (a, b) => {
        if (!Number.isInteger(a) || !Number.isInteger(b)) throw new Error('gcd requires integers');
        return b === 0 ? Math.abs(a) : this.createMathContext().gcd(b, a % b);
      }
    };
    return ctx;
  }

  /**
   * Safely evaluate expression by replacing functions and operators
   */
  evaluate(expression) {
    try {
      expression = expression.trim();

      if (!expression) {
        return { result: null, error: 'Empty expression' };
      }

      if (expression.toLowerCase() === 'ans') {
        return { result: this.lastResult, expression: 'ANS', error: null };
      }

      // Create context
      const ctx = this.createMathContext();

      // Replace function calls with proper syntax
      let processed = expression;
      
      // Replace ^ with ** for exponentiation
      processed = processed.replace(/\^/g, '**');

      // Build function replacements
      const functions = ['sqrt', 'cbrt', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
                        'sinh', 'cosh', 'tanh', 'log', 'log10', 'log2', 'ln', 'exp',
                        'abs', 'round', 'floor', 'ceil', 'trunc', 'factorial'];

      for (const func of functions) {
        const regex = new RegExp(`\\b${func}\\s*\\(`, 'gi');
        processed = processed.replace(regex, `__${func}__(`);
      }

      // Replace constants
      processed = processed.replace(/\bpi\b/gi, `(${Math.PI})`);
      processed = processed.replace(/\be\b/gi, `(${Math.E})`);
      processed = processed.replace(/\bphi\b/gi, `(${(1 + Math.sqrt(5)) / 2})`);
      processed = processed.replace(/\bsqrt2\b/gi, `(${Math.sqrt(2)})`);

      // Create a function factory for safe evaluation
      const code = `
        (function() {
          const ctx = ${JSON.stringify(ctx)};
          const sqrt = ctx.sqrt;
          const cbrt = ctx.cbrt;
          const sin = ctx.sin;
          const cos = ctx.cos;
          const tan = ctx.tan;
          const asin = ctx.asin;
          const acos = ctx.acos;
          const atan = ctx.atan;
          const sinh = ctx.sinh;
          const cosh = ctx.cosh;
          const tanh = ctx.tanh;
          const log = ctx.log;
          const log10 = ctx.log10;
          const log2 = ctx.log2;
          const ln = ctx.ln;
          const exp = ctx.exp;
          const abs = ctx.abs;
          const round = ctx.round;
          const floor = ctx.floor;
          const ceil = ctx.ceil;
          const trunc = ctx.trunc;
          const factorial = ctx.factorial;
          const min = ctx.min;
          const max = ctx.max;
          
          const __sqrt__ = sqrt;
          const __cbrt__ = cbrt;
          const __sin__ = sin;
          const __cos__ = cos;
          const __tan__ = tan;
          const __asin__ = asin;
          const __acos__ = acos;
          const __atan__ = atan;
          const __sinh__ = sinh;
          const __cosh__ = cosh;
          const __tanh__ = tanh;
          const __log__ = log;
          const __log10__ = log10;
          const __log2__ = log2;
          const __ln__ = ln;
          const __exp__ = exp;
          const __abs__ = abs;
          const __round__ = round;
          const __floor__ = floor;
          const __ceil__ = ceil;
          const __trunc__ = trunc;
          const __factorial__ = factorial;
          const __min__ = min;
          const __max__ = max;
          
          return (${processed});
        })()
      `;

      let result = eval(code);

      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Invalid calculation result');
      }

      this.lastResult = result;

      return {
        result: result,
        expression: expression,
        error: null
      };
    } catch (error) {
      return {
        result: null,
        error: `Error: ${error.message}`
      };
    }
  }

  /**
   * Toggle angle mode between degrees and radians
   */
  toggleAngleMode() {
    this.angleMode = this.angleMode === 'degrees' ? 'radians' : 'degrees';
    return this.angleMode;
  }

  /**
   * Set angle mode
   */
  setAngleMode(mode) {
    if (mode === 'degrees' || mode === 'radians') {
      this.angleMode = mode;
      return true;
    }
    return false;
  }

  /**
   * Get current angle mode
   */
  getAngleMode() {
    return this.angleMode;
  }

  /**
   * Get last result
   */
  getLastResult() {
    return this.lastResult;
  }

  /**
   * Get available functions and help
   */
  static getHelp() {
    return `
╔════════════════════════════════════════════════════════╗
║              CALCULATOR HELP & FUNCTIONS                ║
╠════════════════════════════════════════════════════════╣
║ BASIC OPERATIONS:                                        ║
║   +, -, *, /, %                                         ║
║                                                          ║
║ POWER & ROOTS:                                           ║
║   2 ^ 3      (power)       →  8                          ║
║   sqrt(16)   (square root) →  4                          ║
║   cbrt(27)   (cube root)   →  3                          ║
║                                                          ║
║ TRIGONOMETRIC (degrees by default):                     ║
║   sin(90), cos(0), tan(45)                              ║
║   asin(1), acos(0), atan(1)                             ║
║                                                          ║
║ LOGARITHMIC:                                             ║
║   log(100)   (base 10)     →  2                          ║
║   log10(100), log2(8)      →  2, 3                       ║
║   ln(e)      (natural log) →  1                          ║
║                                                          ║
║ CONSTANTS:                                               ║
║   pi, e, phi, sqrt2                                     ║
║                                                          ║
║ OTHER:                                                   ║
║   abs(-5)    (absolute)    →  5                          ║
║   round(3.7) (rounding)    →  4                          ║
║   floor(3.7), ceil(3.2)    →  3, 4                      ║
║   factorial(5)             →  120                        ║
║                                                          ║
║ SPECIAL COMMANDS:                                        ║
║   help       - Show this help message                   ║
║   clear      - Clear screen                             ║
║   deg        - Switch to degrees mode (default)         ║
║   rad        - Switch to radians mode                   ║
║   mode       - Show current angle mode                  ║
║   memory     - Show memory value                        ║
║   history    - Show calculation history                 ║
║   ans        - Last calculation result                  ║
║   exit/quit  - Exit calculator                          ║
║                                                          ║
║ MEMORY COMMANDS:                                         ║
║   m+         - Add current result to memory            ║
║   m-         - Subtract current result from memory     ║
║   mr         - Recall memory value                      ║
║   mc         - Clear memory                             ║
║                                                          ║
║ EXAMPLES:                                                ║
║   2 + 3 * 4              →  14                           ║
║   sqrt(2) * sqrt(2)      →  2                            ║
║   sin(90) + cos(0)       →  2                            ║
║   (2 ^ 10) / 4 + 3 * 5   →  271                          ║
╚════════════════════════════════════════════════════════╝
`;
  }
}
