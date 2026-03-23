import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePortfolio } from '../../hooks/usePortfolioData';

const ServicesTab = () => {
  const { services, refresh } = usePortfolio();
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Globe', sort_order: 0 });

  useEffect(() => {
    if (editingService) setFormData(editingService);
    else setFormData({ title: '', description: '', icon: 'Globe', sort_order: (services?.length || 0) });
  }, [editingService, services]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('services').upsert(formData);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Service saved successfully!' });
      setEditingService(null);
      refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
      refresh();
    }
    setLoading(false);
  };

  const icons = ['Globe', 'Smartphone', 'Code', 'Layout', 'Settings', 'Database', 'User', 'MessageSquare'];

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Manage Services</h3>
      
      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{editingService ? 'Edit Service' : 'Add New Service'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Service Title</label>
            <input className="form-input" type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Icon</label>
            <select className="form-input" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} style={{ appearance: 'auto' }}>
              {icons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Service'}</button>
          {editingService && <button type="button" onClick={() => setEditingService(null)} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {(services || []).map((svc) => (
          <div key={svc.id} className="card card-hover" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#58a6ff' }}>{svc.icon}</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setEditingService(svc)} style={{ fontSize: '11px', color: '#8b949e', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(svc.id)} style={{ fontSize: '11px', color: '#f85149', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
            <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{svc.title}</h5>
            <p style={{ fontSize: '12px', color: '#8b949e', lineHeight: 1.5 }}>{svc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
