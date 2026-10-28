import React from 'react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          Mini Compiler — Arithmetic Expression Analyzer
        </div>
        <div>
          Compiler Construction Mini Project
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          Built for academic demonstration
        </div>
      </div>
    </footer>
  );
}
