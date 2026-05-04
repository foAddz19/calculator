export class History {
  constructor(maxSize = 50) {
    this.entries = [];
    this.maxSize = maxSize;
    this.memory = 0;
  }

  /**
   * Add an entry to history
   * @param {string} expression - The expression that was evaluated
   * @param {number} result - The result of the evaluation
   */
  addEntry(expression, result) {
    this.entries.push({
      timestamp: new Date().toLocaleTimeString(),
      expression: expression,
      result: result
    });

    // Keep only the last maxSize entries
    if (this.entries.length > this.maxSize) {
      this.entries.shift();
    }
  }

  /**
   * Get all history entries
   */
  getAll() {
    return [...this.entries];
  }

  /**
   * Get the last N entries
   */
  getLast(n = 10) {
    return this.entries.slice(-n);
  }

  /**
   * Clear history
   */
  clear() {
    this.entries = [];
  }

  /**
   * Get formatted history string
   */
  getFormattedHistory(limit = 20) {
    const recent = this.getLast(limit);
    
    if (recent.length === 0) {
      return 'No history yet.';
    }

    let result = '\n╔════════════════════════════════════════════════════════╗\n';
    result += '║                    CALCULATION HISTORY                  ║\n';
    result += '╠════════════════════════════════════════════════════════╣\n';

    recent.forEach((entry, index) => {
      const lineNum = String(index + 1).padStart(2, ' ');
      const expr = entry.expression.substring(0, 28).padEnd(28);
      const res = String(entry.result).substring(0, 16).padEnd(16);
      result += `║ ${lineNum}. ${expr} = ${res} ║\n`;
    });

    result += '╚════════════════════════════════════════════════════════╝';
    return result;
  }

  /**
   * Add value to memory
   */
  addToMemory(value) {
    this.memory += value;
  }

  /**
   * Subtract value from memory
   */
  subtractFromMemory(value) {
    this.memory -= value;
  }

  /**
   * Recall memory value
   */
  recallMemory() {
    return this.memory;
  }

  /**
   * Clear memory
   */
  clearMemory() {
    this.memory = 0;
  }

  /**
   * Get memory status
   */
  getMemoryStatus() {
    if (this.memory === 0) {
      return 'M: 0';
    }
    return `M: ${this.memory}`;
  }
}
