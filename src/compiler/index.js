/**
 * Compiler Driver / Pipeline Coordinator
 * Coordinates: Lexical Analysis -> Syntax Analysis -> AST -> Error Analysis -> Three Address Code
 */

import { tokenize } from './lexer.js';
import { Parser } from './parser.js';
import { layoutAST } from './ast.js';
import { analyzeErrors } from './errorAnalyzer.js';
import { generateThreeAddressCode } from './intermediateCode.js';

function formatTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function compileExpression(inputString) {
  const rawInput = inputString !== undefined ? String(inputString) : '';
  const logs = [];

  function log(message) {
    logs.push({
      time: formatTimestamp(),
      message
    });
  }

  log('Input received');

  // Stage 1: Lexical Analysis
  const { tokens, errors: lexicalErrors } = tokenize(rawInput);
  log('Lexical analysis completed');
  log(`${tokens.length} token${tokens.length === 1 ? '' : 's'} generated`);

  // Stage 2: Syntax Analysis
  log('Syntax analysis started');
  const parser = new Parser(tokens, rawInput);
  const { ast, errors: syntaxErrors } = parser.parse();

  // Stage 3: Error Analysis
  const errorReport = analyzeErrors(rawInput, lexicalErrors, syntaxErrors);

  const status = {
    input: rawInput.trim().length > 0 ? 'Passed' : 'Failed',
    lexical: lexicalErrors.length === 0 ? 'Passed' : 'Failed',
    syntax: (syntaxErrors.length === 0 && rawInput.trim().length > 0) ? 'Passed' : 'Failed',
    ast: ast !== null ? 'Passed' : 'Failed',
    tac: (ast !== null && !errorReport.hasErrors) ? 'Passed' : 'Failed'
  };

  let visualAST = null;
  let intermediateCode = null;

  if (errorReport.hasErrors) {
    log(`Compilation failed with ${errorReport.totalErrors} error${errorReport.totalErrors === 1 ? '' : 's'}`);
    log('AST construction halted');
    log('Intermediate code generation skipped due to errors');
  } else {
    log('Parse completed successfully');
    log('AST constructed');
    visualAST = layoutAST(ast);

    intermediateCode = generateThreeAddressCode(ast);
    log('Intermediate code generated');
  }

  return {
    rawInput,
    tokens,
    ast,
    visualAST,
    errorReport,
    intermediateCode,
    logs,
    status
  };
}
