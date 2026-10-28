/**
 * Recursive Descent Parser
 * Implements LL(1) arithmetic grammar without left recursion:
 *
 * E  → T E'
 * E' → + T E' | - T E' | ε
 * T  → F T'
 * T' → * F T' | / F T' | ε
 * F  → ( E ) | id | number
 */

import { TokenType } from './lexer.js';
import { BinaryOpNode, IdentifierNode, NumberNode } from './ast.js';

export class Parser {
  constructor(tokens, rawInput = '') {
    this.tokens = tokens;
    this.rawInput = rawInput;
    this.current = 0;
    this.errors = [];
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  peek() {
    return this.tokens[this.current] || null;
  }

  previous() {
    return this.tokens[this.current - 1] || null;
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  parse() {
    if (!this.rawInput || this.rawInput.trim() === '') {
      this.errors.push({
        type: 'Syntax Error',
        code: 'ERR_EMPTY_EXPR',
        message: 'Expression cannot be empty.',
        position: 1,
        lexeme: '',
        suggestion: 'Enter an arithmetic expression, e.g., (a + b) * c'
      });
      return { ast: null, errors: this.errors };
    }

    if (this.tokens.length === 0) {
      this.errors.push({
        type: 'Syntax Error',
        code: 'ERR_EMPTY_EXPR',
        message: 'Expression cannot be empty.',
        position: 1,
        lexeme: '',
        suggestion: 'Enter an arithmetic expression with valid tokens.'
      });
      return { ast: null, errors: this.errors };
    }

    // Check for leading binary operator (* or /)
    const firstTok = this.peek();
    if (firstTok && firstTok.type === TokenType.OPERATOR && (firstTok.lexeme === '*' || firstTok.lexeme === '/')) {
      this.errors.push({
        type: 'Syntax Error',
        code: 'ERR_LEADING_OP',
        message: `Unexpected leading operator '${firstTok.lexeme}' at position ${firstTok.position}. Expected an identifier, number, or '('.`,
        position: firstTok.position,
        lexeme: firstTok.lexeme,
        suggestion: `Remove '${firstTok.lexeme}' or place an operand before it.`
      });
      return { ast: null, errors: this.errors };
    }

    const ast = this.expression();

    // Check for trailing unparsed tokens (e.g., extra closing parenthesis or missing operator)
    if (!this.isAtEnd()) {
      const remainingToken = this.peek();
      if (remainingToken.lexeme === ')') {
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_UNEXPECTED_RPAREN',
          message: `Unexpected closing parenthesis ')' at position ${remainingToken.position}.`,
          position: remainingToken.position,
          lexeme: ')',
          suggestion: "Remove the unmatched closing parenthesis or check expression grouping."
        });
      } else if (remainingToken.type === TokenType.IDENTIFIER || remainingToken.type === TokenType.NUMBER) {
        const prev = this.previous();
        const prevName = prev ? `'${prev.lexeme}'` : 'the previous term';
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_MISSING_OPERATOR',
          message: `Missing operator between ${prevName} and '${remainingToken.lexeme}' at position ${remainingToken.position}.`,
          position: remainingToken.position,
          lexeme: remainingToken.lexeme,
          suggestion: `Insert an arithmetic operator (+, -, *, /) before '${remainingToken.lexeme}'.`
        });
      } else {
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_EXTRA_TOKENS',
          message: `Unexpected token '${remainingToken.lexeme}' at position ${remainingToken.position}.`,
          position: remainingToken.position,
          lexeme: remainingToken.lexeme,
          suggestion: 'Ensure the expression conforms to standard arithmetic syntax.'
        });
      }
    }

    if (this.errors.length > 0) {
      return { ast: null, errors: this.errors };
    }

    return { ast, errors: [] };
  }

  // E → T E'
  // E' → + T E' | - T E' | ε
  expression() {
    let left = this.term();
    if (!left && this.errors.length > 0) return null;

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token.type === TokenType.OPERATOR && (token.lexeme === '+' || token.lexeme === '-')) {
        const opToken = this.advance();

        if (this.isAtEnd()) {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_MISSING_OPERAND',
            message: 'Unexpected end of expression. Expected an operand.',
            position: opToken.position + opToken.length,
            lexeme: opToken.lexeme,
            suggestion: 'Add an identifier, number, or parenthesized subexpression after the operator.'
          });
          return null;
        }

        const nextTok = this.peek();
        if (nextTok.type === TokenType.OPERATOR) {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_CONSECUTIVE_OP',
            message: `Unexpected operator '${nextTok.lexeme}' after '${opToken.lexeme}'. Expected an identifier, number, or '('.`,
            position: nextTok.position,
            lexeme: nextTok.lexeme,
            suggestion: `Remove the extra operator '${nextTok.lexeme}' or insert an operand between them.`
          });
          return null;
        }

        if (nextTok.lexeme === ')') {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_UNEXPECTED_RPAREN',
            message: `Unexpected closing parenthesis ')' at position ${nextTok.position}. Expected an operand.`,
            position: nextTok.position,
            lexeme: ')',
            suggestion: 'Remove the closing parenthesis or insert an operand.'
          });
          return null;
        }

        const right = this.term();
        if (!right) return null;

        left = new BinaryOpNode(opToken.lexeme, left, right, opToken.position);
      } else {
        break;
      }
    }

    return left;
  }

  // T → F T'
  // T' → * F T' | / F T' | ε
  term() {
    let left = this.factor();
    if (!left && this.errors.length > 0) return null;

    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token.type === TokenType.OPERATOR && (token.lexeme === '*' || token.lexeme === '/')) {
        const opToken = this.advance();

        if (this.isAtEnd()) {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_MISSING_OPERAND',
            message: 'Unexpected end of expression. Expected an operand.',
            position: opToken.position + opToken.length,
            lexeme: opToken.lexeme,
            suggestion: 'Add an identifier, number, or parenthesized subexpression after the operator.'
          });
          return null;
        }

        const nextTok = this.peek();
        if (nextTok.type === TokenType.OPERATOR) {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_CONSECUTIVE_OP',
            message: `Unexpected operator '${nextTok.lexeme}' after '${opToken.lexeme}'. Expected an identifier, number, or '('.`,
            position: nextTok.position,
            lexeme: nextTok.lexeme,
            suggestion: `Remove the extra operator '${nextTok.lexeme}' or insert an operand between them.`
          });
          return null;
        }

        if (nextTok.lexeme === ')') {
          this.errors.push({
            type: 'Syntax Error',
            code: 'ERR_UNEXPECTED_RPAREN',
            message: `Unexpected closing parenthesis ')' at position ${nextTok.position}. Expected an operand.`,
            position: nextTok.position,
            lexeme: ')',
            suggestion: 'Remove the closing parenthesis or insert an operand.'
          });
          return null;
        }

        const right = this.factor();
        if (!right) return null;

        left = new BinaryOpNode(opToken.lexeme, left, right, opToken.position);
      } else {
        break;
      }
    }

    return left;
  }

  // F → ( E ) | id | number
  factor() {
    if (this.isAtEnd()) {
      const prev = this.previous();
      this.errors.push({
        type: 'Syntax Error',
        code: 'ERR_MISSING_OPERAND',
        message: 'Unexpected end of expression. Expected an operand.',
        position: prev ? prev.position + prev.length : 1,
        lexeme: '',
        suggestion: 'Provide an identifier, number, or parenthesized expression.'
      });
      return null;
    }

    const token = this.peek();

    // 1. Parenthesized expression: ( E )
    if (token.lexeme === '(') {
      const openParen = this.advance();

      // Check empty parentheses ()
      if (!this.isAtEnd() && this.peek().lexeme === ')') {
        this.advance();
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_EMPTY_PARENTHESES',
          message: `Empty parentheses '()' at position ${openParen.position}.`,
          position: openParen.position,
          lexeme: '()',
          suggestion: 'Provide an expression inside the parentheses or remove them.'
        });
        return null;
      }

      const expr = this.expression();
      if (!expr && this.errors.length > 0) return null;

      if (this.isAtEnd() || this.peek().lexeme !== ')') {
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_UNMATCHED_LPAREN',
          message: "Missing closing parenthesis ')'.",
          position: this.rawInput.length + 1,
          lexeme: '(',
          suggestion: `Add ')' to close the open parenthesis that started at position ${openParen.position}.`
        });
        return null;
      }

      this.advance(); // consume ')'
      return expr;
    }

    // 2. Unmatched closing parenthesis
    if (token.lexeme === ')') {
      this.errors.push({
        type: 'Syntax Error',
        code: 'ERR_UNEXPECTED_RPAREN',
        message: `Unexpected closing parenthesis ')' at position ${token.position}.`,
        position: token.position,
        lexeme: ')',
        suggestion: "Remove the unmatched ')' or add a matching '(' before it."
      });
      this.advance();
      return null;
    }

    // 3. Identifier
    if (token.type === TokenType.IDENTIFIER) {
      this.advance();
      return new IdentifierNode(token.lexeme, token.position);
    }

    // 4. Number
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return new NumberNode(token.lexeme, token.position);
    }

    // 5. Operator where operand is expected
    if (token.type === TokenType.OPERATOR) {
      const prev = this.previous();
      if (prev && prev.type === TokenType.OPERATOR) {
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_CONSECUTIVE_OP',
          message: `Unexpected operator '${token.lexeme}' after '${prev.lexeme}'. Expected an identifier, number, or '('.`,
          position: token.position,
          lexeme: token.lexeme,
          suggestion: `Remove '${token.lexeme}' or insert an operand between the operators.`
        });
      } else {
        this.errors.push({
          type: 'Syntax Error',
          code: 'ERR_UNEXPECTED_OPERATOR',
          message: `Unexpected operator '${token.lexeme}' at position ${token.position}. Expected an identifier, number, or '('.`,
          position: token.position,
          lexeme: token.lexeme,
          suggestion: `Place an operand before '${token.lexeme}' or remove it.`
        });
      }
      this.advance();
      return null;
    }

    // 6. Unknown token (from lexer)
    if (token.type === TokenType.UNKNOWN) {
      this.advance();
      return null;
    }

    // Fallback unexpected token
    this.errors.push({
      type: 'Syntax Error',
      code: 'ERR_UNEXPECTED_TOKEN',
      message: `Unexpected token '${token.lexeme}' at position ${token.position}. Expected an identifier, number, or '('.`,
      position: token.position,
      lexeme: token.lexeme,
      suggestion: 'Check the syntax at this position.'
    });
    this.advance();
    return null;
  }
}
