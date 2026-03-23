import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminApp = () => {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#8b949e', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="login" element={!session ? <AdminLogin /> : <Navigate to="/admin" replace />} />
      <Route path="*" element={session ? <AdminDashboard session={session} /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminApp;
