import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { usePortfolio } from '../../hooks/usePortfolioData';

const ExperienceTab = () => {
  const { education, experience, refresh } = usePortfolio();
  const [editingExperience, setEditingExperience] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formDataExp, setFormDataExp] = useState({ company: '', role: '', duration: '', description: '', sort_order: 0 });
  const [formDataEdu, setFormDataEdu] = useState({ institution: '', duration: '', detail: '', sort_order: 0 });

  useEffect(() => {
    if (editingExperience) setFormDataExp(editingExperience);
    else setFormDataExp({ company: '', role: '', duration: '', description: '', sort_order: (experience?.length || 0) });
  }, [editingExperience, experience]);

  useEffect(() => {
    if (editingEducation) setFormDataEdu(editingEducation);
    else setFormDataEdu({ institution: '', duration: '', detail: '', sort_order: (education?.length || 0) });
  }, [editingEducation, education]);

  const handleSubmitExp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('experience').upsert(formDataExp);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Experience saved successfully!' });
      setEditingExperience(null);
      refresh();
    }
    setLoading(false);
  };

  const handleSubmitEdu = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('education').upsert(formDataEdu);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Education saved successfully!' });
      setEditingEducation(null);
      refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (table, id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Deleted successfully!' });
      refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Manage Experience & Education</h3>
      
      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      {/* Experience Section */}
      <div style={{ marginBottom: '48px' }}>
        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Experience</h4>
        <form onSubmit={handleSubmitExp} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 600 }}>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Company</label>
              <input className="form-input" type="text" value={formDataExp.company} onChange={(e) => setFormDataExp({...formDataExp, company: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">Role</label>
              <input className="form-input" type="text" value={formDataExp.role} onChange={(e) => setFormDataExp({...formDataExp, role: e.target.value})} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Duration</label>
              <input className="form-input" type="text" value={formDataExp.duration} onChange={(e) => setFormDataExp({...formDataExp, duration: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={4} value={formDataExp.description} onChange={(e) => setFormDataExp({...formDataExp, description: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Experience'}</button>
            {editingExperience && <button type="button" onClick={() => setEditingExperience(null)} className="btn-secondary">Cancel</button>}
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(experience || []).map((exp) => (
            <div key={exp.id} className="card card-hover" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{exp.role} @ {exp.company}</span>
                <span style={{ fontSize: '12px', color: '#8b949e', marginLeft: '12px' }}>{exp.duration}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingExperience(exp)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                <button onClick={() => handleDelete('experience', exp.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: '#f85149', borderColor: '#f8514922' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Education Section */}
      <div>
        <h4 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Education</h4>
        <form onSubmit={handleSubmitEdu} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: 600 }}>{editingEducation ? 'Edit Education' : 'Add New Education'}</h5>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Institution</label>
              <input className="form-input" type="text" value={formDataEdu.institution} onChange={(e) => setFormDataEdu({...formDataEdu, institution: e.target.value})} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label className="form-label">Duration</label>
              <input className="form-input" type="text" value={formDataEdu.duration} onChange={(e) => setFormDataEdu({...formDataEdu, duration: e.target.value})} required />
            </div>
            <div>
              <label className="form-label">Detail/CGPA</label>
              <input className="form-input" type="text" value={formDataEdu.detail} onChange={(e) => setFormDataEdu({...formDataEdu, detail: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Education'}</button>
            {editingEducation && <button type="button" onClick={() => setEditingEducation(null)} className="btn-secondary">Cancel</button>}
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(education || []).map((edu) => (
            <div key={edu.id} className="card card-hover" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{edu.institution}</span>
                <span style={{ fontSize: '12px', color: '#8b949e', marginLeft: '12px' }}>{edu.duration}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setEditingEducation(edu)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
                <button onClick={() => handleDelete('education', edu.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: '#f85149', borderColor: '#f8514922' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;
