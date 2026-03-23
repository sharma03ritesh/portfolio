import React from 'react';
import { usePortfolio } from '../hooks/usePortfolioData';

const Experience = () => {
  const { education, experience, profile } = usePortfolio();
  const resume_url = profile?.resume_url;

  return (
    <div>
      {/* Education Header with Download */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p className="section-title" style={{ marginBottom: 0 }}>Education</p>
        
        {resume_url && (
          <a
            href={resume_url.includes('cloudinary.com') ? resume_url.replace('/upload/', '/upload/fl_attachment/') : resume_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: 11, padding: '4px 10px', textDecoration: 'none', border: '1px solid #30363d' }}
            download
          >
            Download Full Resume
          </a>
        )}
      </div>
      <TimelineList items={education || []} renderItem={(edu) => (
        <>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#58a6ff', letterSpacing: '0.04em' }}>{edu.duration}</span>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: '4px 0 2px' }}>{edu.institution}</h3>
          <p style={{ fontSize: 12, color: '#8b949e' }}>{edu.detail}</p>
        </>
      )} />

      <div className="divider" />

      <p className="section-title">Experience</p>
      <TimelineList items={experience || []} renderItem={(exp) => (
        <>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#58a6ff', letterSpacing: '0.04em' }}>{exp.duration}</span>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', margin: '4px 0 2px' }}>
            {exp.role} <span style={{ fontWeight: 400, color: '#8b949e' }}>@ {exp.company}</span>
          </h3>
          <p style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.65 }}>{exp.description}</p>
        </>
      )} />
    </div>
  );
};

const TimelineList = ({ items, renderItem }) => (
  <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
    {items.map((item, i) => (
      <div key={item.id} style={{ position: 'relative', paddingLeft: 20, paddingBottom: i === items.length - 1 ? 0 : 24 }}>
        <div className="timeline-dot" />
        {i < items.length - 1 && <div className="timeline-line" />}
        {renderItem(item)}
      </div>
    ))}
  </div>
);

export default Experience;
