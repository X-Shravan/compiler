import React, { useState } from 'react';

export function CompilationLog({ logs = [] }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="compilation-log">
      <div
        className="log-header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setExpanded(!expanded);
          }
        }}
      >
        <div className="log-title">
          <span>Compilation Log</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ({logs.length} events)
          </span>
        </div>
        <div className="log-toggle-icon">
          {expanded ? '▲ Collapse' : '▼ Expand'}
        </div>
      </div>

      {expanded && (
        <div className="log-body">
          {logs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }}>No compilation events recorded.</div>
          ) : (
            logs.map((entry, index) => (
              <div key={index} className="log-entry">
                <span className="log-time">{entry.time}</span>
                <span className="log-message">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
