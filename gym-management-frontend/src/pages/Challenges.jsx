import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const CHALLENGES = [
  {
    id: 1, title: '30 Day Six Pack Challenge', icon: '⚡', category: 'ABS',
    level: 'BEGINNER', duration: '30 days', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    desc: 'Daily abs workout करा आणि 30 दिवसांत six pack मिळवा!',
    exercises: ['Crunches — 3×20', 'Plank — 3×30s', 'Leg Raises — 3×15', 'Russian Twist — 3×20'],
    participants: 1240, streak: 0, joined: false,
  },
  {
    id: 2, title: '21 Day Weight Loss', icon: '🔥', category: 'CARDIO',
    level: 'INTERMEDIATE', duration: '21 days', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    desc: '21 दिवसांत 3-5 kg weight loss करा — diet + cardio combo!',
    exercises: ['Running — 30 min', 'Jump Rope — 100 jumps', 'Burpees — 3×10', 'Mountain Climbers — 3×20'],
    participants: 980, streak: 0, joined: false,
  },
  {
    id: 3, title: '14 Day Push-Up Challenge', icon: '💪', category: 'CHEST',
    level: 'BEGINNER', duration: '14 days', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    desc: '14 दिवसांत 100 push-ups पर्यंत पोहोचा!',
    exercises: ['Day 1-3: 10 push-ups', 'Day 4-7: 25 push-ups', 'Day 8-11: 50 push-ups', 'Day 12-14: 100 push-ups'],
    participants: 2100, streak: 0, joined: false,
  },
  {
    id: 4, title: '7 Day Yoga & Flexibility', icon: '🧘', category: 'YOGA',
    level: 'BEGINNER', duration: '7 days', color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    desc: '7 दिवसांत flexibility improve करा आणि stress कमी करा!',
    exercises: ['Morning Stretch — 10 min', 'Downward Dog — 3×30s', 'Child Pose — 3×30s', 'Warrior Pose — 3×20s'],
    participants: 750, streak: 0, joined: false,
  },
  {
    id: 5, title: '30 Day Muscle Building', icon: '🏋️', category: 'STRENGTH',
    level: 'ADVANCED', duration: '30 days', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',
    desc: '30 दिवसांत lean muscle mass build करा!',
    exercises: ['Bench Press — 4×8', 'Deadlift — 4×6', 'Pull-ups — 4×10', 'Squats — 4×10'],
    participants: 560, streak: 0, joined: false,
  },
  {
    id: 6, title: '10K Steps Daily Challenge', icon: '🦶', category: 'CARDIO',
    level: 'BEGINNER', duration: '30 days', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    desc: 'रोज 10,000 steps चाला — healthy heart आणि weight management!',
    exercises: ['Morning Walk — 30 min', 'Evening Walk — 30 min', 'Take stairs always', 'Park far from destination'],
    participants: 3200, streak: 0, joined: false,
  },
];

const LEVEL_COLOR = { BEGINNER: '#10b981', INTERMEDIATE: '#f59e0b', ADVANCED: '#ef4444' };
const CAT_FILTER = ['ALL', 'ABS', 'CARDIO', 'CHEST', 'YOGA', 'STRENGTH'];

