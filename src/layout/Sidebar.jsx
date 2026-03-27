import React from 'react';
import { usePortfolio } from '../hooks/usePortfolioData';
import { portfolioData } from '../data/portfolioData';

const Sidebar = () => {
  const data = usePortfolio();
  const { name, title, avatar_url, email, phone, birthday, location, socials, available, resume_url } = data?.profile
    ? { ...data.profile, socials: data.socials }
    : { ...portfolioData, avatar_url: portfolioData.avatar, socials: portfolioData.socials, resume_url: null };

  return (
    <div className="sidebar-card">
      {/* Avatar + Name */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
        <img
          src={avatar_url || '/assets/images/my-avatar.jpeg'}
          alt={name}
          className="avatar"
          style={{ marginBottom: 12 }}
        />
        <h1 style={{ fontSize: 17, fontWeight: 700, color: '#e6edf3', marginBottom: 4 }}>{name}</h1>
        <span className="tag">{title}</span>
        {available && (
          <div style={{ marginTop: 12 }} className="status-badge">
            <span className="status-dot" />
            Available for work
          </div>
        )}
      </div>

      <div className="divider" style={{ margin: '16px 0' }} />

      {/* Contact */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ContactRow icon="✉" label="Email">
          <a href={`mailto:${email}`} style={{ color: '#58a6ff', fontSize: 12, wordBreak: 'break-all' }}>{email}</a>
        </ContactRow>
        <ContactRow icon="📱" label="Phone">
          <a href={`tel:${phone}`} style={{ color: '#c9d1d9', fontSize: 12 }}>{phone}</a>
        </ContactRow>
        <ContactRow icon="🎂" label="Birthday">
          <span style={{ color: '#c9d1d9', fontSize: 12 }}>{birthday}</span>
        </ContactRow>
        <ContactRow icon="📍" label="Location">
          <span style={{ color: '#c9d1d9', fontSize: 12 }}>{location}</span>
        </ContactRow>
      </div>

      <div className="divider" style={{ margin: '16px 0' }} />

      {/* Resume Download */}
      <div style={{ marginBottom: 16 }}>
        {resume_url ? (
          <a
            href={resume_url.includes('cloudinary.com') ? resume_url.replace('/upload/', '/upload/fl_attachment/') : resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ width: '100%', fontSize: 13, padding: '8px 0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            download
          >
            <DownloadIcon /> Download Resume
          </a>
        ) : (
          <button
            className="btn-secondary"
            disabled
            style={{ width: '100%', fontSize: 13, padding: '8px 0', opacity: 0.5, cursor: 'not-allowed' }}
          >
            Resume Not Uploaded
          </button>
        )}
      </div>

      {/* Socials */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {(socials || []).map((s) => (
          <a key={s.id || s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="social-icon" title={s.name}>
            {s.icon_url ? <img src={s.icon_url} height={'40px'} width={'40px'} /> : <LinkedInIcon />}
          </a>
        ))}
      </div>
    </div>
  );
};

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ContactRow = ({ icon, label, children }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0, paddingTop: 1 }}>{icon}</span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#484f58', marginBottom: 2 }}>{label}</div>
      {children}
    </div>
  </div>
);

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" />
  </svg>
);

export default Sidebar;
