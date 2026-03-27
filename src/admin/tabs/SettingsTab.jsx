import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { invalidateSettingsCache } from '../../lib/settings';

const SETTING_DEFINITIONS = [
  {
    key: 'cloudinary_cloud_name',
    label: 'Cloudinary Cloud Name',
    envFallback: 'VITE_CLOUDINARY_CLOUD_NAME',
    placeholder: 'e.g. my-cloud-name',
    description: 'Your Cloudinary cloud name for image/file uploads.',
    group: 'Cloudinary',
  },
  {
    key: 'cloudinary_upload_preset',
    label: 'Cloudinary Upload Preset',
    envFallback: 'VITE_CLOUDINARY_UPLOAD_PRESET',
    placeholder: 'e.g. my-unsigned-preset',
    description: 'Unsigned upload preset configured in Cloudinary.',
    group: 'Cloudinary',
  },
  {
    key: 'web3forms_access_key',
    label: 'Web3Forms Access Key',
    envFallback: 'VITE_WEB3FORMS_ACCESS_KEY',
    placeholder: 'e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    description: 'Access key from web3forms.com for the contact form.',
    group: 'Web3Forms',
  },
  {
    key: 'supabase_anon_key',
    label: 'Supabase Anon Key',
    envFallback: 'VITE_SUPABASE_ANON_KEY',
    placeholder: 'e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    description: 'Anon key from Supabase for the Database.',
    group: 'Database',
  },
  {
    key: 'supabase_url',
    label: 'Supabase URL',
    envFallback: 'VITE_SUPABASE_URL',
    placeholder: 'e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    description: 'Supabase URL for the Database.',
    group: 'Database',
  },
];

const SettingsTab = () => {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showValues, setShowValues] = useState({});

  // Load current settings from DB
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value, label');
        if (error) throw error;

        const map = {};
        (data || []).forEach((row) => {
          map[row.key] = row.value || '';
        });
        setValues(map);
      } catch (err) {
        console.warn('Could not load settings:', err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleShow = (key) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const upserts = SETTING_DEFINITIONS.map((def) => ({
        key: def.key,
        value: values[def.key] || '',
        label: def.label,
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(upserts, { onConflict: 'key' });

      if (error) throw error;

      invalidateSettingsCache();
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: '#8b949e', fontSize: 14, padding: 20 }}>Loading settings...</div>;
  }

  // Group settings
  const groups = {};
  SETTING_DEFINITIONS.forEach((def) => {
    if (!groups[def.group]) groups[def.group] = [];
    groups[def.group].push(def);
  });

  return (
    <div>
      <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Site Settings</h3>
      <p style={{ fontSize: 13, color: '#8b949e', marginBottom: 24, lineHeight: 1.6 }}>
        Manage your third-party API keys here. These values are stored securely in the database and
        override any <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>.env</code> file values.
      </p>

      {message && (
        <div
          style={{
            background: message.type === 'error' ? '#f8514922' : '#23863622',
            border: `1px solid ${message.type === 'error' ? '#f85149' : '#238636'}`,
            color: message.type === 'error' ? '#f85149' : '#3fb950',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
          }}
        >
          {message.text}
        </div>
      )}

      {/* Info banner */}
      <div
        style={{
          background: '#1f6feb11',
          border: '1px solid #1f6feb33',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <InfoIcon />
        <div style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6 }}>
          <strong style={{ color: '#58a6ff' }}>Note:</strong> All the URL's and Keys are loaded from database directly. Only Supabase URL and Anon Key are fetched
          from the <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>.env</code> file
          at build time and in case of development the Keys can be copied from here.
        </div>
      </div>

      {Object.entries(groups).map(([groupName, defs]) => (
        <div key={groupName} style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#58a6ff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {groupName === 'Cloudinary' ? <CloudIcon /> : <MailIcon />}
            {groupName}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {defs.map((def) => (
              <div key={def.key}>
                <label className="form-label">{def.label}</label>
                <p style={{ fontSize: 12, color: '#484f58', marginBottom: 6, lineHeight: 1.5 }}>
                  {def.description}
                </p>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    type={showValues[def.key] ? 'text' : 'password'}
                    placeholder={def.placeholder}
                    value={values[def.key] || ''}
                    onChange={(e) => handleChange(def.key, e.target.value)}
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(def.key)}
                    title={showValues[def.key] ? 'Hide' : 'Show'}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8b949e',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showValues[def.key] ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {/* Show env fallback hint */}
                {!values[def.key] && import.meta.env[def.envFallback] && (
                  <p style={{ fontSize: 11, color: '#3fb950', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckIcon /> Using value from .env ({def.envFallback})
                  </p>
                )}
              </div>
            ))}
          </div>

          {groupName !== Object.keys(groups).at(-1) && (
            <div className="divider" style={{ margin: '24px 0 0 0' }} />
          )}
        </div>
      ))}

      <button
        className="btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: 8 }}
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

/* ─── Icons ──────────────────────────────────────────── */
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
  </svg>
);

const CloudIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" x2="23" y1="1" y2="23" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default SettingsTab;
