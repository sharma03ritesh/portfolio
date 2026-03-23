import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import About from './sections/About';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './layout/Footer';
import AdminApp from './admin/AdminApp';

const ResumeSection = () => (
  <><Experience /><div style={{ marginTop: 40 }}><Skills /></div></>
);

const SECTIONS = {
  about: About,
  resume: ResumeSection,
  projects: Projects,
  contact: Contact,
};

function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const ActiveComponent = SECTIONS[activeSection];

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', color: '#e6edf3' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 260, flexShrink: 0, minWidth: 0 }}>
            <Sidebar />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
              <div style={{ padding: '32px 28px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ActiveComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Portfolio />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
