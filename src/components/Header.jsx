import React from 'react';

export function Header({ activeTab, onSelectTab }) {
  const navItems = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'examples', label: 'Examples' },
    { id: 'documentation', label: 'Documentation' }
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand">
          <span className="header-title">Mini Compiler</span>
          <span className="header-subtitle">Arithmetic Expression Analyzer</span>
        </div>
        <nav className="header-nav" aria-label="Main Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
