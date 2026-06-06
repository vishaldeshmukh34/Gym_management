import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  getAllUsers, deleteUser,
} from '../api/userApi';
import {
  getAllTrainers, getActiveTrainers,
} from '../api/trainerApi';
import {
  getAllActiveMemberships, getAllMemberships,
} from '../api/membershipApi';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, trainersRes, membershipsRes] = await Promise.allSettled([
        getAllUsers(),
        getAllTrainers(),
        getAllMemberships(),
      ]);
      if (usersRes.status === 'fulfilled') setUsers(Array.isArray(usersRes.value.data) ? usersRes.value.data : []);
      if (trainersRes.status === 'fulfilled') setTrainers(Array.isArray(trainersRes.value.data) ? trainersRes.value.data : []);
      if (membershipsRes.status === 'fulfilled') setMemberships(Array.isArray(membershipsRes.value.data) ? membershipsRes.value.data : []);
    } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('User delete करायचा आहे का?')) return;
    try {
      await deleteUser(id);
      setSuccess('User deleted! ✅');
      setUsers(prev => prev.filter(u => u.id !== id));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.error || 'Failed'); }
  };

  // Stats
  const totalRevenue = memberships.reduce((s, m) => s + (m.amount || 0), 0);
  const activeMemberships = memberships.filter(m => m.status === 'ACTIVE').length;
  const activeTrainers = trainers.filter(t => t.status === 'ACTIVE').length;
  const memberUsers = users.filter(u => u.role === 'USER' || u.role === 'MEMBER').length;

  const ROLE_COLOR = { ADMIN: '#ef4444', TRAINER: '#3b82f6', USER: '#10b981', MEMBER: '#10b981' };
  const STATUS_COLOR = { ACTIVE: '#10b981', EXPIRED: '#f59e0b', CANCELLED: '#ef4444' };

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'users',     label: `👥 Users (${users.length})` },
    { id: 'trainers',  label: `🏋️ Trainers (${trainers.length})` },
    { id: 'memberships', label: `🎫 Memberships (${memberships.length})` },
    { id: 'revenue',   label: '💰 Revenue' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .ad-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .stat-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-2px); }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { padding: 12px 14px; text-align: left; color: rgba(255,255,255,0.4); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        td { padding: 12px 14px; color: rgba(255,255,255,0.8); border-bottom: 1px solid rgba(255,255,255,0.04); }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .del-btn { padding: 5px 10px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 700; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .del-btn:hover { background: rgba(239,68,68,0.2); }
        .badge { display: inline-flex; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
        @media (max-width: 768px) {
          .ad-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rev-grid { grid-template-columns: 1fr !important; }
          .table-wrap { overflow-x: auto; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>👑 ADMIN PANEL</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="ad-main">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>👑 Admin Dashboard</h1>
            <span style={{ padding: '4px 12px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>ADMIN</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Gym management — users, trainers, memberships, revenue</p>
        </div>

        {/* Alerts */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}
        {error && <div className="fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <div className="fade-up">
            {/* Stats */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: '👥', label: 'Total Users',    val: users.length,       color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   sub: `${memberUsers} members` },
                { icon: '🏋️', label: 'Trainers',       val: trainers.length,    color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', sub: `${activeTrainers} active` },
                { icon: '🎫', label: 'Memberships',    val: memberships.length, color: '#10b981', bg: 'rgba(16,185,129,0.1)',   sub: `${activeMemberships} active` },
                { icon: '💰', label: 'Total Revenue',  val: `₹${totalRevenue.toLocaleString()}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', sub: 'All time' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                    <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.sub}</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Users + Memberships */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Recent Users */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>👥 Recent Users</h3>
                  <button className="tab-btn" onClick={() => setActiveTab('users')} style={{ padding: '4px 12px', fontSize: 11 }}>View All</button>
                </div>
                {users.slice(0, 5).map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {u.email?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name || u.email}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{u.email}</div>
                    </div>
                    <span className="badge" style={{ background: `${ROLE_COLOR[u.role]}20`, color: ROLE_COLOR[u.role] }}>{u.role}</span>
                  </div>
                ))}
              </div>

              {/* Recent Memberships */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>🎫 Recent Memberships</h3>
                  <button className="tab-btn" onClick={() => setActiveTab('memberships')} style={{ padding: '4px 12px', fontSize: 11 }}>View All</button>
                </div>
                {memberships.slice(0, 5).map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{m.planName} Plan</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Expires: {m.expiryDate}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>₹{m.amount?.toLocaleString()}</div>
                      <span className="badge" style={{ background: `${STATUS_COLOR[m.status] || '#888'}20`, color: STATUS_COLOR[m.status] || '#888', fontSize: 10, marginTop: 2 }}>{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {activeTab === 'users' && (
          <div className="fade-up">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>👥 All Users ({users.length})</h3>
                <button onClick={fetchAll} style={{ padding: '7px 14px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: "'Barlow',sans-serif" }}>🔄 Refresh</button>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>#{u.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                              {u.email?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600 }}>{u.name || '—'}</span>
                          </div>
                        </td>
                        <td style={{ color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                        <td><span className="badge" style={{ background: `${ROLE_COLOR[u.role]}20`, color: ROLE_COLOR[u.role] }}>{u.role}</span></td>
                        <td>
                          {u.id !== user?.id && (
                            <button className="del-btn" onClick={() => handleDeleteUser(u.id)}>🗑️ Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No users found</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── TRAINERS ── */}
        {activeTab === 'trainers' && (
          <div className="fade-up">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏋️ All Trainers ({trainers.length})</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Specialization</th><th>Experience</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {trainers.map(t => (
                      <tr key={t.id}>
                        <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>#{t.id}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                              {t.trainerName?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600 }}>{t.trainerName}</span>
                          </div>
                        </td>
                        <td style={{ color: 'rgba(255,255,255,0.6)' }}>{t.email}</td>
                        <td><span className="badge" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>{t.specialization?.replace(/_/g, ' ')}</span></td>
                        <td style={{ color: 'rgba(255,255,255,0.6)' }}>{t.experience}</td>
                        <td><span className="badge" style={{ background: t.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: t.status === 'ACTIVE' ? '#34d399' : '#f87171' }}>{t.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {trainers.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No trainers found</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── MEMBERSHIPS ── */}
        {activeTab === 'memberships' && (
          <div className="fade-up">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🎫 All Memberships ({memberships.length})</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Plan</th><th>Amount</th><th>Start Date</th><th>Expiry</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {memberships.map(m => (
                      <tr key={m.id}>
                        <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>#{m.id}</td>
                        <td><span style={{ fontWeight: 700, color: '#fff' }}>{m.planName}</span></td>
                        <td style={{ color: '#f59e0b', fontWeight: 700 }}>₹{m.amount?.toLocaleString()}</td>
                        <td style={{ color: 'rgba(255,255,255,0.6)' }}>{m.startDate}</td>
                        <td style={{ color: 'rgba(255,255,255,0.6)' }}>{m.expiryDate}</td>
                        <td><span className="badge" style={{ background: `${STATUS_COLOR[m.status] || '#888'}20`, color: STATUS_COLOR[m.status] || '#888' }}>{m.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {memberships.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No memberships found</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {activeTab === 'revenue' && (
          <div className="fade-up">
            {/* Revenue Cards */}
            <div className="rev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: '💰', label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                { icon: '📈', label: 'Active Members', val: activeMemberships, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { icon: '📊', label: 'Avg Per Member', val: memberships.length > 0 ? `₹${Math.round(totalRevenue / memberships.length).toLocaleString()}` : '₹0', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Plan Breakdown */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📊 Revenue by Plan</h3>
              {['MONTHLY', 'QUARTERLY', 'YEARLY'].map(plan => {
                const planMem = memberships.filter(m => m.planName === plan);
                const planRev = planMem.reduce((s, m) => s + (m.amount || 0), 0);
                const pct = totalRevenue > 0 ? Math.round((planRev / totalRevenue) * 100) : 0;
                const colors = { MONTHLY: '#3b82f6', QUARTERLY: '#7c3aed', YEARLY: '#f59e0b' };
                return (
                  <div key={plan} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{plan}</span>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{planMem.length} plans</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: colors[plan] }}>₹{planRev.toLocaleString()} ({pct}%)</span>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 99, height: 8 }}>
                      <div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${colors[plan]},${colors[plan]}88)`, width: `${pct}%`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {['ACTIVE', 'EXPIRED', 'CANCELLED'].map(status => {
                const count = memberships.filter(m => m.status === status).length;
                const rev = memberships.filter(m => m.status === status).reduce((s, m) => s + (m.amount || 0), 0);
                return (
                  <div key={status} className="stat-card" style={{ borderLeft: `3px solid ${STATUS_COLOR[status]}` }}>
                    <span className="badge" style={{ background: `${STATUS_COLOR[status]}20`, color: STATUS_COLOR[status], marginBottom: 10, display: 'inline-flex' }}>{status}</span>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{count}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>memberships</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: STATUS_COLOR[status], marginTop: 6 }}>₹{rev.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;