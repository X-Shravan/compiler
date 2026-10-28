import React from 'react';

export function TokenTable({ tokens = [] }) {
  if (!tokens || tokens.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-secondary)' }}>
        No tokens generated. Enter an expression and click Analyze to run lexical analysis.
      </div>
    );
  }

  const counts = tokens.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {});

  const getTagClass = (type) => {
    switch (type) {
      case 'Identifier':
        return 'tag-identifier';
      case 'Number':
        return 'tag-number';
      case 'Operator':
        return 'tag-operator';
      case 'Parenthesis':
        return 'tag-parenthesis';
      default:
        return 'tag-unknown';
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)'
        }}
      >
        <span>
          Total Tokens: <strong>{tokens.length}</strong>
        </span>
        <div style={{ display: 'flex', gap: '12px' }}>
          {Object.entries(counts).map(([type, count]) => (
            <span key={type}>
              {type}: {count}
            </span>
          ))}
        </div>
      </div>

      <div className="tokens-table-wrapper">
        <table className="compiler-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Token #</th>
              <th>Lexeme</th>
              <th>Type</th>
              <th style={{ width: '120px' }}>Position</th>
              <th style={{ width: '100px' }}>Length</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((tok) => (
              <tr key={tok.id}>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {tok.id}
                </td>
                <td>
                  <code
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      backgroundColor: 'var(--surface-secondary)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {tok.lexeme}
                  </code>
                </td>
                <td>
                  <span className={`tag ${getTagClass(tok.type)}`}>{tok.type}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  col {tok.position}
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  {tok.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
