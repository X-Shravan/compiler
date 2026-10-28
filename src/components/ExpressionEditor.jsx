import React from 'react';

const PRESET_EXAMPLES = [
  { label: 'Standard arithmetic', value: '(a + b) * c - 10 / d' },
  { label: 'Operator precedence', value: 'a + b * c' },
  { label: 'Parenthesized precedence', value: '(a + b) * c' },
  { label: 'Division & subtraction', value: 'x / (y - 2)' },
  { label: 'Integer evaluation', value: '10 + 20 * 5' },
  { label: 'Nested parentheses', value: '((a + b) * c) / d' },
  { label: 'Error: consecutive operators', value: 'a + * b' },
  { label: 'Error: unmatched close paren', value: 'a + b)' },
  { label: 'Error: missing close paren', value: '(a + b' },
  { label: 'Error: invalid character', value: 'a @ b' },
  { label: 'Error: trailing operator', value: 'a +' },
  { label: 'Error: leading operator', value: '* a' }
];

export function ExpressionEditor({
  expression,
  onChange,
  onAnalyze,
  onClear,
  onLoadExample
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey || !e.shiftKey)) {
      e.preventDefault();
      onAnalyze();
    }
  };

  const handleSelectExample = (e) => {
    const val = e.target.value;
    if (val) {
      onLoadExample(val);
      e.target.value = '';
    }
  };

  return (
    <section className="editor-panel">
      <div className="panel-header">
        <span className="panel-title">Expression Editor</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {expression.length} chars
        </span>
      </div>

      <div className="editor-wrapper">
        <div className="editor-line-numbers">
          <div>1</div>
        </div>
        <textarea
          className="editor-textarea"
          value={expression}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter arithmetic expression, e.g. (a + b) * c - 10 / d"
          rows={3}
          spellCheck="false"
          autoFocus
        />
      </div>

      <div className="editor-toolbar">
        <div className="editor-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAnalyze}
          >
            Analyze
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClear}
          >
            Clear
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            htmlFor="example-select"
            style={{ fontSize: '12px', color: 'var(--text-secondary)' }}
          >
            Load Example:
          </label>
          <select
            id="example-select"
            className="btn btn-secondary btn-sm"
            style={{ outline: 'none' }}
            onChange={handleSelectExample}
            defaultValue=""
          >
            <option value="" disabled>Select an expression...</option>
            <optgroup label="Valid Expressions">
              {PRESET_EXAMPLES.slice(0, 6).map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label} ({ex.value})
                </option>
              ))}
            </optgroup>
            <optgroup label="Invalid Test Cases">
              {PRESET_EXAMPLES.slice(6).map((ex) => (
                <option key={ex.value} value={ex.value}>
                  {ex.label} ({ex.value})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="editor-hint">
        Supported: identifiers, integers, decimals, +, -, *, /, parentheses
      </div>
    </section>
  );
}
