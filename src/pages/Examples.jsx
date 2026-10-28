import React from 'react';

const VALID_EXAMPLES = [
  {
    expr: 'a + b',
    title: 'Basic Binary Addition',
    description: 'Simplest valid arithmetic expression testing single-node AST creation and single TAC instruction.'
  },
  {
    expr: 'a + b * c',
    title: 'Operator Precedence (Multiplication over Addition)',
    description: 'Verifies that multiplication binds tighter than addition: parsed as a + (b * c) with t1 = b * c before t2 = a + t1.'
  },
  {
    expr: '(a + b) * c',
    title: 'Parenthesized Precedence Override',
    description: 'Tests explicit grouping overriding default precedence: parsed as (a + b) first, emitting t1 = a + b, then t2 = t1 * c.'
  },
  {
    expr: 'x / (y - 2)',
    title: 'Mixed Identifiers, Integers & Subtraction',
    description: 'Tests right-hand parenthesized term with integer literal constant.'
  },
  {
    expr: '10 + 20 * 5',
    title: 'Numeric Literals Constant Chain',
    description: 'Validates that parser correctly handles pure numeric operand expressions without identifiers.'
  },
  {
    expr: '((a + b) * c) / d',
    title: 'Multi-Level Nested Parentheses',
    description: 'Deep hierarchical expression testing recursive descent nesting and proper bracket balance.'
  },
  {
    expr: '(a + b) * c - 10 / d',
    title: 'Full Compound Expression',
    description: 'Contains four binary operators (+, *, -, /) demonstrating complete pipeline execution and temporary register allocation.'
  }
];

const INVALID_EXAMPLES = [
  {
    expr: 'a + * b',
    title: 'Consecutive Operators',
    expectedError: "Unexpected operator '*' after '+'. Expected an identifier, number, or '('.",
    description: 'Tests syntax rule forbidding binary operators without an intervening operand.'
  },
  {
    expr: 'a + b)',
    title: 'Unmatched Closing Parenthesis',
    expectedError: "Unexpected closing parenthesis ')' at position 6.",
    description: 'Tests trailing syntax verification for orphan closing brackets without matching opener.'
  },
  {
    expr: '(a + b',
    title: 'Unmatched Opening Parenthesis',
    expectedError: "Missing closing parenthesis ')'.",
    description: 'Tests factor parser reaching end-of-expression before closing bracket is found.'
  },
  {
    expr: 'a @ b',
    title: 'Invalid Lexical Character',
    expectedError: "Unexpected character '@' at position 3.",
    description: 'Tests lexical analyzer rejecting non-arithmetic ASCII characters.'
  },
  {
    expr: 'a +',
    title: 'Missing Operand (Trailing Operator)',
    expectedError: 'Unexpected end of expression. Expected an operand.',
    description: 'Tests syntax analyzer detecting truncated input following a binary operator.'
  },
  {
    expr: '* a',
    title: 'Unexpected Leading Operator',
    expectedError: "Unexpected leading operator '*' at position 1. Expected an identifier, number, or '('.",
    description: 'Tests rejection of leading multiplicative operator without a left operand.'
  },
  {
    expr: '12.34.56 + x',
    title: 'Malformed Decimal Number',
    expectedError: "Malformed decimal number with multiple decimal points '12.34.56'.",
    description: 'Tests lexical analyzer state machine rejecting numbers with multiple decimal periods.'
  }
];

export function Examples({ onSelectExample }) {
  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1 className="doc-title">Compiler Test Suite & Examples</h1>
        <p className="doc-subtitle">
          Curated test cases demonstrating valid syntax trees, precedence rules, and syntax error detection
        </p>
      </div>

      <div className="examples-grid">
        {/* Valid Test Cases */}
        <div className="example-category">
          <div className="category-title">Valid Arithmetic Expressions</div>

          {VALID_EXAMPLES.map((item) => (
            <div key={item.expr} className="example-card">
              <div className="example-expr-row">
                <code className="example-code">{item.expr}</code>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onSelectExample(item.expr)}
                >
                  Try this expression
                </button>
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              <p className="example-desc">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Invalid Test Cases */}
        <div className="example-category">
          <div className="category-title">Invalid Expressions (Diagnostic Suite)</div>

          {INVALID_EXAMPLES.map((item) => (
            <div key={item.expr} className="example-card">
              <div className="example-expr-row">
                <code className="example-code" style={{ color: 'var(--error)' }}>
                  {item.expr}
                </code>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => onSelectExample(item.expr)}
                >
                  Try this expression
                </button>
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                {item.title}
              </div>
              <div className="example-error-desc">
                Expected: {item.expectedError}
              </div>
              <p className="example-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
