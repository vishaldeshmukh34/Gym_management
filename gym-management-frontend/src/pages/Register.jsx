import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'USER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError('Name and Email required'); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match!'); return; }
    setLoading(true); setError('');
    try {
      await registerUser({ name: form.name, email: form.email, password: form.password, role: form.role });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .fit-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: #fff;
          font-size: 14px; font-family: 'Barlow', sans-serif;
          outline: none; transition: all 0.2s;
        }
        .fit-input::placeholder { color: rgba(255,255,255,0.35); }
        .fit-input:focus { border-color: #7c3aed; background: rgba(124,58,237,0.1); }
        .fit-select {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.07);
          border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 10px; color: #fff;
          font-size: 14px; font-family: 'Barlow', sans-serif;
          outline: none; cursor: pointer;
        }
        .fit-select option { background: #1a1040; }
        .fit-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #fff; border: none; border-radius: 10px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Barlow', sans-serif; letter-spacing: 0.5px;
          transition: all 0.2s; box-shadow: 0 4px 20px rgba(124,58,237,0.4);
        }
        .fit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(124,58,237,0.5); }
        .fit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .fit-btn-outline {
          width: 100%; padding: 13px;
          background: transparent;
          color: #a78bfa; border: 1.5px solid rgba(124,58,237,0.4); border-radius: 10px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Barlow', sans-serif; transition: all 0.2s;
        }
        .fit-btn-outline:hover { background: rgba(124,58,237,0.1); }
        .pass-wrapper { position: relative; }
        .pass-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 16px;
        }
        .role-card {
          flex: 1; padding: 14px 10px; border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          cursor: pointer; text-align: center; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .role-card:hover { border-color: rgba(124,58,237,0.4); }
        .role-card.active { border-color: #7c3aed; background: rgba(124,58,237,0.15); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        @media (max-width: 768px) {
          .reg-left { display: none !important; }
          .reg-right { width: 100% !important; padding: 32px 24px !important; }
        }
      `}</style>

      {/* Left */}
      <div className="reg-left" style={styles.left}>
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />

        <div style={styles.logo}>
          <div style={styles.logoBadge}>FZ</div>
          <span style={styles.logoText}>FITZONE</span>
        </div>

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🚀 Start Your Journey</div>
          <h1 style={styles.heroTitle}>
            Create<br />
            <span style={styles.heroHighlight}>Account! 💪</span>
          </h1>
          <p style={styles.heroSub}>
            Join thousands of fitness enthusiasts. Track workouts, diet plans, and achieve your goals faster.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
            {[
              { icon: '💪', text: 'Personalized Workout Plans' },
              { icon: '🥗', text: 'Custom Diet & Nutrition Plans' },
              { icon: '📊', text: 'Real-time Progress Tracking' },
              { icon: '🏋️', text: 'Expert Trainer Support' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 80, textAlign: 'center' }}>🏆</div>
      </div>

      {/* Right */}
      <div className="reg-right" style={styles.right}>
        <div style={styles.formCard} className="fade-up">
          {/* Step indicator */}
          <div style={styles.stepRow}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= s ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: step >= s ? '#fff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s',
                }}>{s}</div>
                <span style={{ fontSize: 12, color: step >= s ? '#a78bfa' : 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
                  {s === 1 ? 'Basic Info' : 'Security'}
                </span>
                {s < 2 && <div style={{ width: 40, height: 1, background: step > s ? '#7c3aed' : 'rgba(255,255,255,0.1)', marginLeft: 4, transition: 'all 0.3s' }} />}
              </div>
            ))}
          </div>

          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>{step === 1 ? 'Create Account' : 'Set Password'}</h2>
            <p style={styles.formSub}>{step === 1 ? 'Join us to start your fitness journey' : 'Create a strong password for your account'}</p>
          </div>

          {error && <div style={styles.errorBox}>⚠️ {error}</div>}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input className="fit-input" type="text" name="name" placeholder="Rahul Verma" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <label style={styles.label}>Email Address</label>
                <input className="fit-input" type="email" name="email" placeholder="rahul@gmail.com" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <label style={styles.label}>I am a...</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { val: 'USER', icon: '🏃', label: 'Member' },
                    { val: 'TRAINER', icon: '🏋️', label: 'Trainer' },
                    { val: 'ADMIN', icon: '👑', label: 'Admin' },
                  ].map(r => (
                    <div key={r.val}
                      className={`role-card ${form.role === r.val ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, role: r.val })}>
                      <span style={{ fontSize: 22 }}>{r.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: form.role === r.val ? '#a78bfa' : 'rgba(255,255,255,0.6)' }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="fit-btn" type="submit">Continue →</button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={styles.label}>Password</label>
                <div className="pass-wrapper">
                  <input className="fit-input" type={showPass ? 'text' : 'password'} name="password" placeholder="••••••••••" value={form.password} onChange={handleChange} required />
                  <button type="button" className="pass-eye" onClick={() => setShowPass(!showPass)}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div>
                <label style={styles.label}>Confirm Password</label>
                <div className="pass-wrapper">
                  <input className="fit-input" type={showPass ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••••" value={form.confirmPassword} onChange={handleChange} required />
                </div>
              </div>

              {/* Password strength */}
              {form.password && (
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: form.password.length >= i * 3
                        ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#3b82f6' : '#10b981'
                        : 'rgba(255,255,255,0.1)',
                      transition: 'all 0.2s',
                    }} />
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="fit-btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button className="fit-btn" type="submit" disabled={loading} style={{ flex: 2 }}>
                  {loading ? '⏳ Creating...' : '🚀 Register'}
                </button>
              </div>
            </form>
          )}

          <p style={styles.loginLink}>
            Already have an account?{' '}
            <Link to="/login" style={styles.loginAnchor}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#0f0f1a', fontFamily: "'Barlow', sans-serif" },
  left: { flex: 1, position: 'relative', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f0f1a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.06)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoBadge: { width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" },
  logoText: { fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 2 },
  heroContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 40 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 20, marginBottom: 20, width: 'fit-content' },
  heroTitle: { fontSize: 48, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.1, marginBottom: 16 },
  heroHighlight: { color: '#a78bfa' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, maxWidth: 340, marginBottom: 30 },
  right: { width: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', background: '#0f0f1a' },
  formCard: { width: '100%', maxWidth: 400 },
  stepRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 },
  formHeader: { marginBottom: 24 },
  formTitle: { fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 6 },
  formSub: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  errorBox: { background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' },
  loginLink: { textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  loginAnchor: { color: '#a78bfa', fontWeight: 700, textDecoration: 'none' },
};

export default Register;