const Challenges = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState(CHALLENGES);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [activeTab, setActiveTab] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');

  const handleJoin = (id) => {
    setChallenges(prev => prev.map(c =>
      c.id === id ? { ...c, joined: !c.joined, participants: c.joined ? c.participants - 1 : c.participants + 1 } : c
    ));
    const ch = challenges.find(c => c.id === id);
    if (!ch.joined) { setSuccess(`🎉 "${ch.title}" challenge joined!`); setTimeout(() => setSuccess(''), 3000); }
  };

  const filtered = challenges.filter(c => {
    const catMatch = selectedCat === 'ALL' || c.category === selectedCat;
    const tabMatch = activeTab === 'all' || (activeTab === 'joined' && c.joined);
    return catMatch && tabMatch;
  });

  const joinedCount = challenges.filter(c => c.joined).length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .ch-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#f59e0b,#d97706); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(245,158,11,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; }
        .cat-btn { padding: 7px 14px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .cat-btn.active { background: #f59e0b; color: #1a1a2e; border-color: #f59e0b; }
        .cat-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.2); }
        .ch-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; overflow: hidden; transition: all 0.25s; }
        .ch-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .join-btn { width: 100%; padding: 11px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .join-btn:hover { transform: translateY(-1px); }
        @media (max-width: 768px) {
          .ch-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .ch-grid { grid-template-columns: 1fr !important; }
          .top-stats { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🏆 CHALLENGES</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="ch-main">

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🏆 Challenges</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Challenges join करा, streak maintain करा, rewards मिळवा!</p>
        </div>

        {/* Success Alert */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}

        {/* Top Stats */}
        <div className="top-stats fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: '🏆', label: 'Total Challenges', val: CHALLENGES.length, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { icon: '✅', label: 'Joined', val: joinedCount, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { icon: '🔥', label: 'Active Streak', val: `${joinedCount * 3} days`, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
            { icon: '🏅', label: 'Badges Earned', val: joinedCount, color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, border: `1px solid ${s.color}25`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
          {[{ id: 'all', label: '🏆 All Challenges' }, { id: 'joined', label: `✅ My Challenges (${joinedCount})` }].map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {CAT_FILTER.map(cat => (
            <button key={cat} className={`cat-btn ${selectedCat === cat ? 'active' : ''}`} onClick={() => setSelectedCat(cat)}>
              {cat === 'ALL' ? '🔍 ALL' : cat}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🏆</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              {activeTab === 'joined' ? 'कोणताही challenge join केला नाही' : 'कोणतेही challenges नाहीत'}
            </div>
            {activeTab === 'joined' && (
              <button className="tab-btn active" onClick={() => setActiveTab('all')} style={{ marginTop: 12 }}>🏆 Challenges पाहा</button>
            )}
          </div>
        ) : (
          <div className="ch-grid fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
            {filtered.map(ch => (
              <div key={ch.id} className="ch-card" style={{ borderTop: `3px solid ${ch.color}` }}>
                {/* Card Header */}
                <div style={{ padding: '20px 20px 16px', background: ch.bg }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ fontSize: 36 }}>{ch.icon}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${LEVEL_COLOR[ch.level]}20`, color: LEVEL_COLOR[ch.level] }}>{ch.level}</span>
                      {ch.joined && <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>✅ Joined</span>}
                    </div>
                  </div>
                  <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: '0 0 6px', fontFamily: "'Barlow Condensed',sans-serif" }}>{ch.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0, lineHeight: 1.5 }}>{ch.desc}</p>
                </div>

                {/* Card Body */}
                <div style={{ padding: '14px 20px' }}>
                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                    {[
                      { icon: '⏱️', val: ch.duration },
                      { icon: '👥', val: `${ch.participants.toLocaleString()} joined` },
                      { icon: '📂', val: ch.category },
                    ].map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                        <span>{m.icon}</span><span>{m.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Exercises expand */}
                  <button onClick={() => setExpanded(expanded === ch.id ? null : ch.id)}
                    style={{ background: 'none', border: 'none', color: ch.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", padding: '4px 0', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    {expanded === ch.id ? '▲' : '▼'} {expanded === ch.id ? 'Hide' : 'View'} Exercises
                  </button>

                  {expanded === ch.id && (
                    <div style={{ marginBottom: 14 }}>
                      {ch.exercises.map((ex, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: ch.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Streak (if joined) */}
                  {ch.joined && (
                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>🔥 Current Streak</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b', fontFamily: "'Barlow Condensed',sans-serif" }}>Day {Math.floor(Math.random() * 10) + 1}</span>
                    </div>
                  )}

                  {/* Join / Leave Button */}
                  <button className="join-btn" onClick={() => handleJoin(ch.id)}
                    style={{
                      background: ch.joined
                        ? 'rgba(239,68,68,0.1)'
                        : `linear-gradient(135deg,${ch.color},${ch.color}cc)`,
                      color: ch.joined ? '#f87171' : '#fff',
                      border: ch.joined ? '1px solid rgba(239,68,68,0.25)' : 'none',
                      boxShadow: ch.joined ? 'none' : `0 4px 15px ${ch.color}40`,
                    }}>
                    {ch.joined ? '❌ Leave Challenge' : '🚀 Join Challenge'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;