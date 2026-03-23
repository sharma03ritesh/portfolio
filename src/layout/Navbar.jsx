import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const Navbar = ({ activeSection, setActiveSection }) => (
  <div style={{ borderBottom: '1px solid #21262d', padding: '12px 20px', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveSection(tab.id)}
        className={`nav-tab${activeSection === tab.id ? ' active' : ''}`}
        style={{ position: 'relative' }}
      >
        {tab.label}
        {activeSection === tab.id && (
          <motion.div
            layoutId="tab-indicator"
            style={{
              position: 'absolute',
              bottom: -13,
              left: 8,
              right: 8,
              height: 2,
              background: '#58a6ff',
              borderRadius: 2,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
      </button>
    ))}
  </div>
);

export default Navbar;
