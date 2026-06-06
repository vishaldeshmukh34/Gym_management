import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  getAllExercises, getExercisesByCategory,
  createWorkoutPlan, getUserWorkoutPlans,
  deleteWorkoutPlan, addExercise,
} from '../api/workoutApi';

const CATEGORIES = ['ALL', 'CHEST', 'LEGS', 'BACK', 'ARMS', 'ABS', 'CARDIO'];
const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const GOALS = ['WEIGHT_LOSS', 'MUSCLE_BUILDING', 'SIX_PACK', 'HOME_WORKOUT', 'WEIGHT_GAIN'];

const CAT_META = {
  CHEST: { icon: '🏋️', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  LEGS:  { icon: '🦵', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  BACK:  { icon: '💪', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ARMS:  { icon: '🦾', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
  ABS:   { icon: '⚡', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  CARDIO:{ icon: '🏃', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
};

const DIFF_COLOR = { BEGINNER: '#10b981', INTERMEDIATE: '#f59e0b', ADVANCED: '#ef4444' };

const Workout = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState('plans');
  const [exercises, setExercises] = useState([]);
  const [myPlans, setMyPlans] = useState([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [selectedEx, setSelectedEx] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [expandedPlan, setExpandedPlan] = useState(null);

  const [planForm, setPlanForm] = useState({
    workoutName: '', fitnessGoal: 'MUSCLE_BUILDING',
    difficulty: 'BEGINNER', userId, exerciseIds: [],
  });

  const [showAddEx, setShowAddEx] = useState(false);
  const [exForm, setExForm] = useState({
    exerciseName: '', category: 'CHEST',
    sets: '', reps: '', caloriesBurned: '',
  });

  useEffect(() => { fetchExercises(); fetchMyPlans(); }, [userId]);

  const fetchExercises = async (cat = 'ALL') => {
    setLoading(true);
    try {
      const res = cat === 'ALL' ? await getAllExercises() : await getExercisesByCategory(cat);
      setExercises(res.data);
    } catch { setExercises([]); }
    finally { setLoading(false); }
  };

  const fetchMyPlans = async () => {
    try { const res = await getUserWorkoutPlans(userId); setMyPlans(res.data); }
    catch { setMyPlans([]); }
  };

  const handleCatChange = (cat) => { setSelectedCat(cat); fetchExercises(cat); };

  const toggleEx = (id) =>
    setSelectedEx(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id]);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!selectedEx.length) { setError('कमीत कमी 1 exercise select करा!'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await createWorkoutPlan({ ...planForm, userId, exerciseIds: selectedEx });
      setSuccess('Workout Plan created! ✅');
      setSelectedEx([]); setPlanForm({ workoutName: '', fitnessGoal: 'MUSCLE_BUILDING', difficulty: 'BEGINNER', userId, exerciseIds: [] });
      fetchMyPlans(); setActiveTab('plans');
    } catch (err) { setError(err.response?.data?.error || 'Failed'); }
    finally { setLoading(false); }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try { await deleteWorkoutPlan(id); fetchMyPlans(); } catch {}
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try { await addExercise(exForm); setSuccess('Exercise added! ✅'); setShowAddEx(false); fetchExercises(selectedCat); }
    catch (err) { setError(err.response?.data?.error || 'Failed'); }
  };

  const tabs = [
    { id: 'plans', label: '📋 My Plans' },
    { id: 'exercises', label: '🏋️ Exercises' },
    { id: 'create', label: '➕ Create Plan' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .w-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .cat-btn { padding: 7px 16px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .cat-btn.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        .cat-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.2); }
        .ex-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 16px; transition: all 0.2s; cursor: pointer; }
        .ex-card:hover { border-color: rgba(124,58,237,0.3); transform: translateY(-2px); background: rgba(124,58,237,0.05); }
        .ex-card.selected { border-color: #7c3aed; background: rgba(124,58,237,0.1); }
        .plan-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; overflow: hidden; transition: all 0.2s; }
        .plan-card:hover { border-color: rgba(124,58,237,0.25); }
        .fit-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; transition: all 0.2s; }
        .fit-input::placeholder { color: rgba(255,255,255,0.25); }
        .fit-input:focus { border-color: #7c3aed; background: rgba(124,58,237,0.08); }
        .fit-select { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; }
        .fit-select option { background: #1a1040; }
        .primary-btn { padding: 12px 20px; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .primary-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.4); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .danger-btn { background: none; border: none; color: rgba(239,68,68,0.6); cursor: pointer; font-size: 18px; transition: all 0.2s; padding: 4px; }
        .danger-btn:hover { color: #ef4444; transform: scale(1.1); }
        .diff-badge { display: inline-flex; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
        .exercises-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
        .plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        @media (max-width: 768px) {
          .w-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; backdrop-filter: blur(4px); }
          .exercises-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .plans-grid { grid-template-columns: 1fr !important; }
          .create-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}

      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>💪 WORKOUT</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="w-main">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>💪 Workout Plans</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Exercises पाहा, Plans बनवा, Progress track करा</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {(user?.role === 'ADMIN' || user?.role === 'TRAINER') && (
                <button className="primary-btn" onClick={() => setShowAddEx(!showAddEx)} style={{ padding: '10px 16px', fontSize: 13 }}>
                  ➕ Add Exercise
                </button>
              )}
              <button className="primary-btn" onClick={() => setActiveTab('create')} style={{ padding: '10px 16px', fontSize: 13 }}>
                🗂️ Create Plan
              </button>
            </div>
          </div>
        </div>

        {/* Add Exercise Form */}
        {showAddEx && (
          <div className="fade-up" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>➕ Add New Exercise</h3>
            <form onSubmit={handleAddExercise}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12 }}>
                <input className="fit-input" placeholder="Exercise Name" value={exForm.exerciseName} onChange={e => setExForm({ ...exForm, exerciseName: e.target.value })} required />
                <select className="fit-select" value={exForm.category} onChange={e => setExForm({ ...exForm, category: e.target.value })}>
                  {CATEGORIES.filter(c => c !== 'ALL').map(c => <option key={c}>{c}</option>)}
                </select>
                <input className="fit-input" type="number" placeholder="Sets" value={exForm.sets} onChange={e => setExForm({ ...exForm, sets: e.target.value })} required />
                <input className="fit-input" type="number" placeholder="Reps" value={exForm.reps} onChange={e => setExForm({ ...exForm, reps: e.target.value })} required />
                <input className="fit-input" type="number" placeholder="Calories" value={exForm.caloriesBurned} onChange={e => setExForm({ ...exForm, caloriesBurned: e.target.value })} required />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="primary-btn" type="submit">Save Exercise</button>
                <button type="button" onClick={() => setShowAddEx(false)} style={{ padding: '11px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: 10, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontSize: 13 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Alerts */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{success}</div>}
        {error && <div className="fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── TAB: MY PLANS ── */}
        {activeTab === 'plans' && (
          <div className="fade-up">
            {myPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>कोणताही Plan नाही</div>
                <div style={{ fontSize: 13, marginBottom: 20 }}>Create Plan tab मधून नवीन plan बनवा!</div>
                <button className="primary-btn" onClick={() => setActiveTab('create')}>➕ Create First Plan</button>
              </div>
            ) : (
              <div className="plans-grid">
                {myPlans.map(plan => {
                  const totalCal = plan.exercises?.reduce((s, e) => s + (e.caloriesBurned || 0), 0) || 0;
                  const isExpanded = expandedPlan === plan.id;
                  return (
                    <div key={plan.id} className="plan-card">
                      {/* Plan Header */}
                      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div>
                            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0, fontFamily: "'Barlow Condensed',sans-serif" }}>{plan.workoutName}</h3>
                            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                              <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>{plan.fitnessGoal?.replace(/_/g, ' ')}</span>
                              <span className="diff-badge" style={{ background: `${DIFF_COLOR[plan.difficulty]}20`, color: DIFF_COLOR[plan.difficulty] }}>{plan.difficulty}</span>
                            </div>
                          </div>
                          <button className="danger-btn" onClick={() => handleDeletePlan(plan.id)}>🗑️</button>
                        </div>

                        {/* Plan Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                          {[
                            { icon: '🏋️', label: 'Exercises', val: plan.exercises?.length || 0 },
                            { icon: '🔥', label: 'Calories', val: totalCal },
                            { icon: '⏱️', label: 'Est. Time', val: `${(plan.exercises?.length || 0) * 5}m` },
                          ].map((s, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                              <div style={{ fontSize: 16 }}>{s.icon}</div>
                              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exercises List */}
                      {plan.exercises && plan.exercises.length > 0 && (
                        <div style={{ padding: '10px 18px 0' }}>
                          <button onClick={() => setExpandedPlan(isExpanded ? null : plan.id)}
                            style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", padding: '6px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isExpanded ? '▲ Hide' : '▼ Show'} Exercises ({plan.exercises.length})
                          </button>
                          {isExpanded && (
                            <div style={{ marginBottom: 12 }}>
                              {plan.exercises.map(ex => {
                                const meta = CAT_META[ex.category] || { icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                                return (
                                  <div key={ex.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 6 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                      <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{meta.icon}</div>
                                      <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ex.exerciseName}</div>
                                        <div style={{ fontSize: 11, color: meta.color }}>{ex.category}</div>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{ex.sets} × {ex.reps}</div>
                                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ex.caloriesBurned} cal</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Start Button */}
                      <div style={{ padding: '12px 18px 16px' }}>
                        <button className="primary-btn" style={{ width: '100%' }}>
                          🚀 Start Workout
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: EXERCISES ── */}
        {activeTab === 'exercises' && (
          <div className="fade-up">
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`cat-btn ${selectedCat === cat ? 'active' : ''}`} onClick={() => handleCatChange(cat)}>
                  {cat !== 'ALL' ? CAT_META[cat]?.icon + ' ' : '🔍 '}{cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>Loading exercises...
              </div>
            ) : exercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🏋️</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>No exercises found</div>
                <div style={{ fontSize: 13, marginTop: 8 }}>Admin/Trainer ने exercises add करायला सांग!</div>
              </div>
            ) : (
              <div className="exercises-grid">
                {exercises.map(ex => {
                  const meta = CAT_META[ex.category] || { icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                  return (
                    <div key={ex.id} className="ex-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: meta.bg, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{meta.icon}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: meta.bg, color: meta.color }}>{ex.category}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12, fontFamily: "'Barlow Condensed',sans-serif" }}>{ex.exerciseName}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                        {[
                          { label: 'Sets', val: ex.sets },
                          { label: 'Reps', val: ex.reps },
                          { label: 'Cal', val: ex.caloriesBurned },
                        ].map((s, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 800, color: meta.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: CREATE PLAN ── */}
        {activeTab === 'create' && (
          <div className="fade-up create-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
            {/* Plan Details */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 18 }}>📋 Plan Details</h3>
              <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Plan Name</label>
                  <input className="fit-input" placeholder="e.g. Chest Day, Leg Day" value={planForm.workoutName} onChange={e => setPlanForm({ ...planForm, workoutName: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Fitness Goal</label>
                  <select className="fit-select" value={planForm.fitnessGoal} onChange={e => setPlanForm({ ...planForm, fitnessGoal: e.target.value })}>
                    {GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Difficulty</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {DIFFICULTIES.map(d => (
                      <button key={d} type="button"
                        onClick={() => setPlanForm({ ...planForm, difficulty: d })}
                        style={{ flex: 1, padding: '9px 4px', borderRadius: 10, border: `1px solid ${planForm.difficulty === d ? DIFF_COLOR[d] : 'rgba(255,255,255,0.1)'}`, background: planForm.difficulty === d ? `${DIFF_COLOR[d]}20` : 'rgba(255,255,255,0.03)', color: planForm.difficulty === d ? DIFF_COLOR[d] : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", transition: 'all 0.2s' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>✅ Selected: {selectedEx.length} exercises</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>उजव्या बाजूने exercises select करा →</div>
                </div>

                <button className="primary-btn" type="submit" disabled={loading} style={{ width: '100%', padding: 13 }}>
                  {loading ? '⏳ Creating...' : '🚀 Create Workout Plan'}
                </button>
              </form>
            </div>

            {/* Exercise Selector */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>🏋️ Select Exercises</h3>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} className={`cat-btn ${selectedCat === cat ? 'active' : ''}`} onClick={() => handleCatChange(cat)} style={{ fontSize: 11, padding: '5px 12px' }}>
                    {cat !== 'ALL' ? CAT_META[cat]?.icon + ' ' : ''}{cat}
                  </button>
                ))}
              </div>
              <div style={{ maxHeight: 420, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
                {exercises.map(ex => {
                  const meta = CAT_META[ex.category] || { icon: '💪', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                  const sel = selectedEx.includes(ex.id);
                  return (
                    <div key={ex.id} onClick={() => toggleEx(ex.id)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 12, border: `1px solid ${sel ? '#7c3aed' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{meta.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{ex.exerciseName}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{ex.sets} sets × {ex.reps} reps • {ex.caloriesBurned} cal</div>
                        </div>
                      </div>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: sel ? '#7c3aed' : 'rgba(255,255,255,0.06)', border: `1.5px solid ${sel ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: sel ? '#fff' : 'rgba(255,255,255,0.3)', transition: 'all 0.2s', flexShrink: 0 }}>
                        {sel ? '✓' : '+'}
                      </div>
                    </div>
                  );
                })}
                {exercises.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                    No exercises. Category बदला किंवा exercises add करा.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;