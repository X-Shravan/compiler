import React from 'react';

export function CompilerPipeline({ status, hasErrors }) {
  const pipeline = [
    { id: 'lexical', label: 'LEXICAL', stageStatus: status ? status.lexical : 'Pending' },
    { id: 'syntax', label: 'SYNTAX', stageStatus: status ? status.syntax : 'Pending' },
    { id: 'ast', label: 'AST', stageStatus: status ? status.ast : 'Pending' },
    {
      id: 'errorAnalysis',
      label: 'ERROR ANALYSIS',
      stageStatus: status ? (hasErrors ? 'Failed' : 'Passed') : 'Pending'
    },
    { id: 'tac', label: 'INTERMEDIATE CODE', stageStatus: status ? status.tac : 'Pending' }
  ];

  return (
    <div className="pipeline-section">
      <div className="pipeline-header">Compiler Pipeline</div>
      <div className="pipeline-track">
        {pipeline.map((step, idx) => {
          const isPassed = step.stageStatus === 'Passed';
          const isFailed = step.stageStatus === 'Failed';
          const nodeClass = isPassed ? 'passed' : isFailed ? 'failed' : '';

          return (
            <React.Fragment key={step.id}>
              <div className="pipeline-step">
                <div className={`pipeline-node ${nodeClass}`}>
                  <div className="pipeline-node-name">{step.label}</div>
                  <div className="pipeline-node-status">{step.stageStatus}</div>
                </div>
              </div>
              {idx < pipeline.length - 1 && (
                <div className="pipeline-arrow" aria-hidden="true">→</div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
