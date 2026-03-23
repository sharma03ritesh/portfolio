import React from 'react';
import { usePortfolio } from '../hooks/usePortfolioData';

const Projects = () => {
  const { projects } = usePortfolio();

  return (
    <div>
      <p className="section-title">Featured Projects</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(projects || []).map((project) => (
          <div key={project.id} className="card card-hover" style={{ padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <img
              src={project.image_url}
              alt={project.title}
              style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid #30363d', flexShrink: 0 }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{project.title}</h3>
                <span className="tag">{project.category}</span>
              </div>
              <p style={{ fontSize: 12, color: '#8b949e', lineHeight: 1.65, marginBottom: 10 }}>{project.description}</p>
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ fontSize: 12, padding: '5px 12px', textDecoration: 'none', display: 'inline-flex' }}
              >
                <ExternalIcon /> Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>
  </svg>
);

export default Projects;
