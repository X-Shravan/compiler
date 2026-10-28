import React, { useState } from 'react';

export function ASTVisualizer({ visualAST, hasErrors, expression }) {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  if (hasErrors || !visualAST) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
        <div style={{ fontWeight: 600, color: 'var(--error)', marginBottom: '8px' }}>
          AST Generation Halted
        </div>
        <p style={{ fontSize: '13px' }}>
          An Abstract Syntax Tree cannot be constructed for invalid syntax. Inspect the <strong>Errors</strong> tab to see why the parser failed.
        </p>
      </div>
    );
  }

  const { nodes, edges, width, height, nodeRadius } = visualAST;

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.15, 2.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.15, 0.5));
  const handleResetZoom = () => setZoom(1);

  const getNodeFill = (category) => {
    switch (category) {
      case 'operator':
        return '#FFFFFF';
      case 'identifier':
        return '#FFFFFF';
      case 'number':
        return '#FFFFFF';
      default:
        return '#FFFFFF';
    }
  };

  const getNodeStroke = (category) => {
    switch (category) {
      case 'operator':
        return '#1F4E79';
      case 'identifier':
        return '#5E6875';
      case 'number':
        return '#7E8B9B';
      default:
        return '#D9DEE5';
    }
  };

  const getNodeTextColor = (category) => {
    switch (category) {
      case 'operator':
        return '#1F4E79';
      case 'identifier':
        return '#17202A';
      case 'number':
        return '#17202A';
      default:
        return '#17202A';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Grammar and Parsing Status Banner */}
      <div
        style={{
          backgroundColor: 'var(--surface-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px'
        }}
      >
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)', marginRight: '8px' }}>
            Syntax Status:
          </span>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>
            Expression accepted successfully by Recursive Descent Parser
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          AST Nodes: {nodes.length} | Levels: {Math.max(...nodes.map((n) => n.depth)) + 1}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="ast-container">
        <div className="ast-toolbar">
          <div className="ast-meta">
            Target Expression: <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{expression}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Zoom: {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              -
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>

        <div className="ast-svg-wrapper">
          <svg
            className="ast-tree-svg"
            width={width * zoom}
            height={height * zoom}
            viewBox={`0 0 ${width} ${height}`}
            style={{ minWidth: `${Math.min(width, 400)}px` }}
          >
            <defs>
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#17202A" floodOpacity="0.08" />
              </filter>
            </defs>

            {/* Render Edges */}
            <g className="ast-edges">
              {edges.map((edge) => (
                <line
                  key={edge.id}
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  className="ast-edge"
                />
              ))}
            </g>

            {/* Render Nodes */}
            <g className="ast-nodes">
              {nodes.map((node) => {
                const isSelected = selectedNode && selectedNode.id === node.id;
                const strokeColor = isSelected ? '#1F4E79' : getNodeStroke(node.category);
                const strokeWidth = isSelected ? 2.5 : node.category === 'operator' ? 2 : 1.5;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle
                      r={nodeRadius}
                      fill={getNodeFill(node.category)}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      className="ast-node-circle"
                      filter="url(#nodeShadow)"
                    />
                    <text
                      className="ast-node-text"
                      fill={getNodeTextColor(node.category)}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {selectedNode && (
          <div
            style={{
              marginTop: '12px',
              padding: '6px 14px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)'
            }}
          >
            Selected Node: <strong>{selectedNode.label}</strong> ({selectedNode.category}) | Depth: {selectedNode.depth}
          </div>
        )}
      </div>

      {/* Grammar Breakdown for Reference */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface)',
          padding: '14px 16px'
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Grammar Rules Applied
        </div>
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--surface-secondary)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            margin: 0,
            lineHeight: 1.5
          }}
        >
{`E  → T E'
E' → + T E' | - T E' | ε
T  → F T'
T' → * F T' | / F T' | ε
F  → ( E ) | id | number`}
        </pre>
      </div>
    </div>
  );
}
