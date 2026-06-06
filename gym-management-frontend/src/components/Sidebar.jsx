import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/workout', icon: '💪', label: 'Workout Plans' },
  { path: '/diet', icon: '🥗', label: 'Diet Plans' },
  { path: '/progress', icon: '📊', label: 'Progress' },
  { path: '/bmi', icon: '🧮', label: 'BMI Calculator' },
  { path: '/challenges', icon: '🏆', label: 'Challenges' },
  { path: '/membership', icon: '🎫', label: 'Membership' },
  { path: '/trainer', icon: '🏋️', label: 'Trainer Support' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const allItems = [
    ...menuItems,
    ...(user?.role === 'ADMIN' ? [{ path: '/admin', icon: '👑', label: 'Admin Panel' }] : []),
  ];

  return (
    <>
      <style>{`
        .sidebar {
          width: 240px; min-height: 100vh;
          background: #12122a;
          display: flex; flex-direction: column;
          position: fixed; left: 0; top: 0; z-index: 1000;
          border-right: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.3s ease;
        }
        .nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px; color: rgba(255,255,255,0.5);
          text-decoration: none; font-size: 13.5px; font-weight: 500;
          border-radius: 0; transition: all 0.2s;
          border-left: 3px solid transparent;
          font-family: 'Barlow', sans-serif;
        }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .nav-link.active {
          color: #fff; background: rgba(124,58,237,0.12);
          border-left: 3px solid #7c3aed;
        }
        .nav-icon { font-size: 16px; width: 20px; text-align: center; }
        .logout-btn {
          margin: 16px; padding: 11px 16px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.2);
          color: #f87171; border-radius: 10px; cursor: pointer;
          font-size: 13px; font-weight: 600; text-align: left;
          display: flex; align-items: center; gap: 10px;
          font-family: 'Barlow', sans-serif; transition: all 0.2s;
        }
        .logout-btn:hover { background: rgba(220,38,38,0.2); }
        @media (max-width: 768px) {
          .sidebar { transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'}; }
        }
      `}</style>

      <div className="sidebar">
        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" }}>FZ</div>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2 }}>FITZONE</span>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '14px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: '#7c3aed', fontWeight: 700, marginTop: 1 }}>{user?.role} Member</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
          {allItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;