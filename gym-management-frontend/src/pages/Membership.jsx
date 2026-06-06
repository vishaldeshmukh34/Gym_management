import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import {
  buyMembership, getActiveMembership,
  getUserMemberships, cancelMembership,
} from '../api/membershipApi';

const PLANS = [
  {
    id: 'MONTHLY',
    name: 'Basic',
    price: 999,
    period: 'month',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    icon: '🥉',
    features: [
      { text: 'Gym Access', included: true },
      { text: 'Basic Equipment', included: true },
      { text: '1 Session / Day', included: true },
      { text: 'Diet Plans', included: false },
      { text: 'Personal Trainer', included: false },
      { text: 'Unlimited Access', included: false },
    ],
  },
  {
    id: 'QUARTERLY',
    name: 'Premium',
    price: 2499,
    period: '3 months',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
    border: 'rgba(124,58,237,0.35)',
    icon: '🥈',
    popular: true,
    features: [
      { text: 'All Basic Features', included: true },
      { text: 'Diet Plans', included: true },
      { text: '2 Sessions / Day', included: true },
      { text: 'Trainer Support', included: true },
      { text: 'Personal Trainer', included: false },
      { text: 'Unlimited Access', included: false },
    ],
  },
  {
    id: 'YEARLY',
    name: 'Elite',
    price: 7999,
    period: 'year',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    icon: '🥇',
    features: [
      { text: 'All Premium Features', included: true },
      { text: 'Personal Trainer', included: true },
      { text: 'Custom Diet Plan', included: true },
      { text: 'Unlimited Access', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Free Body Analysis', included: true },
    ],
  },
];

const Membership = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [activeMembership, setActiveMembership] = useState(null);
  const [allMemberships, setAllMemberships] = useState([]);
  const [activeTab, setActiveTab] = useState('plans');
  const [loading, setLoading] = useState(false);
  const [buying, setBuying] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { if (userId) fetchData(); }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activeRes, allRes] = await Promise.allSettled([
        getActiveMembership(userId),
        getUserMemberships(userId),
      ]);
      if (activeRes.status === 'fulfilled') setActiveMembership(activeRes.value.data);
      if (allRes.status === 'fulfilled') setAllMemberships(Array.isArray(allRes.value.data) ? allRes.value.data : []);
    } finally { setLoading(false); }
  };

  const handleBuy = async (planId) => {
    if (!window.confirm(`${planId} plan buy करायचा आहे का?`)) return;
    setBuying(planId); setError(''); setSuccess('');
    try {
      await buyMembership({ userId, planName: planId });
      setSuccess(`🎉 ${planId} Membership successfully activated!`);
      fetchData(); setActiveTab('status');
    } catch (err) {
      setError(err.response?.data?.error || 'Purchase failed');
    } finally { setBuying(null); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Membership cancel करायची आहे का?')) return;
    try {
      await cancelMembership(id);
      setSuccess('Membership cancelled.');
      fetchData();
    } catch { setError('Failed to cancel'); }
  };

  // Days left
  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = activeMembership ? getDaysLeft(activeMembership.expiryDate) : 0;
  const activePlan = PLANS.find(p => p.id === activeMembership?.planName);

  const tabs = [
    { id: 'plans', label: '💳 Plans' },
    { id: 'status', label: '📋 My Membership' },
    { id: 'history', label: '🕐 History' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .m-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .tab-btn { padding: 9px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; white-space: nowrap; }
        .tab-btn.active { background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border-color: transparent; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .tab-btn:hover:not(.active) { color: #fff; border-color: rgba(255,255,255,0.15); }
        .plan-card { border-radius: 20px; padding: 28px; transition: all 0.3s; position: relative; overflow: hidden; }
        .plan-card:hover { transform: translateY(-4px); }
        .buy-btn { width: 100%; padding: 13px; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .buy-btn:hover { transform: translateY(-1px); }
        .buy-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .feature-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 13px; }
        .period-btn { padding: 8px 20px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .period-btn.active { background: #7c3aed; color: #fff; border-color: #7c3aed; }
        @media (max-width: 768px) {
          .m-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .plans-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🎫 MEMBERSHIP</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="m-main">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🎫 Membership Plans</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>तुमच्यासाठी best plan निवडा</p>
        </div>

        {/* Alerts */}
        {success && <div className="fade-up" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{success}</div>}
        {error && <div className="fade-up" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ── PLANS TAB ── */}
        {activeTab === 'plans' && (
          <div className="fade-up">
            {/* Active membership banner */}
            {activeMembership && (
              <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(79,70,229,0.1))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 14, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>✅</span>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Active: {activeMembership.planName} Plan</div>
                    <div style={{ color: '#a78bfa', fontSize: 12, marginTop: 2 }}>{daysLeft} days remaining • Expires: {activeMembership.expiryDate}</div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('status')} style={{ padding: '8px 16px', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif" }}>View Details →</button>
              </div>
            )}

            {/* Plans Grid */}
            <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
              {PLANS.map(plan => (
                <div key={plan.id} className="plan-card" style={{ background: plan.popular ? `linear-gradient(135deg, ${plan.bg}, rgba(124,58,237,0.05))` : plan.bg, border: `1px solid ${plan.border}` }}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>⭐ Popular</div>
                  )}

                  {/* Plan Header */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{plan.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{plan.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
                      <span style={{ fontSize: 36, fontWeight: 800, color: plan.color, fontFamily: "'Barlow Condensed',sans-serif" }}>₹{plan.price.toLocaleString()}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>/ {plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: 24 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} className="feature-row">
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: f.included ? `${plan.color}20` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: f.included ? plan.color : 'rgba(255,255,255,0.2)' }}>{f.included ? '✓' : '✕'}</span>
                        </div>
                        <span style={{ color: f.included ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)', textDecoration: f.included ? 'none' : 'line-through' }}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buy Button */}
                  <button
                    className="buy-btn"
                    disabled={buying === plan.id || activeMembership?.planName === plan.id}
                    onClick={() => handleBuy(plan.id)}
                    style={{
                      background: activeMembership?.planName === plan.id
                        ? 'rgba(16,185,129,0.15)'
                        : plan.popular
                          ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                          : `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
                      color: activeMembership?.planName === plan.id ? '#10b981' : '#fff',
                      boxShadow: plan.popular ? '0 6px 20px rgba(124,58,237,0.4)' : 'none',
                      border: activeMembership?.planName === plan.id ? '1px solid rgba(16,185,129,0.3)' : 'none',
                    }}
                  >
                    {buying === plan.id ? '⏳ Processing...'
                      : activeMembership?.planName === plan.id ? '✅ Current Plan'
                        : '🚀 Choose Plan'}
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison note */}
            <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
              सगळ्या plans मध्ये GST included आहे • Cancel anytime • No hidden charges
            </div>
          </div>
        )}

        {/* ── STATUS TAB ── */}
        {activeTab === 'status' && (
          <div className="fade-up">
            {!activeMembership ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎫</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>कोणतीही Active Membership नाही</div>
                <button className="tab-btn active" onClick={() => setActiveTab('plans')} style={{ marginTop: 12 }}>💳 Plans पाहा</button>
              </div>
            ) : (
              <div style={{ maxWidth: 600 }}>
                {/* Active Card */}
                <div style={{ background: `linear-gradient(135deg,${activePlan?.color || '#7c3aed'}20,rgba(255,255,255,0.03))`, border: `1px solid ${activePlan?.color || '#7c3aed'}30`, borderRadius: 20, padding: 28, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                      <div style={{ fontSize: 40 }}>{activePlan?.icon || '🎫'}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", marginTop: 8 }}>{activePlan?.name || activeMembership.planName} Plan</div>
                      <div style={{ fontSize: 13, color: '#34d399', fontWeight: 700, marginTop: 4 }}>✅ ACTIVE</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: activePlan?.color || '#7c3aed', fontFamily: "'Barlow Condensed',sans-serif" }}>₹{activeMembership.amount?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Membership Progress</span>
                      <span style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700 }}>{daysLeft} days left</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 8 }}>
                      <div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg,${activePlan?.color || '#7c3aed'},${activePlan?.color || '#7c3aed'}88)`, width: `${Math.min((daysLeft / 365) * 100, 100)}%`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    {[
                      { label: 'Start Date', val: activeMembership.startDate, icon: '📅' },
                      { label: 'Expiry Date', val: activeMembership.expiryDate, icon: '⏰' },
                      { label: 'Days Remaining', val: `${daysLeft} days`, icon: '📆' },
                      { label: 'Amount Paid', val: `₹${activeMembership.amount?.toLocaleString()}`, icon: '💰' },
                    ].map((d, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px' }}>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{d.icon} {d.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{d.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cancel Button */}
                <button
                  onClick={() => handleCancel(activeMembership.id)}
                  style={{ padding: '11px 20px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Barlow',sans-serif", transition: 'all 0.2s' }}>
                  ❌ Cancel Membership
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="fade-up">
            {allMemberships.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🕐</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>कोणताही history नाही</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {allMemberships.map((m, i) => {
                  const plan = PLANS.find(p => p.id === m.planName);
                  return (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontSize: 28 }}>{plan?.icon || '🎫'}</div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{plan?.name || m.planName} Plan</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{m.startDate} → {m.expiryDate}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: plan?.color || '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>₹{m.amount?.toLocaleString()}</div>
                        <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: m.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : m.status === 'CANCELLED' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)', color: m.status === 'ACTIVE' ? '#34d399' : m.status === 'CANCELLED' ? '#f87171' : 'rgba(255,255,255,0.4)' }}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;