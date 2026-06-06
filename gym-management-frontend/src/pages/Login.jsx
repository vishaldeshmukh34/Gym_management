import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Barlow', sans-serif; }
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
        .pass-wrapper { position: relative; }
        .pass-eye {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: rgba(255,255,255,0.4);
          cursor: pointer; font-size: 16px;
        }
        .social-btn {
          flex: 1; padding: 10px; border-radius: 8px;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05); color: #fff;
          font-size: 13px; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Barlow', sans-serif; transition: all 0.2s;
        }
        .social-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
        .pulse-ring {
          position: absolute; border-radius: 50%;
          border: 2px solid rgba(124,58,237,0.3);
          animation: pulse 3s ease-out infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.2s ease both; }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; padding: 32px 24px !important; }
        }
      `}</style>

      {/* Left Side — Hero */}
      <div className="login-left" style={styles.left}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)' }} />

        {/* Pulse rings */}
        <div className="pulse-ring" style={{ width: 120, height: 120, top: '38%', left: '42%' }} />
        <div className="pulse-ring" style={{ width: 120, height: 120, top: '38%', left: '42%', animationDelay: '1s' }} />

        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoBadge}>FZ</div>
          <span style={styles.logoText}>FITZONE</span>
        </div>

        {/* Hero text */}
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🏆 #1 Fitness Platform</div>
          <h1 style={styles.heroTitle}>
            Welcome<br />
            <span style={styles.heroHighlight}>Back! 👋</span>
          </h1>
          <p style={styles.heroSub}>
            Log in to your account and continue your fitness journey. Your goals are waiting!
          </p>

          {/* Stats */}
          <div style={styles.statsRow}>
            {[
              { value: '50K+', label: 'Active Members' },
              { value: '200+', label: 'Workout Plans' },
              { value: '98%', label: 'Success Rate' },
            ].map((s, i) => (
              <div key={i} style={styles.statItem}>
                <div style={styles.statVal}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative gym image placeholder */}
        <div style={styles.gymDeco}>
          <div style={styles.gymDecoInner}>💪</div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="login-right" style={styles.right}>
        <div style={styles.formCard} className="fade-up">
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Login to your account</h2>
            <p style={styles.formSub}>Welcome back! Please enter your details</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="fade-up-2">
              <label style={styles.label}>Email Address</label>
              <input
                className="fit-input"
                type="email" name="email"
                placeholder="rahul@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="fade-up-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={styles.label}>Password</label>
                <span style={styles.forgotLink}>Forgot Password?</span>
              </div>
              <div className="pass-wrapper">
                <input
                  className="fit-input"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="pass-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="fade-up-3">
              <button className="fit-btn" type="submit" disabled={loading}>
                {loading ? '⏳ Logging in...' : '🚀 Login'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="social-btn">
              <span>G</span> Google
            </button>
            <button className="social-btn">
              <span>f</span> Facebook
            </button>
            <button className="social-btn">
              <span>🍎</span> Apple
            </button>
          </div>

          {/* Register link */}
          <p style={styles.registerLink}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.registerAnchor}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex', minHeight: '100vh',
    background: '#0f0f1a',
    fontFamily: "'Barlow', sans-serif",
  },
  left: {
    flex: 1, position: 'relative',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1040 50%, #0f0f1a 100%)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: '40px',
    overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: 10,
  },
  logoBadge: {
    width: 36, height: 36, borderRadius: 8,
    background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 800, color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  logoText: {
    fontSize: 20, fontWeight: 800, color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    letterSpacing: 2,
  },
  heroContent: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 60 },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
    color: '#a78bfa', fontSize: 13, fontWeight: 600,
    padding: '6px 14px', borderRadius: 20, marginBottom: 20,
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: 52, fontWeight: 800, color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif",
    lineHeight: 1.1, marginBottom: 16,
  },
  heroHighlight: { color: '#a78bfa' },
  heroSub: { color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6, maxWidth: 340, marginBottom: 40 },
  statsRow: { display: 'flex', gap: 32 },
  statItem: { display: 'flex', flexDirection: 'column', gap: 2 },
  statVal: { fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 },
  gymDeco: {
    position: 'absolute', right: -20, bottom: 40,
    width: 180, height: 180,
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  gymDecoInner: { fontSize: 80 },
  right: {
    width: 440, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 32px',
    background: '#0f0f1a',
  },
  formCard: { width: '100%', maxWidth: 380 },
  formHeader: { marginBottom: 28 },
  formTitle: {
    fontSize: 26, fontWeight: 800, color: '#fff',
    fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 6,
  },
  formSub: { color: 'rgba(255,255,255,0.45)', fontSize: 13 },
  errorBox: {
    background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
    color: '#f87171', borderRadius: 10, padding: '10px 14px',
    fontSize: 13, marginBottom: 16,
  },
  label: {
    display: 'block', marginBottom: 6,
    fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
  },
  forgotLink: { fontSize: 12, color: '#a78bfa', cursor: 'pointer', fontWeight: 600 },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '20px 0',
  },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' },
  dividerText: { fontSize: 12, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' },
  registerLink: {
    textAlign: 'center', marginTop: 20,
    fontSize: 13, color: 'rgba(255,255,255,0.4)',
  },
  registerAnchor: { color: '#a78bfa', fontWeight: 700, textDecoration: 'none' },
};

export default Login;