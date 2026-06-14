import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  getAllNotifications, getUnreadNotifications,
  markAsRead, markAllRead,
  sendWorkoutReminder, sendWaterReminder,
  sendDietReminder,
} from '../api/notificationApi';

const NOTIF_META = {
  WORKOUT_REMINDER: { icon: '💪', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Workout' },
  WATER_REMINDER:   { icon: '💧', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   label: 'Water' },
  DIET_REMINDER:    { icon: '🥗', color: '#10b981', bg: 'rgba(16,185,129,0.1)',  label: 'Diet' },
  MEMBERSHIP_EXPIRY:{ icon: '🎫', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Membership' },
};

const Notifications = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => { if (userId) fetchNotifications(); }, [userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getAllNotifications(userId);
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch { setNotifications([]); }
    finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
    } catch { }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead(userId);
      setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
      setSuccess('सगळ्या notifications read झाल्या! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch { }
  };

  const handleSendReminder = async (type) => {
    setSending(type); setSuccess('');
    try {
      if (type === 'WORKOUT') await sendWorkoutReminder(userId);
      else if (type === 'WATER') await sendWaterReminder(userId);
      else if (type === 'DIET') await sendDietReminder(userId);
      setSuccess(`${type} reminder sent! 🔔`);
      setTimeout(() => setSuccess(''), 3000);
      fetchNotifications();
    } catch { }
    finally { setSending(null); }
  };

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length;
  const filtered = activeTab === 'unread'
    ? notifications.filter(n => n.status === 'UNREAD')
    : notifications;

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  const tabs = [
    { id: 'all',    label: `🔔 All (${notifications.length})` },
    { id: 'unread', label: `📬 Unread (${unreadCount})` },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .n-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; }
        .tab-btn:hover:not(.active) { color: #fff; }
        .notif-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 16px 18px; transition: all 0.2s; cursor: pointer; }
        .notif-card:hover { border-color: rgba(124,58,237,0.3); background: rgba(124,58,237,0.04); }
        .notif-card.unread { border-left: 3px solid #7c3aed; background: rgba(124,58,237,0.05); }
        .reminder-btn { padding: 12px 16px; border-radius: 12px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .reminder-btn:hover { transform: translateY(-2px); }
        .reminder-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .read-btn { padding: 5px 12px; background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2); color: #a78bfa; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 700; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .read-btn:hover { background: rgba(124,58,237,0.2); }
        @media (max-width: 768px) {
          .n-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .reminder-grid { grid-template-columns: 1fr 1fr !important; }
          .layout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🔔 NOTIFICATIONS</span>
        {unreadCount > 0 && <div style={{ width: 22, height: 22, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>{unreadCount}</div>}
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="n-main">
        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🔔 Notifications</h1>
              {unreadCount > 0 && (
                <div style={{ width: 26, height: 26, background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{unreadCount}</div>
              )}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Reminders, updates आणि alerts</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} style={{ padding: '9px 16px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Barlow',sans-serif" }}>
              ✅ Mark All Read
            </button>
          )}
        </div>

        {/* Success */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}

        <div className="layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          {/* Left — Notifications List */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {tabs.map(t => (
                <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🔔</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                  {activeTab === 'unread' ? 'कोणतीही unread notification नाही' : 'कोणतीही notification नाही'}
                </div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>उजव्या बाजूने reminder पाठवा!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(notif => {
                  const meta = NOTIF_META[notif.type] || { icon: '🔔', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'General' };
                  const isUnread = notif.status === 'UNREAD';
                  return (
                    <div key={notif.id} className={`notif-card ${isUnread ? 'unread' : ''}`} onClick={() => isUnread && handleMarkRead(notif.id)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        {/* Icon */}
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.bg, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                          {meta.icon}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: meta.bg, color: meta.color }}>{meta.label}</span>
                            {isUnread && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>NEW</span>}
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{formatTime(notif.createdAt)}</span>
                          </div>
                          <p style={{ color: isUnread ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                        </div>

                        {/* Read button */}
                        {isUnread && (
                          <button className="read-btn" onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}>
                            ✓ Read
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right — Send Reminders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Send Reminders */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📨 Send Reminder</h3>
              <div className="reminder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                {[
                  { type: 'WORKOUT', icon: '💪', label: 'Workout Reminder', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.3)' },
                  { type: 'WATER',   icon: '💧', label: 'Water Reminder',   color: '#06b6d4', bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.3)' },
                  { type: 'DIET',    icon: '🥗', label: 'Diet Reminder',    color: '#10b981', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
                ].map(r => (
                  <button key={r.type} className="reminder-btn"
                    disabled={sending === r.type}
                    onClick={() => handleSendReminder(r.type)}
                    style={{ background: r.bg, border: `1px solid ${r.border}`, color: r.color }}>
                    <span style={{ fontSize: 18 }}>{r.icon}</span>
                    <span>{sending === r.type ? 'Sending...' : r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📊 Summary</h3>
              {[
                { label: 'Total', val: notifications.length, color: '#a78bfa' },
                { label: 'Unread', val: unreadCount, color: '#ef4444' },
                { label: 'Read', val: notifications.length - unreadCount, color: '#10b981' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>🔔 {s.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Notification Types */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📋 Types</h3>
              {Object.entries(NOTIF_META).map(([type, meta]) => {
                const count = notifications.filter(n => n.type === type).length;
                return (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{meta.icon}</div>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 }}>{meta.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: meta.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;