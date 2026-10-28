/**
 * Error Analyzer & Diagnostic Formatter
 * Consolidates lexical, syntax, and formatting errors with source code context markers.
 * Suppresses redundant cascading parser errors when a root lexical error is present.
 */

export function analyzeErrors(rawInput, lexicalErrors = [], syntaxErrors = []) {
  // If there are lexical errors, filter out syntax errors that are cascades of the lexical error
  let filteredSyntaxErrors = syntaxErrors;
  if (lexicalErrors.length > 0) {
    const lexPositions = new Set(lexicalErrors.map(e => e.position));
    filteredSyntaxErrors = syntaxErrors.filter(synErr => {
      // Drop syntax errors at the exact position or immediately following an invalid character
      if (lexPositions.has(synErr.position)) return false;
      return true;
    });
  }

  const combined = [...lexicalErrors, ...filteredSyntaxErrors];

  // If a consecutive operator error was logged, ignore trailing unparsed errors
  const hasConsecutiveOp = combined.some(e => e.code === 'ERR_CONSECUTIVE_OP');
  const sanitized = hasConsecutiveOp
    ? combined.filter(e => e.code !== 'ERR_EXTRA_TOKENS' && e.code !== 'ERR_UNEXPECTED_TOKEN')
    : combined;

  // Deduplicate errors by position and message
  const uniqueErrors = [];
  const seen = new Set();

  for (const err of sanitized) {
    const key = `${err.position}-${err.message}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueErrors.push(err);
    }
  }

  // Format diagnostics with ASCII source pointer
  const diagnostics = uniqueErrors.map((err, index) => {
    const pos = Math.max(1, Math.min(err.position || 1, (rawInput ? rawInput.length : 0) + 1));
    const pointerLine = ' '.repeat(Math.max(0, pos - 1)) + '^';

    return {
      id: index + 1,
      type: err.type || 'Syntax Error',
      code: err.code || 'ERR_PARSER',
      message: err.message,
      position: pos,
      lexeme: err.lexeme || '',
      suggestion: err.suggestion || 'Review arithmetic grammar rules.',
      snippet: {
        source: rawInput,
        pointer: pointerLine
      }
    };
  });

  return {
    hasErrors: diagnostics.length > 0,
    totalErrors: diagnostics.length,
    diagnostics
  };
}
