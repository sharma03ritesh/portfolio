import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePortfolio } from '../../hooks/usePortfolioData';

const SkillsTab = () => {
  const { skills, refresh } = usePortfolio();
  const [editingSkill, setEditingSkill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({ name: '', level: 50, sort_order: 0 });

  useEffect(() => {
    if (editingSkill) setFormData(editingSkill);
    else setFormData({ name: '', level: 50, sort_order: (skills?.length || 0) });
  }, [editingSkill, skills]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('skills').upsert(formData);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Skill saved successfully!' });
      setEditingSkill(null);
      refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Skill deleted successfully!' });
      refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Manage Skills</h3>
      
      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Skill Name</label>
            <input className="form-input" type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Level ({formData.level}%)</label>
            <input type="range" min="0" max="100" value={formData.level} onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})} style={{ width: '100%', height: '32px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Skill'}</button>
          {editingSkill && <button type="button" onClick={() => setEditingSkill(null)} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(skills || []).map((skill) => (
          <div key={skill.id} className="card card-hover" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{skill.name}</span>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>{skill.level}%</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditingSkill(skill)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
              <button onClick={() => handleDelete(skill.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: '#f85149', borderColor: '#f8514922' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsTab;
