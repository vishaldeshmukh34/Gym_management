import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { saveProfile, getProfile } from '../api/profileApi';
import { getTotalWorkoutDays } from '../api/progressApi';
import { getTotalPresentDays } from '../api/attendanceApi';
import { getActiveMembership } from '../api/membershipApi';

const FITNESS_GOALS = [
  { value: 'WEIGHT_LOSS',     label: 'Weight Loss',     icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { value: 'WEIGHT_GAIN',     label: 'Weight Gain',     icon: '💪', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { value: 'MUSCLE_BUILDING', label: 'Muscle Building', icon: '🏋️', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  { value: 'SIX_PACK',        label: 'Six Pack Abs',    icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { value: 'HOME_WORKOUT',    label: 'Home Workout',    icon: '🏠', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

const LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const LEVEL_COLOR = { BEGINNER: '#10b981', INTERMEDIATE: '#f59e0b', ADVANCED: '#ef4444' };

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [form, setForm] = useState({
    userId,
    fullName: '', age: '', gender: 'MALE',
    height: '', weight: '',
    fitnessLevel: 'BEGINNER', fitnessGoal: '',
  });

  const [stats, setStats] = useState({ workoutDays: 0, attendanceDays: 0, membership: null });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('info');

  useEffect(() => { if (userId) fetchAll(); }, [userId]);

  const fetchAll = async () => {
    setFetching(true);
    try {
      const [profRes, wdRes, attRes, memRes] = await Promise.allSettled([
        getProfile(userId),
        getTotalWorkoutDays(userId),
        getTotalPresentDays(userId),
        getActiveMembership(userId),
      ]);
      if (profRes.status === 'fulfilled') {
        const p = profRes.value.data;
        setForm({ userId, fullName: p.fullName || '', age: p.age || '', gender: p.gender || 'MALE', height: p.height || '', weight: p.weight || '', fitnessLevel: p.fitnessLevel || 'BEGINNER', fitnessGoal: p.fitnessGoal || '' });
      }
      setStats({
        workoutDays: wdRes.status === 'fulfilled' ? wdRes.value.data : 0,
        attendanceDays: attRes.status === 'fulfilled' ? attRes.value.data : 0,
        membership: memRes.status === 'fulfilled' ? memRes.value.data : null,
      });
    } finally { setFetching(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await saveProfile({ ...form, userId });
      setSuccess('Profile successfully saved! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.error || 'Failed to save'); }
    finally { setLoading(false); }
  };

  const bmi = form.height && form.weight
    ? (form.weight / ((form.height / 100) ** 2)).toFixed(1) : null;

  const getBMIStatus = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (b < 25)   return { label: 'Normal',      color: '#10b981' };
    if (b < 30)   return { label: 'Overweight',  color: '#f59e0b' };
    return              { label: 'Obese',        color: '#ef4444' };
  };
  const bmiStatus = bmi ? getBMIStatus(parseFloat(bmi)) : null;

  const sections = [
    { id: 'info',    label: '📋 Personal Info' },
    { id: 'goal',    label: '🎯 Fitness Goal' },
    { id: 'stats',   label: '📊 My Stats' },
  ];

  if (fetching) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12, animation: 'spin 1s linear infinite' }}>⏳</div>
        Loading profile...
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .pr-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .sec-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .sec-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; }
        .sec-btn:hover:not(.active) { color: #fff; }
        .fit-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; transition: all 0.2s; }
        .fit-input::placeholder { color: rgba(255,255,255,0.25); }
        .fit-input:focus { border-color: #7c3aed; background: rgba(124,58,237,0.08); }
        .fit-select { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; }
        .fit-select option { background: #1a1040; }
        .save-btn { width: 100%; padding: 13px; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; box-shadow: 0 4px 20px rgba(124,58,237,0.3); }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(124,58,237,0.4); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .goal-card { border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent; }
        .goal-card:hover { transform: translateY(-2px); }
        .stat-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 18px; text-align: center; transition: all 0.2s; }
        .stat-box:hover { border-color: rgba(124,58,237,0.3); }
        .gender-btn { flex: 1; padding: 11px 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; text-align: center; }
        .gender-btn.active { border-color: #7c3aed; background: rgba(124,58,237,0.15); color: #a78bfa; }
        .level-btn { flex: 1; padding: 10px 6px; border-radius: 10px; border: 1.5px solid transparent; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; text-align: center; }
        @media (max-width: 768px) {
          .pr-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .profile-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .goals-grid { grid-template-columns: 1fr 1fr !important; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>👤 PROFILE</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="pr-main">

        {/* Profile Hero */}
        <div className="fade-up" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.05))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 28, marginBottom: 24 }}>
          <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {/* Avatar */}
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", flexShrink: 0, border: '3px solid rgba(167,139,250,0.3)' }}>
                {form.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{form.fullName || 'Set Your Name'}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{user?.email}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>{user?.role}</span>
                  {stats.membership && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>✅ {stats.membership.planName} Member</span>}
                  {form.fitnessLevel && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${LEVEL_COLOR[form.fitnessLevel]}20`, color: LEVEL_COLOR[form.fitnessLevel] }}>{form.fitnessLevel}</span>}
                </div>
              </div>
            </div>

            {/* BMI quick stat */}
            {bmi && (
              <div style={{ textAlign: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: bmiStatus.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{bmi}</div>
                <div style={{ fontSize: 11, color: bmiStatus.color, fontWeight: 700, marginTop: 2 }}>BMI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{bmiStatus.label}</div>
              </div>
            )}
          </div>
        </div>

        {/* Alerts */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}
        {error && <div className="fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {sections.map(s => (
            <button key={s.id} className={`sec-btn ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>{s.label}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── PERSONAL INFO ── */}
          {activeSection === 'info' && (
            <div className="fade-up">
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📋 Personal Information</h3>

                {/* Gender */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Gender</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ val: 'MALE', icon: '👨', label: 'Male' }, { val: 'FEMALE', icon: '👩', label: 'Female' }, { val: 'OTHER', icon: '🧑', label: 'Other' }].map(g => (
                      <button key={g.val} type="button" className={`gender-btn ${form.gender === g.val ? 'active' : ''}`} onClick={() => setForm({ ...form, gender: g.val })}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{g.icon}</div>
                        <div>{g.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: '👤 Full Name', field: 'fullName', type: 'text', placeholder: 'Rahul Patil' },
                    { label: '🎂 Age', field: 'age', type: 'number', placeholder: '24' },
                    { label: '📏 Height (cm)', field: 'height', type: 'number', placeholder: '175' },
                    { label: '⚖️ Weight (kg)', field: 'weight', type: 'number', placeholder: '70' },
                  ].map(f => (
                    <div key={f.field}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.label}</label>
                      <input className="fit-input" type={f.type} placeholder={f.placeholder} value={form[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} required={f.field !== 'age'} />
                      {f.field === 'height' && form.height && (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>= {(form.height / 100).toFixed(2)} m</div>
                      )}
                      {f.field === 'weight' && bmi && (
                        <div style={{ fontSize: 11, color: bmiStatus.color, marginTop: 3, fontWeight: 600 }}>BMI: {bmi} ({bmiStatus.label})</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Fitness Level */}
                <div style={{ marginTop: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>🏅 Fitness Level</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {LEVELS.map(l => (
                      <button key={l} type="button" className="level-btn"
                        onClick={() => setForm({ ...form, fitnessLevel: l })}
                        style={{ background: form.fitnessLevel === l ? `${LEVEL_COLOR[l]}20` : 'rgba(255,255,255,0.03)', borderColor: form.fitnessLevel === l ? LEVEL_COLOR[l] : 'rgba(255,255,255,0.1)', color: form.fitnessLevel === l ? LEVEL_COLOR[l] : 'rgba(255,255,255,0.4)' }}>
                        {l === 'BEGINNER' ? '🌱' : l === 'INTERMEDIATE' ? '⭐' : '🔥'} {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="save-btn" type="submit" disabled={loading}>
                {loading ? '⏳ Saving...' : '💾 Save Profile'}
              </button>
            </div>
          )}

          {/* ── FITNESS GOAL ── */}
          {activeSection === 'goal' && (
            <div className="fade-up">
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🎯 Select Your Fitness Goal</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>तुमचे fitness goal निवडा — workout आणि diet plans automatically suggest होतील</p>

                <div className="goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                  {FITNESS_GOALS.map(goal => (
                    <div key={goal.value} className="goal-card"
                      onClick={() => setForm({ ...form, fitnessGoal: goal.value })}
                      style={{ background: form.fitnessGoal === goal.value ? goal.bg : 'rgba(255,255,255,0.03)', borderColor: form.fitnessGoal === goal.value ? goal.color : 'rgba(255,255,255,0.07)', borderWidth: '1.5px', borderStyle: 'solid', transform: form.fitnessGoal === goal.value ? 'scale(1.02)' : 'scale(1)' }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>{goal.icon}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: form.fitnessGoal === goal.value ? goal.color : '#fff', fontFamily: "'Barlow Condensed',sans-serif", marginBottom: 6 }}>{goal.label}</div>
                      {form.fitnessGoal === goal.value && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: goal.color, fontSize: 12, fontWeight: 700 }}>
                          <span>✓</span> Selected
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button className="save-btn" type="submit" disabled={loading || !form.fitnessGoal}>
                {loading ? '⏳ Saving...' : form.fitnessGoal ? `💾 Save — ${FITNESS_GOALS.find(g => g.value === form.fitnessGoal)?.label}` : 'Goal Select करा'}
              </button>
            </div>
          )}
        </form>

        {/* ── MY STATS ── */}
        {activeSection === 'stats' && (
          <div className="fade-up">
            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '💪', label: 'Workouts', val: stats.workoutDays, sub: 'Total done', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { icon: '📅', label: 'Attendance', val: stats.attendanceDays, sub: 'Days present', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                { icon: '📏', label: 'Height', val: form.height ? `${form.height} cm` : '--', sub: 'Current', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
                { icon: '⚖️', label: 'Weight', val: form.weight ? `${form.weight} kg` : '--', sub: 'Current', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              ].map((s, i) => (
                <div key={i} className="stat-box">
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px' }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 600, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* BMI Detail */}
            {bmi && (
              <div style={{ background: `linear-gradient(135deg,${bmiStatus.color}15,rgba(255,255,255,0.03))`, border: `1px solid ${bmiStatus.color}25`, borderRadius: 18, padding: 24, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🧮 BMI Analysis</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 52, fontWeight: 800, color: bmiStatus.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{bmi}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: bmiStatus.color }}>{bmiStatus.label}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', height: 12, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                      {[{ c: '#3b82f6', w: 25 }, { c: '#10b981', w: 25 }, { c: '#f59e0b', w: 25 }, { c: '#ef4444', w: 25 }].map((s, i) => (
                        <div key={i} style={{ flex: s.w, background: s.c, opacity: 0.7 }} />
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                      <span>Underweight<br/>&lt;18.5</span>
                      <span>Normal<br/>18.5–25</span>
                      <span>Overweight<br/>25–30</span>
                      <span>Obese<br/>&gt;30</span>
                    </div>
                    <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      Ideal weight range: <span style={{ color: '#10b981', fontWeight: 700 }}>{(18.5 * (form.height / 100) ** 2).toFixed(1)} – {(24.9 * (form.height / 100) ** 2).toFixed(1)} kg</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Membership Status */}
            <div style={{ background: stats.membership ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${stats.membership ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 18, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>🎫 Membership Status</h3>
              {stats.membership ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{stats.membership.planName} Plan</div>
                    <div style={{ fontSize: 12, color: '#a78bfa', marginTop: 4 }}>Expires: {stats.membership.expiryDate}</div>
                  </div>
                  <span style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>✅ ACTIVE</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>कोणतीही active membership नाही</span>
                  <a href="/membership" style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Buy Now →</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;