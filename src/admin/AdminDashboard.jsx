import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import ProfileTab from './tabs/ProfileTab';
import SkillsTab from './tabs/SkillsTab';
import ExperienceTab from './tabs/ExperienceTab';
import ProjectsTab from './tabs/ProjectsTab';
import ServicesTab from './tabs/ServicesTab';
import ResumeTab from './tabs/ResumeTab';

const AdminDashboard = ({ session }) => {
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience & Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'resume', label: 'Resume & Storage' }
  ];

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />;
      case 'skills': return <SkillsTab />;
      case 'experience': return <ExperienceTab />;
      case 'projects': return <ProjectsTab />;
      case 'services': return <ServicesTab />;
      case 'resume': return <ResumeTab />;
      default: return <ProfileTab />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Admin Dashboard</h1>
            <p style={{ color: '#8b949e', fontSize: '14px' }}>Logged in as: {session.user.email}</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </header>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {/* Navigation */}
          <nav className="card" style={{ width: '280px', padding: '16px', alignSelf: 'start', flexShrink: 0 }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px' }}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <main className="card" style={{ flex: 1, minWidth: '400px', padding: '32px' }}>
            {renderTab()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
