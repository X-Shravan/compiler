import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Analyzer } from './pages/Analyzer.jsx';
import { Grammar } from './pages/Grammar.jsx';
import { Examples } from './pages/Examples.jsx';
import { Documentation } from './pages/Documentation.jsx';
import { compileExpression } from './compiler/index.js';

const INITIAL_EXPRESSION = '(a + b) * c - 10 / d';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [expression, setExpression] = useState(INITIAL_EXPRESSION);
  const [compilationResult, setCompilationResult] = useState(null);

  // Compile initial expression on mount
  useEffect(() => {
    const res = compileExpression(INITIAL_EXPRESSION);
    setCompilationResult(res);
  }, []);

  const handleAnalyze = (exprToAnalyze) => {
    const target = exprToAnalyze !== undefined ? exprToAnalyze : expression;
    const res = compileExpression(target);
    setCompilationResult(res);
  };

  const handleClear = () => {
    setExpression('');
    const res = compileExpression('');
    setCompilationResult(res);
  };

  const handleSelectExample = (exampleExpr) => {
    setExpression(exampleExpr);
    const res = compileExpression(exampleExpr);
    setCompilationResult(res);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'analyzer' && (
          <Analyzer
            expression={expression}
            setExpression={setExpression}
            compilationResult={compilationResult}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        )}

        {activeTab === 'grammar' && <Grammar />}

        {activeTab === 'examples' && (
          <Examples onSelectExample={handleSelectExample} />
        )}

        {activeTab === 'documentation' && <Documentation />}
      </main>

      <Footer />
    </div>
  );
}
