import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { openUploadWidget } from '../../lib/cloudinary';
import { usePortfolio } from '../../hooks/usePortfolioData';

const ProjectsTab = () => {
  const { projects, refresh } = usePortfolio();
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    image_url: '', 
    project_url: '', 
    category: 'Web App', 
    sort_order: 0 
  });

  useEffect(() => {
    if (editingProject) setFormData(editingProject);
    else setFormData({ title: '', description: '', image_url: '', project_url: '', category: 'Web App', sort_order: (projects?.length || 0) });
  }, [editingProject, projects]);

  const handleImageUpload = () => {
    openUploadWidget('image', (url) => {
      setFormData((prev) => ({ ...prev, image_url: url }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('projects').upsert(formData);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Project saved successfully!' });
      setEditingProject(null);
      refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else {
      setMessage({ type: 'success', text: 'Project deleted successfully!' });
      refresh();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Manage Projects</h3>
      
      {message && (
        <div style={{ background: message.type === 'error' ? '#f8514922' : '#23863622', border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`, color: message.type === 'error' ? '#f85149' : '#3fb950', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label className="form-label">Title</label>
            <input className="form-input" type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="form-label">Category</label>
            <input className="form-input" type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="form-label">Live Project URL</label>
          <input className="form-input" type="url" value={formData.project_url} onChange={(e) => setFormData({...formData, project_url: e.target.value})} required />
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {formData.image_url && <img src={formData.image_url} alt="ProjectThumbnail" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />}
          <button type="button" onClick={handleImageUpload} className="btn-secondary">Upload Project Image</button>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Project'}</button>
          {editingProject && <button type="button" onClick={() => setEditingProject(null)} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {(projects || []).map((project) => (
          <div key={project.id} className="card card-hover" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img src={project.image_url} alt={project.title} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>{project.title}</span>
              <span style={{ fontSize: '12px', color: '#8b949e' }}>{project.category}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setEditingProject(project)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px' }}>Edit</button>
              <button onClick={() => handleDelete(project.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', color: '#f85149', borderColor: '#f8514922' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
