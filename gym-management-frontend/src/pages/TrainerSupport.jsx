import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  getAllTrainers, getTrainersBySpecialization,
  assignTrainerToUser, getUserTrainer,
} from '../api/trainerApi';

const SPECIALIZATIONS = ['ALL', 'WEIGHT_LOSS', 'MUSCLE_BUILDING', 'YOGA', 'CARDIO'];

const SPEC_META = {
  WEIGHT_LOSS:     { icon: '🔥', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  MUSCLE_BUILDING: { icon: '💪', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  YOGA:            { icon: '🧘', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  CARDIO:          { icon: '🏃', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

const TrainerSupport = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [trainers, setTrainers] = useState([]);
  const [myTrainer, setMyTrainer] = useState(null);
  const [activeTab, setActiveTab] = useState('trainers');
  const [selectedSpec, setSelectedSpec] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [trainersRes, myTrainerRes] = await Promise.allSettled([
        getAllTrainers(),
        getUserTrainer(userId),
      ]);
      if (trainersRes.status === 'fulfilled') setTrainers(Array.isArray(trainersRes.value.data) ? trainersRes.value.data : []);
      if (myTrainerRes.status === 'fulfilled') setMyTrainer(myTrainerRes.value.data);
    } finally { setLoading(false); }
  };

  const handleSpecChange = async (spec) => {
    setSelectedSpec(spec);
    setLoading(true);
    try {
      const res = spec === 'ALL' ? await getAllTrainers() : await getTrainersBySpecialization(spec);
      setTrainers(Array.isArray(res.data) ? res.data : []);
    } catch { setTrainers([]); }
    finally { setLoading(false); }
  };

  const handleBook = async (trainerId) => {
    if (!window.confirm('हा trainer book करायचा आहे का?')) return;
    setBooking(trainerId); setError(''); setSuccess('');
    try {
      await assignTrainerToUser(trainerId, userId);
      setSuccess('🎉 Trainer successfully assigned!');
      fetchData(); setActiveTab('mytrainer');
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally { setBooking(null); }
  };

  const tabs = [
    { id: 'trainers', label: '🏋️ Find Trainer' },
    { id: 'mytrainer', label: '👤 My Trainer' },
  ];

  const ratings = [4.8, 4.9, 4.7, 4.6, 4.8, 4.9];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .t-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .spec-btn { padding: 7px 16px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .spec-btn.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        .spec-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.2); }
        .trainer-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 22px; transition: all 0.25s; }
        .trainer-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .book-btn { width: 100%; padding: 11px; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .book-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
        .book-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .chat-btn { width: 100%; padding: 11px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); color: #34d399; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .chat-btn:hover { background: rgba(16,185,129,0.2); }
        .star { color: #f59e0b; font-size: 12px; }
        .avatar { display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 800; color: #fff; font-family: 'Barlow Condensed',sans-serif; flex-shrink: 0; }
        @media (max-width: 768px) {
          .t-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .trainers-grid { grid-template-columns: 1fr !important; }
          .my-trainer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🏋️ TRAINER SUPPORT</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="t-main">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🏋️ Trainer Support</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Expert trainers शोधा आणि book करा</p>
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

        {/* ── FIND TRAINER ── */}
        {activeTab === 'trainers' && (
          <div className="fade-up">
            {/* Specialization Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
              {SPECIALIZATIONS.map(spec => {
                const meta = SPEC_META[spec];
                return (
                  <button key={spec} className={`spec-btn ${selectedSpec === spec ? 'active' : ''}`} onClick={() => handleSpecChange(spec)}>
                    {meta ? `${meta.icon} ` : '🔍 '}{spec.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>Loading trainers...
              </div>
            ) : trainers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏋️</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>कोणताही trainer नाही</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>Admin ने trainers add करायला सांग!</div>
              </div>
            ) : (
              <div className="trainers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                {trainers.map((trainer, i) => {
                  const meta = SPEC_META[trainer.specialization] || { icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                  const rating = ratings[i % ratings.length];
                  const isAssigned = myTrainer?.trainer?.id === trainer.id;
                  const colors = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#ec4899'];
                  const avatarColor = colors[i % colors.length];

                  return (
                    <div key={trainer.id} className="trainer-card">
                      {/* Trainer Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
                        <div className="avatar" style={{ width: 56, height: 56, fontSize: 20, background: `linear-gradient(135deg,${avatarColor},${avatarColor}cc)` }}>
                          {trainer.trainerName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{trainer.trainerName}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: meta.bg, color: meta.color }}>
                              {meta.icon} {trainer.specialization?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {/* Rating */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                            {'★★★★★'.split('').map((s, si) => (
                              <span key={si} className="star">{s}</span>
                            ))}
                            <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>{rating}</span>
                            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>({Math.floor(Math.random() * 200 + 50)} reviews)</span>
                          </div>
                        </div>
                        {isAssigned && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34d399', flexShrink: 0 }}>✅ Assigned</span>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                        {[
                          { icon: '📧', label: 'Email', val: trainer.email || 'N/A' },
                          { icon: '📞', label: 'Phone', val: trainer.phone || 'N/A' },
                          { icon: '⏳', label: 'Experience', val: trainer.experience || 'N/A' },
                          { icon: '🟢', label: 'Status', val: trainer.status || 'ACTIVE' },
                        ].map((info, idx) => (
                          <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 12px' }}>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{info.icon} {info.label}</div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button
                          className="book-btn"
                          disabled={booking === trainer.id || isAssigned}
                          onClick={() => handleBook(trainer.id)}
                          style={{ background: isAssigned ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: isAssigned ? '#34d399' : '#fff', border: isAssigned ? '1px solid rgba(16,185,129,0.25)' : 'none' }}
                        >
                          {booking === trainer.id ? '⏳ Booking...' : isAssigned ? '✅ Currently Assigned' : '📅 Book Session'}
                        </button>
                        <button className="chat-btn" onClick={() => alert('Chat feature coming soon! 💬')}>
                          💬 Chat Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MY TRAINER ── */}
        {activeTab === 'mytrainer' && (
          <div className="fade-up">
            {!myTrainer ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏋️</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>कोणताही Trainer Assigned नाही</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Find Trainer tab मधून trainer book करा!</div>
                <button className="tab-btn active" onClick={() => setActiveTab('trainers')}>🏋️ Find Trainer</button>
              </div>
            ) : (
              <div className="my-trainer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
                {/* Trainer Profile */}
                <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(255,255,255,0.03))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 24 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>👤 Your Trainer</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 20 }}>
                    <div className="avatar" style={{ width: 80, height: 80, fontSize: 28, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', marginBottom: 12 }}>
                      {myTrainer.trainer?.trainerName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{myTrainer.trainer?.trainerName}</div>
                    {(() => {
                      const meta = SPEC_META[myTrainer.trainer?.specialization] || { icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                      return (
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 12px', borderRadius: 99, background: meta.bg, color: meta.color, marginTop: 8 }}>
                          {meta.icon} {myTrainer.trainer?.specialization?.replace(/_/g, ' ')}
                        </span>
                      );
                    })()}

                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 2, marginTop: 10 }}>
                      {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 16 }}>{s}</span>)}
                      <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700, marginLeft: 6 }}>4.9</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { icon: '📧', label: 'Email', val: myTrainer.trainer?.email },
                      { icon: '📞', label: 'Phone', val: myTrainer.trainer?.phone },
                      { icon: '⏳', label: 'Experience', val: myTrainer.trainer?.experience },
                      { icon: '📅', label: 'Assigned Date', val: myTrainer.assignedDate },
                      { icon: '🟢', label: 'Assignment Status', val: myTrainer.status },
                    ].map((info, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 10 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{info.icon} {info.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{info.val || 'N/A'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Chat */}
                  <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>💬 Chat with Trainer</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>Trainer ला directly message करा — workout plans, diet advice, आणि progress updates साठी.</p>
                    <button className="chat-btn" onClick={() => alert('Chat feature coming soon! 💬')}>
                      💬 Start Chat
                    </button>
                  </div>

                  {/* Session */}
                  <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📅 Book a Session</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>Personal training session book करा आणि fitness goals faster achieve करा.</p>
                    <button style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }} onClick={() => alert('Session booking coming soon!')}>
                      📅 Book Session
                    </button>
                  </div>

                  {/* Progress */}
                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>📊 Share Progress</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>Trainer ला तुमचा progress share करा — better guidance मिळेल.</p>
                    <button style={{ width: '100%', padding: '11px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>
                      📊 Share Progress
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerSupport;