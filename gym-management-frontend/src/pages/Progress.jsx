import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  saveProgress, getAllProgress,
  getWeeklyProgress, getMonthlyProgress, getTotalWorkoutDays
} from '../api/progressApi';

const Progress = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState('overview');
  const [allProgress, setAllProgress] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalWorkoutDays, setTotalWorkoutDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    userId,
    date: new Date().toISOString().split('T')[0],
    weight: '',
    caloriesBurned: '',
    waterIntake: '',
    workoutDone: false,
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
  });

  useEffect(() => { if (userId) fetchAll(); }, [userId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allRes, weekRes, monthRes, wdRes] = await Promise.allSettled([
        getAllProgress(userId),
        getWeeklyProgress(userId),
        getMonthlyProgress(userId),
        getTotalWorkoutDays(userId),
      ]);
      if (allRes.status === 'fulfilled') setAllProgress(Array.isArray(allRes.value.data) ? allRes.value.data : []);
      if (weekRes.status === 'fulfilled') setWeeklyData(Array.isArray(weekRes.value.data) ? weekRes.value.data : []);
      if (monthRes.status === 'fulfilled') setMonthlyData(Array.isArray(monthRes.value.data) ? monthRes.value.data : []);
      if (wdRes.status === 'fulfilled') setTotalWorkoutDays(wdRes.value.data || 0);
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await saveProgress({ ...form, userId });
      setSuccess('Progress saved! ✅');
      fetchAll();
      setActiveTab('overview');
    } catch (err) { setError(err.response?.data?.error || 'Failed to save'); }
    finally { setLoading(false); }
  };

  // Latest stats
  const latest = allProgress[allProgress.length - 1];
  const prev = allProgress[allProgress.length - 2];
  const weightChange = latest && prev ? (latest.weight - prev.weight).toFixed(1) : null;

  // Monthly chart bars
  const maxCal = Math.max(...monthlyData.map(d => d.caloriesBurned || 0), 1);
  const maxWeight = Math.max(...monthlyData.map(d => d.weight || 0), 1);
  const minWeight = Math.min(...monthlyData.filter(d => d.weight).map(d => d.weight), maxWeight);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'weekly', label: '📅 Weekly' },
    { id: 'monthly', label: '📈 Monthly' },
    { id: 'log', label: '✍️ Log Today' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .p-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#3b82f6,#1d4ed8); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(59,130,246,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .stat-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-2px); }
        .fit-input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; transition: all 0.2s; }
        .fit-input::placeholder { color: rgba(255,255,255,0.25); }
        .fit-input:focus { border-color: #3b82f6; background: rgba(59,130,246,0.08); }
        .fit-input[type='date']::-webkit-calendar-picker-indicator { filter: invert(1); }
        .primary-btn { padding: 11px 24px; background: linear-gradient(135deg,#3b82f6,#1d4ed8); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; box-shadow: 0 4px 15px rgba(59,130,246,0.25); }
        .primary-btn:hover { transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .bar { border-radius: 4px 4px 0 0; transition: height 0.6s ease; cursor: pointer; position: relative; }
        .bar:hover { opacity: 0.8; }
        .toggle-track { width: 44px; height: 24px; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative; flex-shrink: 0; }
        .toggle-thumb { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; transition: left 0.2s; }
        @media (max-width: 768px) {
          .p-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; backdrop-filter: blur(4px); }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
          .overview-grid { grid-template-columns: 1fr !important; }
          .log-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>📊 PROGRESS</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="p-main">
        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>📊 Progress Tracking</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Weight, Calories, Measurements track करा</p>
          </div>
          <button className="primary-btn" onClick={() => setActiveTab('log')} style={{ fontSize: 13, padding: '9px 16px' }}>✍️ Log Today</button>
        </div>

        {/* Alerts */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{success}</div>}
        {error && <div className="fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="fade-up">
            {/* Top Stats */}
            <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '⚖️', label: 'Current Weight', val: latest?.weight ? `${latest.weight} kg` : '--', sub: weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange} kg` : 'No change', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', positive: weightChange < 0 },
                { icon: '🔥', label: 'Calories Burned', val: latest?.caloriesBurned ? `${latest.caloriesBurned}` : '--', sub: 'Latest record', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
                { icon: '💪', label: 'Workout Days', val: totalWorkoutDays, sub: 'Total completed', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { icon: '💧', label: 'Water Intake', val: latest?.waterIntake ? `${(latest.waterIntake / 1000).toFixed(1)}L` : '--', sub: 'Latest record', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
              ].map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                    {weightChange && i === 0 && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: weightChange < 0 ? '#10b981' : '#ef4444', background: weightChange < 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 99 }}>
                        {weightChange > 0 ? '↑' : '↓'} {Math.abs(weightChange)} kg
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: s.color, marginTop: 2, fontWeight: 600 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Measurements + Recent Records */}
            <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Body Measurements */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📏 Body Measurements</h3>
                {latest ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Chest', val: latest.chest, icon: '🫁', color: '#ef4444' },
                      { label: 'Waist', val: latest.waist, icon: '⭕', color: '#f59e0b' },
                      { label: 'Arms', val: latest.arms, icon: '💪', color: '#3b82f6' },
                      { label: 'Thighs', val: latest.thighs, icon: '🦵', color: '#a78bfa' },
                    ].map((m, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{m.icon}</div>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{m.val || '--'} <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>cm</span></div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📏</div>
                    <div style={{ fontSize: 13 }}>कोणताही record नाही</div>
                    <button className="primary-btn" style={{ marginTop: 12, fontSize: 12, padding: '8px 16px' }} onClick={() => setActiveTab('log')}>✍️ Log Now</button>
                  </div>
                )}
              </div>

              {/* Recent Records */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>🗓️ Recent Records</h3>
                {allProgress.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>कोणताही record नाही</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
                    {[...allProgress].reverse().slice(0, 8).map((rec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: rec.workoutDone ? '#10b981' : '#ef4444', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{rec.date}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{rec.workoutDone ? '✅ Workout Done' : '❌ Rest Day'}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{rec.weight} kg</div>
                          <div style={{ fontSize: 11, color: '#f97316' }}>{rec.caloriesBurned} cal</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── WEEKLY ── */}
        {activeTab === 'weekly' && (
          <div className="fade-up">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📅 This Week — Calories Burned</h3>
              {weeklyData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                  <div>या आठवड्यात कोणताही record नाही</div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingBottom: 30, position: 'relative' }}>
                  {weeklyData.map((d, i) => {
                    const maxC = Math.max(...weeklyData.map(x => x.caloriesBurned || 0), 1);
                    const pct = maxC > 0 ? ((d.caloriesBurned || 0) / maxC) * 100 : 0;
                    const day = new Date(d.date).toLocaleDateString('en', { weekday: 'short' });
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: 11, color: '#f97316', fontWeight: 700 }}>{d.caloriesBurned || 0}</div>
                        <div className="bar" style={{ width: '100%', height: `${Math.max(pct, 4)}%`, background: d.workoutDone ? 'linear-gradient(180deg,#f97316,#ea580c)' : 'rgba(255,255,255,0.08)', minHeight: 6 }} />
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{day}</div>
                        <div style={{ fontSize: 14 }}>{d.workoutDone ? '✅' : '😴'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Weekly table */}
            {weeklyData.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, overflowX: 'auto' }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>📋 Weekly Data</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Date', 'Weight', 'Calories', 'Water', 'Workout'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyData.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 600 }}>{d.date}</td>
                        <td style={{ padding: '10px 12px', color: '#3b82f6', fontWeight: 700 }}>{d.weight} kg</td>
                        <td style={{ padding: '10px 12px', color: '#f97316', fontWeight: 700 }}>{d.caloriesBurned}</td>
                        <td style={{ padding: '10px 12px', color: '#a78bfa' }}>{d.waterIntake ? `${(d.waterIntake / 1000).toFixed(1)}L` : '--'}</td>
                        <td style={{ padding: '10px 12px' }}>{d.workoutDone ? <span style={{ color: '#10b981', fontWeight: 700 }}>✅ Done</span> : <span style={{ color: '#ef4444' }}>❌ Rest</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MONTHLY ── */}
        {activeTab === 'monthly' && (
          <div className="fade-up">
            {/* Weight Progress Chart */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>📈 Weight Progress (This Month)</h3>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{monthlyData.length} records</span>
              </div>
              {monthlyData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📈</div>
                  <div>या महिन्यात कोणताही record नाही</div>
                </div>
              ) : (
                <div style={{ position: 'relative', height: 180, overflowX: 'auto' }}>
                  <svg width="100%" height="180" viewBox={`0 0 ${Math.max(monthlyData.length * 40, 400)} 180`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {monthlyData.filter(d => d.weight).length > 1 && (() => {
                      const pts = monthlyData.filter(d => d.weight).map((d, i, arr) => {
                        const x = (i / (arr.length - 1)) * (Math.max(monthlyData.length * 40, 400) - 40) + 20;
                        const y = 160 - ((d.weight - minWeight) / (maxWeight - minWeight + 0.1)) * 140;
                        return `${x},${y}`;
                      });
                      const areaPath = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')} L ${pts[pts.length - 1].split(',')[0]},160 L 20,160 Z`;
                      const linePath = `M ${pts[0]} ${pts.slice(1).map(p => `L ${p}`).join(' ')}`;
                      return (
                        <>
                          <path d={areaPath} fill="url(#wGrad)" />
                          <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          {monthlyData.filter(d => d.weight).map((d, i, arr) => {
                            const x = (i / (arr.length - 1)) * (Math.max(monthlyData.length * 40, 400) - 40) + 20;
                            const y = 160 - ((d.weight - minWeight) / (maxWeight - minWeight + 0.1)) * 140;
                            return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" stroke="#0f0f1a" strokeWidth="2" />;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              )}
            </div>

            {/* Monthly Calories Chart */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>🔥 Monthly Calories Burned</h3>
              {monthlyData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No data</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, overflowX: 'auto' }}>
                  {monthlyData.map((d, i) => {
                    const pct = ((d.caloriesBurned || 0) / maxCal) * 100;
                    return (
                      <div key={i} title={`${d.date}: ${d.caloriesBurned} cal`} style={{ flex: '0 0 auto', width: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '100%', height: `${Math.max(pct, 3)}%`, background: d.workoutDone ? 'linear-gradient(180deg,#f97316,#ea580c)' : 'rgba(255,255,255,0.06)', borderRadius: '3px 3px 0 0', minHeight: 4, transition: 'height 0.5s ease' }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LOG TODAY ── */}
        {activeTab === 'log' && (
          <div className="fade-up">
            <form onSubmit={handleSubmit}>
              {/* Basic Info */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📅 Daily Stats</h3>
                <div className="log-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
                  {[
                    { label: 'Date', field: 'date', type: 'date' },
                    { label: 'Weight (kg)', field: 'weight', type: 'number', placeholder: '70.5' },
                    { label: 'Calories Burned', field: 'caloriesBurned', type: 'number', placeholder: '350' },
                    { label: 'Water Intake (ml)', field: 'waterIntake', type: 'number', placeholder: '2500' },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.label}</label>
                      <input className="fit-input" type={f.type} placeholder={f.placeholder} value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} required={f.field !== 'weight'} />
                    </div>
                  ))}
                </div>

                {/* Workout Done toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>💪 Workout Done Today?</label>
                  <div className="toggle-track" style={{ background: form.workoutDone ? '#10b981' : 'rgba(255,255,255,0.1)' }} onClick={() => setForm({ ...form, workoutDone: !form.workoutDone })}>
                    <div className="toggle-thumb" style={{ left: form.workoutDone ? '23px' : '3px' }} />
                  </div>
                  <span style={{ fontSize: 13, color: form.workoutDone ? '#10b981' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{form.workoutDone ? 'Yes! 💪' : 'No'}</span>
                </div>
              </div>

              {/* Body Measurements */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📏 Body Measurements (Optional)</h3>
                <div className="log-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
                  {[
                    { label: '🫁 Chest (cm)', field: 'chest', placeholder: '95' },
                    { label: '⭕ Waist (cm)', field: 'waist', placeholder: '80' },
                    { label: '💪 Arms (cm)', field: 'arms', placeholder: '35' },
                    { label: '🦵 Thighs (cm)', field: 'thighs', placeholder: '55' },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.label}</label>
                      <input className="fit-input" type="number" placeholder={f.placeholder} value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>

              <button className="primary-btn" type="submit" disabled={loading} style={{ padding: '13px 30px', fontSize: 15 }}>
                {loading ? '⏳ Saving...' : '💾 Save Progress'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;