import React from 'react';
import { usePortfolio } from '../hooks/usePortfolioData';

const iconMap = {
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Smartphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>
    </svg>
  ),
};

const About = () => {
  const { profile, services } = usePortfolio();
  const bio = profile?.bio || [];

  return (
    <div>
      <p className="section-title">About Me</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {bio.map((para, i) => (
          <p key={i} style={{ fontSize: 14, lineHeight: 1.75, color: '#8b949e' }}>{para}</p>
        ))}
      </div>

      <div className="divider" />

      <p className="section-title">What I'm Building</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {(services || []).map((svc) => {
          const Icon = iconMap[svc.icon] || iconMap.Globe;
          return (
            <div key={svc.id} className="card card-hover" style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ color: '#58a6ff', marginTop: 2, flexShrink: 0 }}><Icon /></div>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3', marginBottom: 4 }}>{svc.title}</h4>
                <p style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.6 }}>{svc.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;
