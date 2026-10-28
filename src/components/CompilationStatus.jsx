import React from 'react';

export function CompilationStatus({ status }) {
  const stages = [
    { key: 'input', label: 'Input' },
    { key: 'lexical', label: 'Tokens' },
    { key: 'syntax', label: 'Syntax' },
    { key: 'ast', label: 'AST' },
    { key: 'tac', label: 'Intermediate Code' }
  ];

  const getBadgeClass = (state) => {
    switch (state) {
      case 'Passed':
        return 'badge-passed';
      case 'Failed':
        return 'badge-failed';
      case 'Processing':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  return (
    <section className="status-panel">
      <div className="panel-header">
        <span className="panel-title">Compilation Status</span>
      </div>

      <div className="status-list">
        {stages.map((stage) => {
          const state = status ? status[stage.key] : 'Pending';
          return (
            <div key={stage.key} className="status-row">
              <span className="status-label">{stage.label}</span>
              <span className={`status-badge ${getBadgeClass(state)}`}>
                <span className="badge-dot" />
                {state || 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
