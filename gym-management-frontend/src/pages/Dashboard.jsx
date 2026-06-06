import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getActiveMembership } from '../api/membershipApi';
import { getTotalWorkoutDays, getTodayProgress } from '../api/progressApi';
import { getTotalPresentDays } from '../api/attendanceApi';
import { getUnreadNotifications } from '../api/notificationApi';
import { getProfile } from '../api/profileApi';

const Dashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [membership, setMembership] = useState(null);
  const [workoutDays, setWorkoutDays] = useState(0);
  const [attendanceDays, setAttendanceDays] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [todayProgress, setTodayProgress] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        getActiveMembership(userId),
        getTotalWorkoutDays(userId),
        getTotalPresentDays(userId),
        getUnreadNotifications(userId),
        getTodayProgress(userId),
        getProfile(userId),
      ]);
      if (results[0].status === 'fulfilled') setMembership(results[0].value.data);
      if (results[1].status === 'fulfilled') setWorkoutDays(results[1].value.data);
      if (results[2].status === 'fulfilled') setAttendanceDays(results[2].value.data);
      if (results[3].status === 'fulfilled') setUnreadCount(results[3].value.data.length);
      if (results[4].status === 'fulfilled') setTodayProgress(results[4].value.data);
      if (results[5].status === 'fulfilled') setProfile(results[5].value.data);
      setLoading(false);
    };
    if (userId) fetchAll();
  }, [userId]);

  const bmi = profile?.height && profile?.weight
    ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
    : null;

  const getBMIStatus = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (b < 25) return { label: 'Normal', color: '#10b981' };
    if (b < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const bmiStatus = bmi ? getBMIStatus(bmi) : null;

  const statCards = [
    { icon: '🔥', label: 'Calories Burned', value: todayProgress?.caloriesBurned || 0, unit: 'kcal', sub: 'Today', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
    { icon: '💧', label: 'Water Intake', value: todayProgress?.waterIntake ? (todayProgress.waterIntake / 1000).toFixed(1) : '0', unit: 'Liters', sub: 'Today', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { icon: '💪', label: 'Workout Streak', value: workoutDays, unit: 'Days', sub: 'Keep it up!', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { icon: '⚖️', label: 'Current Weight', value: profile?.weight || '--', unit: 'kg', sub: profile ? `Goal: ${profile.fitnessGoal?.replace(/_/g, ' ')}` : 'Set profile', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  ];

  const quickActions = [
    { icon: '💪', label: 'Workout Plans', path: '/workout', color: '#7c3aed' },
    { icon: '🥗', label: 'Diet Plans', path: '/diet', color: '#10b981' },
    { icon: '📊', label: 'Progress', path: '/progress', color: '#3b82f6' },
    { icon: '🧮', label: 'BMI Calc', path: '/bmi', color: '#f59e0b' },
    { icon: '🏆', label: 'Challenges', path: '/challenges', color: '#ef4444' },
    { icon: '🎫', label: 'Membership', path: '/membership', color: '#ec4899' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .main { margin-left: 240px; flex: 1; padding: 28px; min-height: 100vh; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .fade-up-2 { animation: fadeUp 0.4s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.4s 0.2s ease both; }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.2s; cursor: default; }
        .stat-card:hover { border-color: rgba(124,58,237,0.3); background: rgba(124,58,237,0.05); transform: translateY(-2px); }
        .quick-card { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 20px 10px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); text-decoration: none; transition: all 0.2s; }
        .quick-card:hover { transform: translateY(-3px); background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.3); }
        .today-workout { background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(79,70,229,0.08)); border: 1px solid rgba(124,58,237,0.2); border-radius: 16px; padding: 20px; }
        .prog-bar-bg { background: rgba(255,255,255,0.08); border-radius: 99px; height: 6px; overflow: hidden; }
        .prog-bar-fill { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
        @media (max-width: 768px) {
          .main { margin-left: 0 !important; padding: 16px !important; padding-top: 72px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 58px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; backdrop-filter: blur(4px); }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .quick-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 10px !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}

      {/* Mobile top bar */}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>
          {mobileOpen ? '✕' : '☰'}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>FZ</div>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>FITZONE</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Link to="/notifications" style={{ color: '#fff', fontSize: 20, textDecoration: 'none' }}>🔔</Link>
          {unreadCount > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#ef4444', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadCount}</div>}
        </div>
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="main">

        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 2 }}>Good Morning! 👋</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>
              Hello, {profile?.fullName || user?.email?.split('@')[0]}!
            </h1>
            <p style={{ color: '#a78bfa', fontSize: 13, marginTop: 2, fontWeight: 600 }}>
              {membership ? `${membership.planName} Member` : 'No active membership'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔔</div>
              {unreadCount > 0 && <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#ef4444', borderRadius: '50%', fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{unreadCount}</div>}
            </Link>
            <Link to="/profile">
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>
                {user?.email?.[0]?.toUpperCase()}
              </div>
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 12, animation: 'fadeUp 1s infinite alternate' }}>⏳</div>
            Loading your dashboard...
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="fade-up-2 stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
              {statCards.map((card, i) => (
                <div key={i} className="stat-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{card.icon}</div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{card.sub}</span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>
                    {card.value} <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{card.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500 }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* Middle Row */}
            <div className="fade-up-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

              {/* Today's Workout */}
              <div className="today-workout">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>🏋️ Today's Summary</h3>
                  <Link to="/workout" style={{ fontSize: 12, color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
                </div>

                {[
                  { label: 'Workout Done', value: todayProgress?.workoutDone ? 'Yes ✅' : 'No ❌', prog: todayProgress?.workoutDone ? 100 : 0, color: '#10b981' },
                  { label: 'Water Intake', value: `${todayProgress?.waterIntake || 0} ml`, prog: Math.min(((todayProgress?.waterIntake || 0) / 3000) * 100, 100), color: '#3b82f6' },
                  { label: 'Calories Burned', value: `${todayProgress?.caloriesBurned || 0} kcal`, prog: Math.min(((todayProgress?.caloriesBurned || 0) / 500) * 100, 100), color: '#f97316' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                      <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{item.value}</span>
                    </div>
                    <div className="prog-bar-bg">
                      <div className="prog-bar-fill" style={{ width: `${item.prog}%`, background: item.color }} />
                    </div>
                  </div>
                ))}

                <Link to="/progress" style={{ display: 'block', marginTop: 16, padding: '10px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: 10, textAlign: 'center', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                  📊 Log Today's Progress
                </Link>
              </div>

              {/* BMI + Membership */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* BMI */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 18, flex: 1 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 14px' }}>🧮 BMI Status</h3>
                  {bmi ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 800, color: bmiStatus.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{bmi}</div>
                        <div style={{ fontSize: 12, color: bmiStatus.color, fontWeight: 700, marginTop: 2 }}>{bmiStatus.label}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        {[
                          { label: 'Height', value: `${profile?.height} cm` },
                          { label: 'Weight', value: `${profile?.weight} kg` },
                          { label: 'Goal', value: profile?.fitnessGoal?.replace(/_/g, ' ') },
                        ].map((r, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{r.label}</span>
                            <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{r.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link to="/profile" style={{ color: '#a78bfa', fontSize: 13, textDecoration: 'none' }}>Set up profile to see BMI →</Link>
                  )}
                </div>

                {/* Membership */}
                <div style={{ background: membership ? 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.1))' : 'rgba(255,255,255,0.03)', border: `1px solid ${membership ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>🎫 Membership</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>
                        {membership ? membership.planName : 'No Plan'}
                      </div>
                      {membership && <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 2 }}>Expires: {membership.expiryDate}</div>}
                    </div>
                    <Link to="/membership" style={{ padding: '8px 14px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                      {membership ? 'Manage' : 'Buy Now'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="fade-up-3">
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>⚡ Quick Actions</h3>
              <div className="quick-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12 }}>
                {quickActions.map((action, i) => (
                  <Link key={i} to={action.path} className="quick-card">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${action.color}20`, border: `1px solid ${action.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{action.icon}</div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textAlign: 'center' }}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;