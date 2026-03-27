import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { getSettings } from '../lib/settings';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Save to Supabase (Backup)
      const { error: dbError } = await supabase
        .from('messages')
        .insert([formData]);

      if (dbError) throw dbError;

      // 2. Resolve Web3Forms key: DB first, then env var
      const settings = await getSettings();
      const accessKey =
        settings.web3forms_access_key || import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

      if (!accessKey) {
        throw new Error('Web3Forms access key not configured. Set it in Admin → Settings.');
      }

      // 3. Send Email via Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          ...formData,
          subject: `New Portfolio Message from ${formData.name}`,
          to: 'riteshsharma89508@gmail.com'
        })
      });

      if (!response.ok) {
        throw new Error('Email sending failed');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div>
      <p className="section-title">Get In Touch</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Message</label>
            <textarea
              className="form-input"
              rows={4}
              placeholder="What's on your mind?"
              required
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending...' : status === 'success' ? (
              <><CheckIcon /> Message Sent!</>
            ) : status === 'error' ? (
              'Failed to send. Try again.'
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
    <line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default Contact;
