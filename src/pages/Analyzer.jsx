import React, { useState } from 'react';
import { ExpressionEditor } from '../components/ExpressionEditor.jsx';
import { CompilationStatus } from '../components/CompilationStatus.jsx';
import { CompilerPipeline } from '../components/CompilerPipeline.jsx';
import { TokenTable } from '../components/TokenTable.jsx';
import { ASTVisualizer } from '../components/ASTVisualizer.jsx';
import { ErrorPanel } from '../components/ErrorPanel.jsx';
import { ThreeAddressCode } from '../components/ThreeAddressCode.jsx';
import { CompilationLog } from '../components/CompilationLog.jsx';

export function Analyzer({
  expression,
  setExpression,
  compilationResult,
  onAnalyze,
  onClear
}) {
  const [activeResultTab, setActiveResultTab] = useState('tokens'); // 'tokens' | 'ast' | 'errors' | 'tac'

  const hasErrors = compilationResult?.errorReport?.hasErrors || false;
  const errorCount = compilationResult?.errorReport?.totalErrors || 0;

  const handleLoadExample = (exampleExpr) => {
    setExpression(exampleExpr);
    setTimeout(() => {
      onAnalyze(exampleExpr);
    }, 0);
  };

  return (
    <div>
      {/* Two-Column Workspace */}
      <div className="analyzer-workspace">
        <ExpressionEditor
          expression={expression}
          onChange={setExpression}
          onAnalyze={() => onAnalyze(expression)}
          onClear={onClear}
          onLoadExample={handleLoadExample}
        />
        <CompilationStatus status={compilationResult?.status} />
      </div>

      {/* Compiler Pipeline Diagram */}
      <CompilerPipeline
        status={compilationResult?.status}
        hasErrors={hasErrors}
      />

      {/* Results Workspace with Tabs */}
      <div className="result-section">
        <div className="result-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeResultTab === 'tokens'}
            className={`result-tab ${activeResultTab === 'tokens' ? 'active' : ''}`}
            onClick={() => setActiveResultTab('tokens')}
          >
            Tokens
            {compilationResult?.tokens && (
              <span className="tab-badge">{compilationResult.tokens.length}</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeResultTab === 'ast'}
            className={`result-tab ${activeResultTab === 'ast' ? 'active' : ''}`}
            onClick={() => setActiveResultTab('ast')}
          >
            Syntax Tree (AST)
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeResultTab === 'errors'}
            className={`result-tab ${activeResultTab === 'errors' ? 'active' : ''}`}
            onClick={() => setActiveResultTab('errors')}
          >
            Errors
            {errorCount > 0 && (
              <span className="tab-badge error">{errorCount}</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeResultTab === 'tac'}
            className={`result-tab ${activeResultTab === 'tac' ? 'active' : ''}`}
            onClick={() => setActiveResultTab('tac')}
          >
            Three Address Code
            {compilationResult?.intermediateCode?.instructions && !hasErrors && (
              <span className="tab-badge">
                {compilationResult.intermediateCode.instructions.length}
              </span>
            )}
          </button>
        </div>

        <div className="result-tab-content">
          {activeResultTab === 'tokens' && (
            <TokenTable tokens={compilationResult?.tokens} />
          )}

          {activeResultTab === 'ast' && (
            <ASTVisualizer
              visualAST={compilationResult?.visualAST}
              hasErrors={hasErrors}
              expression={expression}
            />
          )}

          {activeResultTab === 'errors' && (
            <ErrorPanel
              errorReport={compilationResult?.errorReport}
              expression={expression}
            />
          )}

          {activeResultTab === 'tac' && (
            <ThreeAddressCode
              intermediateCode={compilationResult?.intermediateCode}
              hasErrors={hasErrors}
            />
          )}
        </div>
      </div>

      {/* Compilation Log */}
      <CompilationLog logs={compilationResult?.logs} />
    </div>
  );
}
