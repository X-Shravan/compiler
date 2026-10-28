import React from 'react';

export function ErrorPanel({ errorReport, expression }) {
  if (!errorReport || !errorReport.hasErrors) {
    return (
      <div className="success-state">
        <div className="success-state-title">Syntax & Lexical Analysis Passed</div>
        <p className="success-state-desc">
          No errors detected. The expression conforms to LL(1) arithmetic grammar specifications and has been verified by the recursive descent parser.
        </p>
      </div>
    );
  }

  const { diagnostics, totalErrors } = errorReport;

  return (
    <div className="error-panel-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--error)' }}>
          {totalErrors} Diagnostic Error{totalErrors === 1 ? '' : 's'} Found
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          Stage: Compilation Terminated
        </div>
      </div>

      {diagnostics.map((diag) => (
        <div key={diag.id} className="error-card">
          <div className="error-card-header">
            <span className="error-type">{diag.type} [{diag.code}]</span>
            <span className="error-position">Column {diag.position}</span>
          </div>

          <div className="error-message">{diag.message}</div>

          {diag.snippet && (
            <div className="error-snippet">
              <div className="error-snippet-code">
                {diag.snippet.source || expression}
              </div>
              <div className="error-snippet-pointer">
                {diag.snippet.pointer}
              </div>
            </div>
          )}

          <div className="error-suggestion">
            <span className="suggestion-label">Suggested Fix:</span>
            <span>{diag.suggestion}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
