import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { openUploadWidget } from '../../lib/cloudinary';
import { usePortfolio } from '../../hooks/usePortfolioData';

const ResumeTab = () => {
  const { profile, refresh } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleResumeUpload = () => {
    openUploadWidget('raw', async (url) => {
      setLoading(true);
      const { error } = await supabase
        .from('profile')
        .upsert({ ...profile, resume_url: url });
      
      if (error) setMessage({ type: 'error', text: error.message });
      else {
        setMessage({ type: 'success', text: 'Resume uploaded and profile updated!' });
        refresh();
      }
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Resume & Storage</h3>
      
      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <div className="card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: '#21262d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        
        <div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Manage Your Resume</h4>
          <p style={{ fontSize: '14px', color: '#8b949e', maxWidth: '400px', margin: '0 auto' }}>
            Upload your latest resume as a PDF. This will be available for visitors to view or download.
          </p>
        </div>

        {profile?.resume_url && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#21262d', borderRadius: '8px' }}>
            <span style={{ fontSize: '12px', color: '#3fb950' }}>✓ Current Resume found</span>
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#58a6ff', textDecoration: 'underline' }}>View existing PDF</a>
          </div>
        )}

        <button 
          onClick={handleResumeUpload} 
          className="btn-primary" 
          disabled={loading}
          style={{ padding: '12px 24px' }}
        >
          {loading ? 'Uploading...' : 'Upload New Resume (PDF)'}
        </button>
      </div>

      <div className="divider" />

      <div style={{ padding: '16px', background: '#f8514911', borderRadius: '8px', border: '1px solid #f8514933' }}>
        <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#f85149', marginBottom: '8px' }}>Storage Info</h5>
        <p style={{ fontSize: '12px', color: '#8b949e', lineHeight: 1.5 }}>
          All files (Images, Icons, PDFs) are stored on **Cloudinary**. When you upload a file, we store the secure HTTPS link in the **Supabase** database. Make sure you don't delete files from Cloudinary unless you want to update the links here.
        </p>
      </div>
    </div>
  );
};

export default ResumeTab;
