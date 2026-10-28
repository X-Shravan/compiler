import React from 'react';

export function Grammar() {
  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1 className="doc-title">Formal Grammar Specification</h1>
        <p className="doc-subtitle">
          Context-Free Grammar (CFG), Left-Recursion Elimination, Precedence, and Predictive Parsing Rules
        </p>
      </div>

      {/* Production Rules */}
      <section className="doc-section">
        <h2 className="doc-section-title">1. Context-Free Grammar (LL(1) Form)</h2>
        <p className="doc-paragraph">
          The parser implements a deterministic, predictive LL(1) grammar for arithmetic expressions over identifiers, numeric constants, and binary arithmetic operators. To enable predictive top-down recursive descent without backtracking, direct left recursion has been systematically eliminated using standard compiler construction transformations.
        </p>

        <div className="doc-code-block">
{`E   → T E'
E'  → + T E'  |  - T E'  |  ε

T   → F T'
T'  → * F T'  |  / F T'  |  ε

F   → ( E )   |  id  |  number`}
        </div>

        <p className="doc-paragraph">
          <strong>Grammar Symbols:</strong>
          <br />
          • Non-terminals: <code>E</code> (Expression), <code>E'</code> (Expression Rest), <code>T</code> (Term), <code>T'</code> (Term Rest), <code>F</code> (Factor).
          <br />
          • Terminals: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>(</code>, <code>)</code>, <code>id</code> (identifier token), <code>number</code> (numeric token), <code>ε</code> (empty string / epsilon).
          <br />
          • Start Symbol: <code>E</code>.
        </p>
      </section>

      {/* Left-Recursion Elimination */}
      <section className="doc-section">
        <h2 className="doc-section-title">2. Elimination of Left Recursion</h2>
        <p className="doc-paragraph">
          The naive grammar for left-associative arithmetic expressions is inherently left-recursive:
        </p>
        <div className="doc-code-block">
{`E → E + T | E - T | T
T → T * F | T / F | F
F → ( E ) | id | number`}
        </div>
        <p className="doc-paragraph">
          If directly translated into a recursive descent parser, the rule <code>E → E + T</code> causes an immediate infinite recursive call to <code>E()</code> without consuming any input token, resulting in call-stack overflow.
          By introducing auxiliary non-terminals <code>E'</code> and <code>T'</code>, the grammar is transformed into right-recursive form while preserving left-associative tree construction in the abstract syntax tree.
        </p>
      </section>

      {/* Precedence & Associativity */}
      <section className="doc-section">
        <h2 className="doc-section-title">3. Operator Precedence & Associativity</h2>
        <p className="doc-paragraph">
          Grammar levels naturally encode precedence hierarchy. Lower productions in the derivation tree are executed first and thus bind with higher precedence:
        </p>

        <table className="compiler-table" style={{ marginBottom: '20px' }}>
          <thead>
            <tr>
              <th>Precedence Level</th>
              <th>Operators</th>
              <th>Grammar Production</th>
              <th>Associativity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1 (Highest)</strong></td>
              <td><code>( )</code></td>
              <td><code>F → ( E )</code></td>
              <td>Non-associative</td>
              <td>Explicit grouping overrides all operator precedences.</td>
            </tr>
            <tr>
              <td><strong>2 (High)</strong></td>
              <td><code>*</code>, <code>/</code></td>
              <td><code>T → F T'</code></td>
              <td>Left-to-Right</td>
              <td>Multiplicative operations bind tighter than additive operations.</td>
            </tr>
            <tr>
              <td><strong>3 (Lowest)</strong></td>
              <td><code>+</code>, <code>-</code></td>
              <td><code>E → T E'</code></td>
              <td>Left-to-Right</td>
              <td>Additive operations evaluated after terms are resolved.</td>
            </tr>
          </tbody>
        </table>

        <div className="doc-code-block">
{`Example Precedence Comparison:
Expression: a + b * c
Derivation: E → T E' → F E' → id(a) + T(F(b) * F(c))
AST Struct: (+)
            / \\
           a   (*)
              /   \\
             b     c`}
        </div>
      </section>

      {/* FIRST and FOLLOW Sets */}
      <section className="doc-section">
        <h2 className="doc-section-title">4. FIRST and FOLLOW Sets</h2>
        <p className="doc-paragraph">
          To prove that this grammar is deterministic and LL(1) parsable without conflict, the FIRST and FOLLOW sets for each non-terminal are calculated as follows:
        </p>

        <table className="compiler-table">
          <thead>
            <tr>
              <th>Non-Terminal</th>
              <th>FIRST Set</th>
              <th>FOLLOW Set</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>E</code></td>
              <td><code>{'{'} (, id, number {'}'}</code></td>
              <td><code>{'{'} $, ) {'}'}</code></td>
            </tr>
            <tr>
              <td><code>E'</code></td>
              <td><code>{'{'} +, -, ε {'}'}</code></td>
              <td><code>{'{'} $, ) {'}'}</code></td>
            </tr>
            <tr>
              <td><code>T</code></td>
              <td><code>{'{'} (, id, number {'}'}</code></td>
              <td><code>{'{'} +, -, $, ) {'}'}</code></td>
            </tr>
            <tr>
              <td><code>T'</code></td>
              <td><code>{'{'} *, /, ε {'}'}</code></td>
              <td><code>{'{'} +, -, $, ) {'}'}</code></td>
            </tr>
            <tr>
              <td><code>F</code></td>
              <td><code>{'{'} (, id, number {'}'}</code></td>
              <td><code>{'{'} *, /, +, -, $, ) {'}'}</code></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
