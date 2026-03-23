import React from 'react';

const Footer = () => (
  <footer style={{ borderTop: '1px solid #21262d', marginTop: 40, padding: '20px', textAlign: 'center' }}>
    <p style={{ fontSize: 12, color: '#484f58' }}>
      Designed & built by <span style={{ color: '#8b949e', fontWeight: 600 }}>Ritesh Sharma</span> &mdash; &copy; {new Date().getFullYear()}
    </p>
  </footer>
);

export default Footer;
