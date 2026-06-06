import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  getUserDietPlans, createDietPlan,
  getMealsByPlan, markMealCompleted, deleteDietPlan,
} from '../api/dietApi';

const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
const GOALS = ['WEIGHT_LOSS', 'MUSCLE_BUILDING', 'SIX_PACK', 'HOME_WORKOUT', 'WEIGHT_GAIN'];

const MEAL_META = {
  BREAKFAST: { icon: '🌅', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  LUNCH:     { icon: '☀️', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  DINNER:    { icon: '🌙', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  SNACK:     { icon: '🍎', color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
};

const Diet = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState('plans');
  const [myPlans, setMyPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [planForm, setPlanForm] = useState({
    planName: '', fitnessGoal: 'WEIGHT_LOSS',
    totalCalories: '', userId,
    meals: [{ mealType: 'BREAKFAST', foodName: '', calories: '', protein: '', carbs: '', fats: '' }],
  });

  useEffect(() => { if (userId) fetchPlans(); }, [userId]);

  // ✅ Fix — Array check add केलं
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getUserDietPlans(userId);
      const data = Array.isArray(res.data) ? res.data : [];
      setMyPlans(data);
    } catch {
      setMyPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeals = async (planId) => {
    try {
      const res = await getMealsByPlan(planId);
      const data = Array.isArray(res.data) ? res.data : [];
      setMeals(data);
    } catch { setMeals([]); }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    fetchMeals(plan.id);
    setActiveTab('today');
  };

  const handleMarkComplete = async (mealId) => {
    try {
      await markMealCompleted(mealId);
      setMeals(prev => prev.map(m => m.id === mealId ? { ...m, completed: true } : m));
      setSuccess('Meal marked as completed! ✅');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to mark meal'); }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this diet plan?')) return;
    try {
      await deleteDietPlan(id);
      fetchPlans();
      if (selectedPlan?.id === id) setSelectedPlan(null);
    } catch { }
  };

  const addMealRow = () =>
    setPlanForm(p => ({ ...p, meals: [...p.meals, { mealType: 'SNACK', foodName: '', calories: '', protein: '', carbs: '', fats: '' }] }));

  const removeMealRow = (i) =>
    setPlanForm(p => ({ ...p, meals: p.meals.filter((_, idx) => idx !== i) }));

  const updateMealRow = (i, field, val) =>
    setPlanForm(p => ({ ...p, meals: p.meals.map((m, idx) => idx === i ? { ...m, [field]: val } : m) }));

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await createDietPlan({ ...planForm, userId });
      setSuccess('Diet Plan created! ✅');
      setPlanForm({ planName: '', fitnessGoal: 'WEIGHT_LOSS', totalCalories: '', userId, meals: [{ mealType: 'BREAKFAST', foodName: '', calories: '', protein: '', carbs: '', fats: '' }] });
      fetchPlans();
      setActiveTab('plans');
    } catch (err) { setError(err.response?.data?.error || 'Failed to create plan'); }
    finally { setLoading(false); }
  };

  const completedCal = meals.filter(m => m.completed).reduce((s, m) => s + (m.calories || 0), 0);
  const totalCal = meals.reduce((s, m) => s + (m.calories || 0), 0);
  const calPct = totalCal > 0 ? Math.round((completedCal / totalCal) * 100) : 0;

  const tabs = [
    { id: 'plans', label: '📋 My Plans' },
    { id: 'today', label: "🍽️ Today's Diet" },
    { id: 'create', label: '➕ Create Plan' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .d-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#10b981,#059669); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .plan-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; transition: all 0.2s; }
        .plan-card:hover { border-color: rgba(16,185,129,0.3); transform: translateY(-2px); }
        .meal-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 16px; transition: all 0.2s; }
        .meal-card.done { opacity: 0.6; background: rgba(16,185,129,0.05); border-color: rgba(16,185,129,0.2); }
        .complete-btn { padding: 8px 14px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; width: 100%; }
        .complete-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fit-input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; transition: all 0.2s; }
        .fit-input::placeholder { color: rgba(255,255,255,0.25); }
        .fit-input:focus { border-color: #10b981; background: rgba(16,185,129,0.08); }
        .fit-select { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; }
        .fit-select option { background: #1a1040; }
        .primary-btn { padding: 11px 20px; background: linear-gradient(135deg,#10b981,#059669); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .primary-btn:hover { transform: translateY(-1px); }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .danger-btn { background: none; border: none; color: rgba(239,68,68,0.6); cursor: pointer; font-size: 18px; transition: all 0.2s; padding: 4px; }
        .danger-btn:hover { color: #ef4444; }
        @media (max-width: 768px) {
          .d-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; backdrop-filter: blur(4px); }
          .today-grid { grid-template-columns: 1fr !important; }
          .meals-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🥗 DIET PLANS</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="d-main">
        {/* Header */}
        <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🥗 Diet Plans</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Meals track करा, calories monitor करा</p>
          </div>
          <button className="primary-btn" onClick={() => setActiveTab('create')} style={{ fontSize: 13, padding: '9px 16px' }}>➕ Create Plan</button>
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

        {/* ── MY PLANS ── */}
        {activeTab === 'plans' && (
          <div className="fade-up">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>⏳ Loading...</div>
            ) : myPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🥗</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>कोणताही Diet Plan नाही</div>
                <button className="primary-btn" onClick={() => setActiveTab('create')}>➕ Create Diet Plan</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {myPlans.map(plan => {
                  const planMeals = Array.isArray(plan.meals) ? plan.meals : [];
                  const planCal = planMeals.reduce((s, m) => s + (m.calories || 0), 0);
                  const doneMeals = planMeals.filter(m => m.completed).length;
                  const pct = planMeals.length > 0 ? Math.round((doneMeals / planMeals.length) * 100) : 0;
                  return (
                    <div key={plan.id} className="plan-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div>
                          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0, fontFamily: "'Barlow Condensed',sans-serif" }}>{plan.planName}</h3>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34d399', marginTop: 6, display: 'inline-block' }}>
                            {plan.fitnessGoal?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <button className="danger-btn" onClick={() => handleDeletePlan(plan.id)}>🗑️</button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                        {[
                          { icon: '🔥', label: 'Calories', val: plan.totalCalories || planCal },
                          { icon: '🍽️', label: 'Meals', val: planMeals.length },
                          { icon: '✅', label: 'Done', val: `${pct}%` },
                        ].map((s, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
                            <div style={{ fontSize: 15 }}>{s.icon}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Progress</span>
                          <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>{pct}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 6 }}>
                          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#10b981,#34d399)', width: `${pct}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>

                      <button className="primary-btn" style={{ width: '100%', fontSize: 13 }} onClick={() => handleSelectPlan(plan)}>
                        🍽️ View Today's Meals
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TODAY'S DIET ── */}
        {activeTab === 'today' && (
          <div className="fade-up">
            {!selectedPlan ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Plan select करा</div>
                <button className="primary-btn" onClick={() => setActiveTab('plans')}>← My Plans</button>
              </div>
            ) : (
              <div className="today-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
                {/* Meals */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>{selectedPlan.planName}</h3>
                    <button onClick={() => setActiveTab('plans')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 12, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", fontWeight: 600 }}>← Back</button>
                  </div>

                  <div className="meals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
                    {meals.map(meal => {
                      const meta = MEAL_META[meal.mealType] || { icon: '🍴', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' };
                      return (
                        <div key={meal.id} className={`meal-card ${meal.completed ? 'done' : ''}`}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 42, height: 42, borderRadius: 11, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{meta.icon}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase' }}>{meal.mealType}</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{meal.foodName}</div>
                            </div>
                            {meal.completed && <span style={{ fontSize: 20 }}>✅</span>}
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 12 }}>
                            {[
                              { label: 'Cal', val: meal.calories, color: '#f97316' },
                              { label: 'Protein', val: meal.protein, color: '#3b82f6' },
                              { label: 'Carbs', val: meal.carbs, color: '#10b981' },
                              { label: 'Fats', val: meal.fats, color: '#f59e0b' },
                            ].map((m, i) => (
                              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '7px 4px', textAlign: 'center' }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: m.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{m.val || '-'}</div>
                                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{m.label}</div>
                              </div>
                            ))}
                          </div>

                          <button className="complete-btn" disabled={meal.completed} onClick={() => handleMarkComplete(meal.id)}>
                            {meal.completed ? '✅ Completed' : '✓ Mark as Eaten'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Nutrition Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Nutrition</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ position: 'relative', width: 110, height: 110 }}>
                        <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                          <circle cx="55" cy="55" r="46" fill="none" stroke="#10b981" strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 46}`}
                            strokeDashoffset={`${2 * Math.PI * 46 * (1 - calPct / 100)}`}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{calPct}%</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Done</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 8, textAlign: 'center' }}>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>{completedCal}</span> / {totalCal} kcal
                      </div>
                    </div>

                    {[
                      { label: 'Carbs', pct: 45, color: '#10b981' },
                      { label: 'Protein', pct: 30, color: '#3b82f6' },
                      { label: 'Fats', pct: 25, color: '#f59e0b' },
                    ].map((m, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.label}</span>
                          <span style={{ fontSize: 12, color: m.color, fontWeight: 700 }}>{m.pct}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 99, height: 5 }}>
                          <div style={{ height: '100%', borderRadius: 99, background: m.color, width: `${m.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CREATE PLAN ── */}
        {activeTab === 'create' && (
          <div className="fade-up">
            <form onSubmit={handleCreatePlan}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📋 Plan Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Plan Name</label>
                    <input className="fit-input" placeholder="e.g. Weight Loss Diet" value={planForm.planName} onChange={e => setPlanForm({ ...planForm, planName: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Fitness Goal</label>
                    <select className="fit-select" value={planForm.fitnessGoal} onChange={e => setPlanForm({ ...planForm, fitnessGoal: e.target.value })}>
                      {GOALS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Total Calories</label>
                    <input className="fit-input" type="number" placeholder="1800" value={planForm.totalCalories} onChange={e => setPlanForm({ ...planForm, totalCalories: e.target.value })} required />
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>🍽️ Meals</h3>
                  <button type="button" onClick={addMealRow} style={{ padding: '7px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>
                    ➕ Add Meal
                  </button>
                </div>

                {planForm.meals.map((meal, i) => {
                  const meta = MEAL_META[meal.mealType] || { icon: '🍴', color: '#a78bfa' };
                  return (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 18 }}>{meta.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: meta.color }}>Meal {i + 1}</span>
                        {planForm.meals.length > 1 && (
                          <button type="button" onClick={() => removeMealRow(i)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', fontSize: 16 }}>✕</button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Meal Type</label>
                          <select className="fit-select" value={meal.mealType} onChange={e => updateMealRow(i, 'mealType', e.target.value)}>
                            {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Food Name</label>
                          <input className="fit-input" placeholder="e.g. Oats + Banana" value={meal.foodName} onChange={e => updateMealRow(i, 'foodName', e.target.value)} required />
                        </div>
                        {['calories', 'protein', 'carbs', 'fats'].map(field => (
                          <div key={field}>
                            <label style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, textTransform: 'capitalize' }}>{field}</label>
                            <input className="fit-input" placeholder={field === 'calories' ? '300' : '10g'} value={meal[field]} onChange={e => updateMealRow(i, field, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="primary-btn" type="submit" disabled={loading} style={{ padding: '13px 30px', fontSize: 15 }}>
                {loading ? '⏳ Creating...' : '🥗 Create Diet Plan'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diet;