import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
  import { openUploadWidget } from '../../lib/cloudinary';
import { usePortfolio } from '../../hooks/usePortfolioData';

const ProfileTab = () => {
  const { profile, refresh } = usePortfolio();
  const [formData, setFormData] = useState(profile || {});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('profile').upsert(formData);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      refresh();
    }
    setLoading(false);
  };

  const handleAvatarUpload = () => {
    openUploadWidget('image', (url) => {
      setFormData((prev) => ({ ...prev, avatar_url: url }));
    });
  };

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Edit Profile</h3>

      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <img src={formData.avatar_url || '/assets/images/my-avatar.jpeg'} alt="Avatar" className="avatar" style={{ width: '100px', height: '100px' }} />
          <button type="button" onClick={handleAvatarUpload} className="btn-secondary">Upload New Avatar</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-input" type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Title</label>
            <input className="form-input" type="text" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="form-label">Bio (One paragraph per line)</label>
          <textarea className="form-input" rows={6} value={(formData.bio || []).join('\n')} onChange={(e) => setFormData({ ...formData, bio: e.target.value.split('\n') })} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input className="form-input" type="text" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Birthday</label>
            <input className="form-input" type="text" value={formData.birthday || ''} onChange={(e) => setFormData({ ...formData, birthday: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input className="form-input" type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" checked={formData.available || false} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} />
          <label className="form-label" style={{ marginBottom: 0 }}>Available for Work</label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'start' }}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileTab;
