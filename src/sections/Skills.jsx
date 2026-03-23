import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolioData';

const Skills = () => {
  const { skills } = usePortfolio();
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="section-title">Technical Skills</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px 32px' }}>
        {(skills || []).map((skill, i) => (
          <div key={skill.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#c9d1d9' }}>{skill.name}</span>
              <span style={{ fontSize: 12, color: '#8b949e' }}>{skill.level}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                style={{ width: visible ? `${skill.level}%` : '0%', transitionDelay: `${i * 60}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
