import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const PortfolioContext = createContext(null);

// Fallback static data used while loading or if Supabase isn't configured yet
const FALLBACK = {
  profile: {
    name: 'Ritesh Sharma', title: 'Web Developer',
    bio: [
      "I'm a Software Developer with 2 years of experience in building scalable web applications using Laravel, PHP, JavaScript, MySQL, and MongoDB.",
      'Passionate about problem-solving, I enjoy turning complex requirements into user-friendly digital solutions.'
    ],
    email: 'riteshsharma89508@gmail.com', phone: '+91 89508-30269',
    birthday: 'March 18, 2003', location: 'Sector 18/492 Huda Kaithal, Haryana, India',
    avatar_url: '/assets/images/my-avatar.jpeg', resume_url: null, available: true,
  },
  socials: [
    { id: '1', name: 'LinkedIn', url: 'https://www.linkedin.com/in/ritesh-sharma-a22720281', icon: 'LinkedIn' },
    { id: '2', name: 'Twitter', url: 'https://x.com/Ritesh12121', icon: 'Twitter' },
    { id: '3', name: 'Instagram', url: 'https://www.instagram.com/ritesh.returns', icon: 'Instagram' },
  ],
  services: [
    { id: '1', title: 'Web Development', description: 'High-quality development of sites at the professional level.', icon: 'Globe' },
    { id: '2', title: 'Mobile Apps API', description: 'Professional API development of applications for iOS and Android.', icon: 'Smartphone' },
  ],
  skills: [
    { id: '1', name: 'PHP', level: 90 }, { id: '2', name: 'Laravel', level: 90 },
    { id: '3', name: 'React Js', level: 70 }, { id: '4', name: 'Node Js', level: 70 },
    { id: '5', name: 'JavaScript', level: 80 }, { id: '6', name: 'WordPress', level: 50 },
    { id: '7', name: 'AWS', level: 60 }, { id: '8', name: 'Python', level: 40 },
  ],
  education: [
    { id: '1', institution: 'Swami Vivekananda Institute of Engineering and Technology', duration: '2020 — 2025', detail: 'CGPA: 8.29' },
    { id: '2', institution: 'Government Sr. Sec. School, Shergarh(Kaithal)', duration: '2018 — 2020', detail: 'Percent: 78%' },
  ],
  experience: [
    { id: '1', company: 'smartData Enterprises Ltd.', role: 'Software Developer', duration: '2023 — Present', description: 'Developing and maintenance of web applications using PHP and Laravel. Collaborating to design and implement new features. Optimizing performance and integrating 3rd party services like Stripe, Google Maps, etc.' },
    { id: '2', company: 'Maruti Suzuki India Ltd.', role: 'Database Trainee', duration: 'Aug 2023 — 15 Sep 2023', description: 'Database trainee focusing on optimization and data management.' },
  ],
  projects: [
    { id: '1', title: 'LinkedIn Post Generator', description: 'An AI-powered tool helps users quickly generate and customize engaging LinkedIn posts.', image_url: '/assets/images/LPG_logo.png', project_url: 'https://linkedin-post-generator-coral.vercel.app/', category: 'Web App' },
    { id: '2', title: 'Ambayo', description: 'A marketplace application with multiple roles, subscription models with Stripe/Crypto, and Ambayo Wallet integration.', image_url: '/assets/images/ambayo_logo.ico', project_url: 'https://ambayo.com/', category: 'Marketplace' },
  ],
};

async function fetchAll() {
  const [profile, socials, services, skills, education, experience, projects] = await Promise.all([
    supabase.from('profile').select('*').single(),
    supabase.from('socials').select('*').order('sort_order'),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
    supabase.from('education').select('*').order('sort_order'),
    supabase.from('experience').select('*').order('sort_order'),
    supabase.from('projects').select('*').order('sort_order'),
  ]);
  return {
    profile: profile.data || FALLBACK.profile,
    socials: socials.data?.length ? socials.data : FALLBACK.socials,
    services: services.data?.length ? services.data : FALLBACK.services,
    skills: skills.data?.length ? skills.data : FALLBACK.skills,
    education: education.data?.length ? education.data : FALLBACK.education,
    experience: experience.data?.length ? experience.data : FALLBACK.experience,
    projects: projects.data?.length ? projects.data : FALLBACK.projects,
  };
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const result = await fetchAll();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading, refresh }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
