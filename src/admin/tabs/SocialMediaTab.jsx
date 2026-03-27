import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePortfolio } from '../../hooks/usePortfolioData';
import { openUploadWidget } from '../../lib/cloudinary';

const SocialMediaTab = () => {
  // socials
  const { socials, refresh } = usePortfolio();
  const [editingSocialMedia, setEditingSocialMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({ name: '', url: '', sort_order: 0, icon_url: '', icon: '' });

  useEffect(() => {
    if (editingSocialMedia) setFormData(editingSocialMedia);
    else setFormData({ name: '', url: '', sort_order: (socials?.length || 0) });
  }, [editingSocialMedia, socials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('socials').upsert(formData);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Social Media saved successfully!' });
      setEditingSocialMedia(null);
      refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    const { error } = await supabase.from('socials').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Social Media deleted successfully!' });
      refresh();
    }
    setLoading(false);
  };
  const handleIconUpload = () => {
    openUploadWidget('image/icons/', (url) => {
      setFormData((prev) => ({ ...prev, icon_url: url }));
    });
  };
  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Manage Social Media Links</h3>

      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{editingSocialMedia ? 'Edit Social Media' : 'Add New Social Media'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <img src={formData?.icon_url || "/assets/images/LPG_logo.png"} alt="Icon" className="icon" style={{ width: '50px', height: '50px' }} />
            <button type="button" onClick={handleIconUpload} className="btn-secondary">Upload Icon</button>
          </div>
          <div>
            <label className="form-label">Name</label>
            <input className="form-input" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, icon: e.target.value })} required />
          </div>
          <div>
            <label className="form-label">Url</label>
            <input className="form-input" type="text" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Social Link'}</button>
          {editingSocialMedia && <button type="button" onClick={() => setEditingSocialMedia(null)} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(socials || []).map((social) => (
          <div key={social.id} className="card card-hover" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{social.name}</span>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>{social.url}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditingSocialMedia(social)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
              <button onClick={() => handleDelete(social.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: '#f85149', borderColor: '#f8514922' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaTab;
