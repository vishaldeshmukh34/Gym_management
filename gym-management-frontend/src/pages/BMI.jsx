import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../api/profileApi';

const BMI = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ height: '', weight: '', age: '', gender: 'MALE' });
  const [result, setBMIResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-fill from profile
  const handleAutoFill = async () => {
    setLoading(true);
    try {
      const res = await getProfile(user?.id);
      const p = res.data;
      setForm({
        height: p.height || '',
        weight: p.weight || '',
        age: p.age || '',
        gender: p.gender || 'MALE',
      });
    } catch { }
    finally { setLoading(false); }
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    const h = parseFloat(form.height) / 100;
    const w = parseFloat(form.weight);
    const bmi = (w / (h * h)).toFixed(1);
    const age = parseInt(form.age);

    let status, color, desc, plan, emoji;
    if (bmi < 18.5) {
      status = 'Underweight'; color = '#3b82f6'; emoji = '😟';
      desc = 'तुमचे वजन कमी आहे. Healthy weight साठी calorie-rich diet घ्या.';
      plan = 'WEIGHT_GAIN';
    } else if (bmi < 25) {
      status = 'Normal Weight'; color = '#10b981'; emoji = '😊';
      desc = 'तुमचे वजन ideal आहे! Maintain करण्यासाठी balanced diet आणि exercise सुरू ठेवा.';
      plan = 'MUSCLE_BUILDING';
    } else if (bmi < 30) {
      status = 'Overweight'; color = '#f59e0b'; emoji = '😐';
      desc = 'तुमचे वजन जास्त आहे. Regular cardio आणि healthy diet follow करा.';
      plan = 'WEIGHT_LOSS';
    } else {
      status = 'Obese'; color = '#ef4444'; emoji = '😰';
      desc = 'तुमचे वजन खूप जास्त आहे. Doctor कडे जाणे recommend करतो.';
      plan = 'WEIGHT_LOSS';
    }

    // Ideal weight range
    const idealMin = (18.5 * h * h).toFixed(1);
    const idealMax = (24.9 * h * h).toFixed(1);

    // BMR (Mifflin-St Jeor)
    let bmr;
    if (form.gender === 'MALE') {
      bmr = Math.round(10 * w + 6.25 * parseFloat(form.height) - 5 * age + 5);
    } else {
      bmr = Math.round(10 * w + 6.25 * parseFloat(form.height) - 5 * age - 161);
    }

    setBMIResult({ bmi, status, color, desc, plan, emoji, idealMin, idealMax, bmr });
  };

  // Gauge angle
  const getGaugeAngle = (bmi) => {
    const clamped = Math.min(Math.max(bmi, 10), 40);
    return ((clamped - 10) / 30) * 180 - 90;
  };

  const gaugeAngle = result ? getGaugeAngle(parseFloat(result.bmi)) : -90;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .b-main { margin-left: 240px; flex: 1; padding: 28px; }
        .mobile-bar { display: none; }
        .mob-overlay { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .fit-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; transition: all 0.2s; }
        .fit-input::placeholder { color: rgba(255,255,255,0.25); }
        .fit-input:focus { border-color: #a78bfa; background: rgba(167,139,250,0.08); }
        .fit-select { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 13px; font-family: 'Barlow',sans-serif; outline: none; }
        .fit-select option { background: #1a1040; }
        .primary-btn { width: 100%; padding: 13px; background: linear-gradient(135deg,#7c3aed,#4f46e5); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; box-shadow: 0 4px 15px rgba(124,58,237,0.3); }
        .primary-btn:hover { transform: translateY(-1px); }
        .autofill-btn { width: 100%; padding: 10px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25); color: #a78bfa; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; margin-bottom: 16px; }
        .autofill-btn:hover { background: rgba(167,139,250,0.2); }
        .gender-btn { flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Barlow',sans-serif; transition: all 0.2s; }
        .gender-btn.active { border-color: #7c3aed; background: rgba(124,58,237,0.15); color: #a78bfa; }
        .bmi-range { display: flex; height: 10px; border-radius: 99px; overflow: hidden; margin: 12px 0; }
        @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .result-card { animation: scaleIn 0.4s ease both; }
        @media (max-width: 768px) {
          .b-main { margin-left: 0 !important; padding: 14px !important; padding-top: 70px !important; }
          .mobile-bar { display: flex !important; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #12122a; padding: 0 16px; z-index: 999; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .mob-overlay { display: block !important; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 998; }
          .bmi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {mobileOpen && <div className="mob-overlay" onClick={() => setMobileOpen(false)} />}
      <div className="mobile-bar">
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>{mobileOpen ? '✕' : '☰'}</button>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: 1 }}>🧮 BMI CALCULATOR</span>
        <div style={{ width: 32 }} />
      </div>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="b-main">
        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", margin: 0 }}>🧮 BMI Calculator</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Body Mass Index calculate करा आणि health status पाहा</p>
        </div>

        <div className="bmi-grid fade-up" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Input Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 24 }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📋 Your Details</h3>

            <button className="autofill-btn" onClick={handleAutoFill} disabled={loading}>
              {loading ? '⏳ Loading...' : '✨ Auto-fill from Profile'}
            </button>

            <form onSubmit={calculateBMI} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Gender */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Gender</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ val: 'MALE', icon: '👨', label: 'Male' }, { val: 'FEMALE', icon: '👩', label: 'Female' }].map(g => (
                    <button key={g.val} type="button" className={`gender-btn ${form.gender === g.val ? 'active' : ''}`} onClick={() => setForm({ ...form, gender: g.val })}>
                      {g.icon} {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Height */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Height (cm)</label>
                <input className="fit-input" type="number" placeholder="175" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} required />
                {form.height && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>= {(form.height / 100).toFixed(2)} meters</div>}
              </div>

              {/* Weight */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Weight (kg)</label>
                <input className="fit-input" type="number" placeholder="70" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} required />
              </div>

              {/* Age */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Age</label>
                <input className="fit-input" type="number" placeholder="24" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
              </div>

              <button className="primary-btn" type="submit">🧮 Calculate BMI</button>
            </form>

            {/* BMI Scale */}
            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>BMI Scale</div>
              <div className="bmi-range">
                <div style={{ flex: 1, background: '#3b82f6' }} />
                <div style={{ flex: 1, background: '#10b981' }} />
                <div style={{ flex: 1, background: '#f59e0b' }} />
                <div style={{ flex: 1, background: '#ef4444' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ color: '#3b82f6' }}>Underweight<br/>&lt;18.5</span>
                <span style={{ color: '#10b981' }}>Normal<br/>18.5–24.9</span>
                <span style={{ color: '#f59e0b' }}>Overweight<br/>25–29.9</span>
                <span style={{ color: '#ef4444' }}>Obese<br/>&gt;30</span>
              </div>
            </div>
          </div>

          {/* Result */}
          <div>
            {!result ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                <div style={{ fontSize: 80, marginBottom: 16, opacity: 0.5 }}>🧮</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Details भरा आणि Calculate करा</div>
                <div style={{ fontSize: 13 }}>तुमचा BMI आणि health status दिसेल</div>
              </div>
            ) : (
              <div className="result-card">
                {/* Main Result */}
                <div style={{ background: `linear-gradient(135deg, ${result.color}15, rgba(255,255,255,0.03))`, border: `1px solid ${result.color}30`, borderRadius: 20, padding: 28, marginBottom: 20, textAlign: 'center' }}>
                  {/* Gauge */}
                  <div style={{ position: 'relative', width: 200, height: 110, margin: '0 auto 20px' }}>
                    <svg width="200" height="110" viewBox="0 0 200 110">
                      {/* Background arc segments */}
                      {[
                        { color: '#3b82f6', start: -90, end: -45 },
                        { color: '#10b981', start: -45, end: 45 },
                        { color: '#f59e0b', start: 45, end: 90 },
                        { color: '#ef4444', start: 90, end: 135 },
                      ].map((seg, i) => {
                        const r = 80;
                        const cx = 100, cy = 100;
                        const toRad = deg => (deg * Math.PI) / 180;
                        const x1 = cx + r * Math.cos(toRad(seg.start));
                        const y1 = cy + r * Math.sin(toRad(seg.start));
                        const x2 = cx + r * Math.cos(toRad(seg.end));
                        const y2 = cy + r * Math.sin(toRad(seg.end));
                        return (
                          <path key={i}
                            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                            fill={`${seg.color}25`} stroke={seg.color} strokeWidth="0.5"
                          />
                        );
                      })}
                      {/* Needle */}
                      <line
                        x1="100" y1="100"
                        x2={100 + 70 * Math.cos((gaugeAngle * Math.PI) / 180)}
                        y2={100 + 70 * Math.sin((gaugeAngle * Math.PI) / 180)}
                        stroke={result.color} strokeWidth="3" strokeLinecap="round"
                        style={{ transition: 'all 0.8s ease' }}
                      />
                      <circle cx="100" cy="100" r="8" fill={result.color} />
                    </svg>
                  </div>

                  <div style={{ fontSize: 64, marginBottom: 8 }}>{result.emoji}</div>
                  <div style={{ fontSize: 56, fontWeight: 800, color: result.color, fontFamily: "'Barlow Condensed',sans-serif", lineHeight: 1 }}>{result.bmi}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed',sans-serif", marginTop: 6 }}>{result.status}</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>{result.desc}</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
                  {[
                    { icon: '⚖️', label: 'Your BMI', val: result.bmi, color: result.color },
                    { icon: '🎯', label: 'Ideal Weight', val: `${result.idealMin}–${result.idealMax} kg`, color: '#10b981' },
                    { icon: '🔥', label: 'BMR', val: `${result.bmr} kcal`, color: '#f97316' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'Barlow Condensed',sans-serif" }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 14 }}>💡 Recommendations</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(result.plan === 'WEIGHT_LOSS' ? [
                      { icon: '🏃', text: 'रोज 30–45 minutes cardio करा (Running, Cycling)' },
                      { icon: '🥗', text: 'Calorie deficit diet follow करा — less carbs, more protein' },
                      { icon: '💧', text: 'Daily 3–4 liters पाणी प्या' },
                      { icon: '😴', text: '7–8 hours झोप घ्या — cortisol कमी होतो' },
                    ] : result.plan === 'WEIGHT_GAIN' ? [
                      { icon: '🍗', text: 'High calorie, protein-rich diet घ्या' },
                      { icon: '🏋️', text: 'Strength training करा — muscle build करा' },
                      { icon: '🍌', text: 'Healthy snacks — nuts, bananas, peanut butter' },
                      { icon: '⏰', text: 'Regular meals घ्या — 5–6 small meals daily' },
                    ] : [
                      { icon: '✅', text: 'Current routine maintain करा' },
                      { icon: '💪', text: 'Strength training add करा — muscle tone करा' },
                      { icon: '🥦', text: 'Balanced diet follow करा' },
                      { icon: '📊', text: 'Regular progress track करा' },
                    ]).map((r, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                        <span style={{ fontSize: 20, flexShrink: 0 }}>{r.icon}</span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMI;