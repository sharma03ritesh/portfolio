import React, { useState } from 'react';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <p className="section-title">Get In Touch</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" placeholder="John Doe" required />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="john@example.com" required />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={4} placeholder="What's on your mind?" required style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <button type="submit" className="btn-primary">
            {sent ? (
              <><CheckIcon /> Message Sent!</>
            ) : (
              <><SendIcon /> Send Message</>
            )}
          </button>
        </form>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7 }}>
            Looking for a reliable developer to build your next project? I'm open to freelance opportunities and full-time roles.
          </p>

          <div className="divider" style={{ margin: '4px 0' }} />

          {[
            { label: 'Email', value: 'riteshsharma89508@gmail.com', href: 'mailto:riteshsharma89508@gmail.com' },
            { label: 'Phone', value: '+91 89508-30269', href: 'tel:+918950830269' },
            { label: 'Location', value: 'Kaithal, Haryana, India', href: null },
          ].map(({ label, value, href }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
              {href ? (
                <a href={href} style={{ fontSize: 13, color: '#58a6ff' }}>{value}</a>
              ) : (
                <span style={{ fontSize: 13, color: '#c9d1d9' }}>{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default Contact;
