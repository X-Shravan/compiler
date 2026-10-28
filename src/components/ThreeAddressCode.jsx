import React, { useState } from 'react';

export function ThreeAddressCode({ intermediateCode, hasErrors }) {
  const [activeView, setActiveView] = useState('tac'); // 'tac' | 'quadruples' | 'triples'
  const [copied, setCopied] = useState(false);

  if (hasErrors || !intermediateCode || !intermediateCode.instructions) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 600, color: 'var(--error)', marginBottom: '8px' }}>
          Intermediate Code Generation Halted
        </div>
        <p style={{ fontSize: '13px' }}>
          Three Address Code can only be emitted from a valid Abstract Syntax Tree. Please resolve syntax errors to generate TAC.
        </p>
      </div>
    );
  }

  const { instructions, rawText, quadruples, triples, temporaryVars, finalResult } = intermediateCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tac-container">
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'tac' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('tac')}
          >
            Three Address Code
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'quadruples' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('quadruples')}
          >
            Quadruples Table
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'triples' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveView('triples')}
          >
            Triples Table
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Temps: {temporaryVars.length > 0 ? temporaryVars.join(', ') : 'None'} | Final: {finalResult}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Code / Tables View */}
      {activeView === 'tac' && (
        <div className="tac-code-panel">
          <div className="tac-header">
            <span>Intermediate Representation (Linear TAC)</span>
            <span>Target: Virtual Register Machine</span>
          </div>
          <div className="tac-body">
            {instructions.length === 0 ? (
              <div style={{ color: '#94A3B8' }}>// No instructions generated</div>
            ) : (
              instructions.map((inst) => (
                <div key={inst.line} className="tac-line">
                  <span className="tac-line-num">{inst.line}</span>
                  <span className="tac-line-text">{inst.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeView === 'quadruples' && (
        <div className="tac-subtable-panel">
          <div className="subtable-title">Quadruples: (Operator, Arg1, Arg2, Result)</div>
          <table className="compiler-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Index</th>
                <th>Operator (op)</th>
                <th>Argument 1</th>
                <th>Argument 2</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {quadruples.map((q) => (
                <tr key={q.index}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    [{q.index}]
                  </td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {q.op}
                    </code>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{q.arg1}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{q.arg2}</td>
                  <td>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-dark)' }}>
                      {q.result}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeView === 'triples' && (
        <div className="tac-subtable-panel">
          <div className="subtable-title">Triples: (Operator, Arg1, Arg2)</div>
          <table className="compiler-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Index</th>
                <th>Operator (op)</th>
                <th>Argument 1</th>
                <th>Argument 2</th>
              </tr>
            </thead>
            <tbody>
              {triples.map((t) => (
                <tr key={t.index}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    ({t.index})
                  </td>
                  <td>
                    <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      {t.op}
                    </code>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.arg1}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{t.arg2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          lineHeight: 1.5
        }}
      >
        <strong>Generation Method:</strong> Post-order traversal of the Abstract Syntax Tree. Subexpressions are recursively computed into temporary registers (t1, t2, ...) preserving operator precedence and left-associativity.
      </div>
    </div>
  );
}
