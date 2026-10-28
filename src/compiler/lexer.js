/**
 * Lexical Analyzer (Lexer / Tokenizer)
 * Converts input arithmetic expression into a sequence of tokens with 1-based character positions.
 */

export const TokenType = {
  IDENTIFIER: 'Identifier',
  NUMBER: 'Number',
  OPERATOR: 'Operator',
  LPAREN: 'Parenthesis',
  RPAREN: 'Parenthesis',
  UNKNOWN: 'Unknown'
};

export class Token {
  constructor(id, lexeme, type, position, length) {
    this.id = id;
    this.lexeme = lexeme;
    this.type = type;
    this.position = position; // 1-indexed
    this.length = length;
  }
}

export function tokenize(input) {
  const tokens = [];
  const errors = [];
  let index = 0;
  let tokenId = 1;
  const length = input.length;

  while (index < length) {
    const char = input[index];
    const pos = index + 1; // 1-based

    // 1. Skip whitespace
    if (/\s/.test(char)) {
      index++;
      continue;
    }

    // 2. Parentheses
    if (char === '(' || char === ')') {
      tokens.push(new Token(tokenId++, char, TokenType.LPAREN, pos, 1));
      index++;
      continue;
    }

    // 3. Operators (+, -, *, /)
    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push(new Token(tokenId++, char, TokenType.OPERATOR, pos, 1));
      index++;
      continue;
    }

    // 4. Numbers (Integers & Decimals)
    if (/[0-9]/.test(char) || (char === '.' && index + 1 < length && /[0-9]/.test(input[index + 1]))) {
      let numStr = '';
      const startPos = index + 1;
      let dotCount = 0;

      while (index < length) {
        const c = input[index];
        if (/[0-9]/.test(c)) {
          numStr += c;
          index++;
        } else if (c === '.') {
          dotCount++;
          if (dotCount > 1) {
            // Malformed decimal like 12.34.56
            errors.push({
              type: 'Lexical Error',
              code: 'ERR_MALFORMED_NUMBER',
              message: `Malformed decimal number with multiple decimal points '${numStr + c}'.`,
              position: index + 1,
              lexeme: c,
              suggestion: 'Ensure numbers have at most one decimal point.'
            });
          }
          numStr += c;
          index++;
        } else {
          break;
        }
      }

      // Check trailing decimal point e.g. "12."
      if (numStr.endsWith('.')) {
        errors.push({
          type: 'Lexical Error',
          code: 'ERR_TRAILING_DOT',
          message: `Incomplete decimal number '${numStr}' at position ${startPos}.`,
          position: startPos + numStr.length - 1,
          lexeme: '.',
          suggestion: 'Provide digits after the decimal point (e.g., 12.0).'
        });
      }

      tokens.push(new Token(tokenId++, numStr, TokenType.NUMBER, startPos, numStr.length));
      continue;
    }

    // 5. Identifiers (e.g. a, b, total, value1)
    if (/[a-zA-Z_]/.test(char)) {
      let idStr = '';
      const startPos = index + 1;
      while (index < length && /[a-zA-Z0-9_]/.test(input[index])) {
        idStr += input[index];
        index++;
      }
      tokens.push(new Token(tokenId++, idStr, TokenType.IDENTIFIER, startPos, idStr.length));
      continue;
    }

    // 6. Unknown / Invalid character
    errors.push({
      type: 'Lexical Error',
      code: 'ERR_UNEXPECTED_CHAR',
      message: `Unexpected character '${char}' at position ${pos}.`,
      position: pos,
      lexeme: char,
      suggestion: `Remove '${char}' or replace with a valid arithmetic operator (+, -, *, /) or variable name.`
    });
    tokens.push(new Token(tokenId++, char, TokenType.UNKNOWN, pos, 1));
    index++;
  }

  return { tokens, errors };
}
