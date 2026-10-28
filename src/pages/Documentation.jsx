import React from 'react';

export function Documentation() {
  return (
    <div className="doc-page">
      <div className="doc-header">
        <h1 className="doc-title">Compiler Architecture Documentation</h1>
        <p className="doc-subtitle">
          Technical specifications, theoretical foundations, and implementation details for the Arithmetic Expression Analyzer
        </p>
      </div>

      {/* 1. Project Overview */}
      <section className="doc-section">
        <h2 className="doc-section-title">1. Project Overview</h2>
        <p className="doc-paragraph">
          This system is an academic-grade front-end and intermediate code generator for arithmetic expressions. It demonstrates the fundamental phases of a traditional compiler: lexical scanning, predictive recursive descent syntax parsing, Abstract Syntax Tree (AST) construction, syntax error diagnostics with source-code coordinate mapping, and Three Address Code (TAC) emission with virtual register allocation.
        </p>
      </section>

      {/* 2. Compiler Pipeline */}
      <section className="doc-section">
        <h2 className="doc-section-title">2. Compiler Pipeline</h2>
        <p className="doc-paragraph">
          The compiler pipeline operates entirely client-side without external dependencies. The execution sequence is strictly modularized:
        </p>
        <div className="doc-code-block">
{`Raw Character Stream (Source Input)
   │
   ▼
[Lexical Analyzer / Tokenizer] ───► Token Stream & Lexical Errors
   │
   ▼
[Recursive Descent Parser]     ───► Parse Tree Reduction & Syntax Errors
   │
   ▼
[Abstract Syntax Tree (AST)]   ───► Hierarchical Operator-Operand Graph
   │
   ▼
[Error Diagnostic Reporter]    ───► Source coordinate pointers & hints
   │
   ▼
[Intermediate Code Generator]  ───► Three Address Code (TAC), Quadruples, Triples`}
        </div>
      </section>

      {/* 3. Lexical Analysis */}
      <section className="doc-section">
        <h2 className="doc-section-title">3. Lexical Analysis</h2>
        <p className="doc-paragraph">
          The lexer consumes an unstructured string and produces an ordered list of typed tokens. It skips whitespace while maintaining a 1-based character position index for exact error reporting.
        </p>
        <table className="compiler-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Token Class</th>
              <th>Regular Expression Pattern</th>
              <th>Sample Lexemes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Identifier</code></td>
              <td><code>[a-zA-Z_][a-zA-Z0-9_]*</code></td>
              <td><code>a</code>, <code>b</code>, <code>total</code>, <code>x1</code></td>
            </tr>
            <tr>
              <td><code>Number</code></td>
              <td><code>[0-9]+(\.[0-9]+)?</code></td>
              <td><code>10</code>, <code>250</code>, <code>3.1415</code></td>
            </tr>
            <tr>
              <td><code>Operator</code></td>
              <td><code>[+\-*/]</code></td>
              <td><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code></td>
            </tr>
            <tr>
              <td><code>Parenthesis</code></td>
              <td><code>[()]</code></td>
              <td><code>(</code>, <code>)</code></td>
            </tr>
          </tbody>
        </table>
        <p className="doc-paragraph">
          When an unclassified character (such as <code>@</code>, <code>#</code>, <code>$</code>) is encountered, the scanner generates a lexical error record with its exact column position and produces an unknown token so the downstream stages can attempt recovery.
        </p>
      </section>

      {/* 4. Syntax Analysis */}
      <section className="doc-section">
        <h2 className="doc-section-title">4. Syntax Analysis</h2>
        <p className="doc-paragraph">
          Syntax analysis confirms whether the token stream belongs to the language defined by the Context-Free Grammar. The grammar is defined in Backus-Naur Form (BNF) without left recursion:
        </p>
        <div className="doc-code-block">
{`E   → T E'
E'  → + T E'  |  - T E'  |  ε
T   → F T'
T'  → * F T'  |  / F T'  |  ε
F   → ( E )   |  id  |  number`}
        </div>
      </section>

      {/* 5. Recursive Descent Parser */}
      <section className="doc-section">
        <h2 className="doc-section-title">5. Recursive Descent Parser</h2>
        <p className="doc-paragraph">
          The parser is implemented via mutually recursive procedures corresponding directly to non-terminals:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '16px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
          <li>
            <strong><code>expression()</code>:</strong> Calls <code>term()</code>, then iterates while the lookahead token is <code>+</code> or <code>-</code>, consuming the operator and folding the right-hand term into a left-associative binary operator node.
          </li>
          <li>
            <strong><code>term()</code>:</strong> Calls <code>factor()</code>, then iterates while lookahead is <code>*</code> or <code>/</code>, folding right-hand factors.
          </li>
          <li>
            <strong><code>factor()</code>:</strong> Evaluates atomic units: consumes <code>(</code>, parses subexpression, matches <code>)</code>; or consumes an identifier or number token.
          </li>
        </ul>
      </section>

      {/* 6. Abstract Syntax Tree */}
      <section className="doc-section">
        <h2 className="doc-section-title">6. Abstract Syntax Tree (AST)</h2>
        <p className="doc-paragraph">
          Unlike a concrete parse tree, which contains syntactic punctuation and intermediate derivation non-terminals (<code>E'</code>, <code>T'</code>), an AST discards punctuation such as parentheses and retains only the structural semantics:
        </p>
        <div className="doc-code-block">
{`Concrete Parse Tree for (a + b):         Abstract Syntax Tree (AST):
          E                                       (+)
         / \\                                     /   \\
        T   E'                                  a     b
        │   │
        F   ε
      / │ \\
     (  E  )
       / \\
      T   E'
      │   │ \\
      F   +  T
      │      │
     id(a)   F
             │
            id(b)`}
        </div>
        <p className="doc-paragraph">
          The visualizer performs a tidy binary tree positioning algorithm in SVG space, computing subtree widths to prevent overlapping nodes and centering the tree dynamically.
        </p>
      </section>

      {/* 7. Error Analysis */}
      <section className="doc-section">
        <h2 className="doc-section-title">7. Error Analysis & Diagnostics</h2>
        <p className="doc-paragraph">
          The error system handles lexical and syntactic faults by pinpointing the offending column:
        </p>
        <table className="compiler-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th>Error Condition</th>
              <th>Trigger Input</th>
              <th>Diagnostic Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Invalid Character</td>
              <td><code>a @ b</code></td>
              <td><code>Unexpected character '@' at position 3.</code></td>
            </tr>
            <tr>
              <td>Consecutive Operators</td>
              <td><code>a + * b</code></td>
              <td><code>Unexpected operator '*' after '+'. Expected an identifier, number, or '('.</code></td>
            </tr>
            <tr>
              <td>Trailing Operator</td>
              <td><code>a +</code></td>
              <td><code>Unexpected end of expression. Expected an operand.</code></td>
            </tr>
            <tr>
              <td>Unmatched Open Paren</td>
              <td><code>(a + b</code></td>
              <td><code>Missing closing parenthesis ')'.</code></td>
            </tr>
            <tr>
              <td>Unmatched Close Paren</td>
              <td><code>a + b)</code></td>
              <td><code>Unexpected closing parenthesis ')' at position 6.</code></td>
            </tr>
            <tr>
              <td>Empty Expression</td>
              <td><code>""</code></td>
              <td><code>Expression cannot be empty.</code></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 8. Three Address Code */}
      <section className="doc-section">
        <h2 className="doc-section-title">8. Three Address Code (TAC) Generation</h2>
        <p className="doc-paragraph">
          Three Address Code is an intermediate representation where each instruction contains at most one operator on the right-hand side.
          Code is emitted via post-order traversal of the AST:
        </p>
        <div className="doc-code-block">
{`Traversal Algorithm:
function generateTAC(node):
  if node is Identifier: return node.name
  if node is Number: return node.value
  if node is BinaryOp:
    arg1 = generateTAC(node.left)
    arg2 = generateTAC(node.right)
    temp = allocate_register()    // t1, t2, ...
    emit(temp = arg1 op arg2)
    return temp`}
        </div>
        <p className="doc-paragraph">
          The application also displays Quadruples (4 fields: <code>op, arg1, arg2, result</code>) and Triples (3 fields: <code>op, arg1, arg2</code> with implicit result indexing).
        </p>
      </section>

      {/* 9. Technologies Used */}
      <section className="doc-section">
        <h2 className="doc-section-title">9. Technologies Used</h2>
        <table className="compiler-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Technology / Specification</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UI Framework</td>
              <td>React 19</td>
              <td>Component architecture, responsive state management</td>
            </tr>
            <tr>
              <td>Build Tool</td>
              <td>Vite</td>
              <td>Fast dev server and bundling</td>
            </tr>
            <tr>
              <td>Styling</td>
              <td>Vanilla CSS with CSS Custom Properties</td>
              <td>Developer tool aesthetic, restrained academic palette</td>
            </tr>
            <tr>
              <td>AST Visualization</td>
              <td>Dynamic Scalable Vector Graphics (SVG)</td>
              <td>Mathematical hierarchical node tree layout calculation</td>
            </tr>
            <tr>
              <td>Typography</td>
              <td>JetBrains Mono, Inter</td>
              <td>Monospace compiler output & clear technical sans-serif text</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
