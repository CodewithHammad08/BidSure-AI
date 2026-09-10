import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ShieldCheck, Lock, UserPlus, CheckCircle, Clock, Building2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

/* ─── Micro Components ──────────────────────────────────────────────────── */

function Spinner({ size = 18 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white',
      borderRadius: '50%', animation: 'loginSpin 0.7s linear infinite',
      verticalAlign: 'middle', flexShrink: 0,
    }} />
  );
}

const INPUT = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s',
};

const LABEL = {
  display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 11,
  fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={LABEL}>{label}</label>
      {children}
    </div>
  );
}

function Alert({ type, message }) {
  const styles = {
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#f87171', icon: <AlertCircle size={15} /> },
    pending: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.35)', color: '#fbbf24', icon: <Clock size={15} /> },
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399', icon: <CheckCircle size={15} /> },
  };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10,
      padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start',
    }}>
      <span style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
      <p style={{ color: s.color, fontSize: 13, lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}

/* ─── Brand Panel ────────────────────────────────────────────────────────── */

function BrandPanel() {
  return (
    <div style={{
      width: '42%', minWidth: 320,
      background: 'linear-gradient(160deg, #1e1b4b 0%, #090d16 65%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '52px 48px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13,
            background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
          }}>
            <Scale size={22} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>BidSure AI</div>
            <div style={{ color: '#22d3ee', fontSize: 11, marginTop: 3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Procurement Intelligence
            </div>
          </div>
        </div>

        <h1 style={{ color: 'white', fontSize: 30, fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
          AI‑Powered Bid<br />Compliance &<br />Risk Platform
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.8, marginBottom: 36 }}>
          Convert fragmented tender documents into evidence-linked compliance intelligence — enabling procurement officers to verify bids faster with full auditability.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {[
            { icon: '⚖️', text: 'SIH Problem Statement SIH26100' },
            { icon: '🏛️', text: 'GeM — Ministry of Heavy Industries' },
            { icon: '🧠', text: 'AI/ML Risk Prediction Engine' },
            { icon: '🔒', text: 'Human-in-the-Loop Decision Support' },
            { icon: '📄', text: 'Server-Side OCR Text Extraction' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Decision Support', sub: 'Not auto-qualification' },
          { label: 'Source-Linked', sub: 'Every finding has evidence' },
          { label: 'Fully Auditable', sub: 'Complete decision trail' },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{s.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Login Form ─────────────────────────────────────────────────────────── */

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const { login, getHomeRoute } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError(''); setPendingMsg(''); setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(getHomeRoute(), { replace: true });
    } else if (result.pending) {
      setPendingMsg(result.error || 'Your account is pending admin approval.');
    } else {
      setError(result.error);
    }
  };

  const DEMOS = [
    { label: 'Bidder', email: 'bidder@apextech.in', pw: 'Bidder@2026', color: '#38bdf8' },
    { label: 'Officer', email: 'priya.nair@gem.gov.in', pw: 'Officer@2026', color: '#818cf8' },
    { label: 'Auditor', email: 'rajesh.kumar@audit.gov.in', pw: 'Auditor@2026', color: '#a78bfa' },
    { label: 'Admin', email: 'admin@gem.gov.in', pw: 'Admin@2026', color: '#f59e0b' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Welcome Back</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          Sign in to your BidSure AI account
        </p>
      </div>

      {/* Demo quick-fill */}
      <div style={{
        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 22,
      }}>
        <p style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          🔑 Quick Demo Access
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DEMOS.map(({ label, email: e, pw, color }) => (
            <button
              key={label}
              type="button"
              onClick={() => { setEmail(e); setPassword(pw); setError(''); setPendingMsg(''); }}
              style={{
                background: `rgba(${color === '#38bdf8' ? '56,189,248' : color === '#818cf8' ? '129,140,248' : color === '#a78bfa' ? '167,139,250' : '245,158,11'},0.12)`,
                border: `1px solid ${color}33`,
                color: color, borderRadius: 8, padding: '5px 12px', fontSize: 11,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 8 }}>
          Click a role to pre-fill credentials, then sign in.
        </p>
      </div>

      {pendingMsg && <Alert type="pending" message={pendingMsg} />}
      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} noValidate>
        <Field label="Email Address">
          <input
            id="login-email" type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="your.email@company.com"
            style={INPUT} autoComplete="email"
          />
        </Field>

        <Field label="Password">
          <div style={{ position: 'relative' }}>
            <input
              id="login-password" type={showPw ? 'text' : 'password'} value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter your password"
              style={{ ...INPUT, paddingRight: 44 }} autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
              display: 'flex', padding: 4,
            }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <button
          id="login-submit" type="submit" disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#3b82f6)',
            color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 4px 18px rgba(99,102,241,0.4)',
          }}
        >
          {loading ? <><Spinner size={16} /> Signing in…</> : <><Lock size={15} /> Sign In Securely</>}
        </button>
      </form>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} style={{
          background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, textDecoration: 'underline',
        }}>
          Register here →
        </button>
      </p>

      <div style={{
        marginTop: 20, padding: '11px 14px',
        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <ShieldCheck size={14} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, lineHeight: 1.6 }}>
          Authorized GeM Procurement Portal. All sessions are JWT-authenticated and logged in an immutable audit trail.
        </p>
      </div>
    </div>
  );
}

/* ─── Signup Form ────────────────────────────────────────────────────────── */

function SignupForm({ onSwitch }) {
  const INITIAL = {
    name: '', email: '', password: '', confirmPassword: '',
    role: 'Bidder', department: '',
    companyName: '', gstin: '', udyamNo: '', cin: '', requestNote: '',
  };
  const [form, setForm] = useState(INITIAL);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);
  const { signup, getHomeRoute } = useAuthStore();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email address is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.role === 'Bidder' && !form.companyName.trim()) { setError('Company name is required for Bidder registration.'); return; }
    if (form.role === 'Bidder' && !form.gstin.trim()) { setError('GSTIN is required for Bidder registration.'); return; }

    setLoading(true);
    const payload = { ...form, department: form.department || form.companyName || 'General' };
    const result = await signup(payload);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else if (result.autoLogin) {
      navigate(getHomeRoute(), { replace: true });
    } else {
      setPending(result.message);
    }
  };

  if (pending) {
    return (
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center', padding: '20px 0' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
          background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'loginPulse 2s ease-in-out infinite',
        }}>
          <Clock size={32} color="#fbbf24" />
        </div>
        <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Request Submitted!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.8, marginBottom: 28 }}>
          {pending}
        </p>
        <button type="button" onClick={onSwitch} style={{
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
          color: '#818cf8', borderRadius: 12, padding: '12px 32px',
          cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
        }}>
          ← Back to Sign In
        </button>
      </div>
    );
  }

  const isBidder = form.role === 'Bidder';
  const isOfficer = form.role === 'Procurement Officer';

  return (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create Account</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          {isBidder
            ? 'Register as a Bidder — your account is activated immediately.'
            : 'Compliance Auditors are activated instantly. Officers require admin approval.'}
        </p>
      </div>

      {error && <Alert type="error" message={error} />}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name + Role */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <Field label="Full Name">
            <input id="signup-name" type="text" value={form.name} onChange={set('name')}
              placeholder="Vikram Mehta" style={INPUT} autoComplete="name" />
          </Field>
          <Field label="Account Type">
            <select id="signup-role" value={form.role} onChange={set('role')} style={{ ...INPUT, cursor: 'pointer' }}>
              <option value="Bidder">Bidder (Vendor / Contractor)</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Compliance Auditor">Compliance Auditor</option>
            </select>
          </Field>
        </div>

        {/* Email + Dept */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <Field label="Email Address">
            <input id="signup-email" type="email" value={form.email} onChange={set('email')}
              placeholder="name@company.com" style={INPUT} autoComplete="email" />
          </Field>
          <Field label={isBidder ? 'Industry Category' : 'Department / Ministry'}>
            <input id="signup-department" type="text" value={form.department} onChange={set('department')}
              placeholder={isBidder ? 'e.g. IT & Software' : 'e.g. Ministry of Heavy Industries'}
              style={INPUT} />
          </Field>
        </div>

        {/* Bidder Business Details */}
        {isBidder && (
          <div style={{
            background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 12, padding: 16, marginBottom: 14,
          }}>
            <div style={{ color: '#38bdf8', fontSize: 11, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={13} /> Vendor & Business Details
            </div>
            <Field label="Registered Company Name">
              <input id="signup-company" type="text" value={form.companyName} onChange={set('companyName')}
                placeholder="Apex Tech Solutions Pvt Ltd" style={INPUT} required />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="GSTIN">
                <input id="signup-gstin" type="text" value={form.gstin} onChange={set('gstin')}
                  placeholder="27AAACA0000A1Z5" style={{ ...INPUT, fontFamily: 'monospace' }} />
              </Field>
              <Field label="Udyam Registration">
                <input id="signup-udyam" type="text" value={form.udyamNo} onChange={set('udyamNo')}
                  placeholder="UDYAM-MH-03-0012345" style={{ ...INPUT, fontFamily: 'monospace' }} />
              </Field>
            </div>
            <Field label="CIN / Business Registration Number">
              <input id="signup-cin" type="text" value={form.cin} onChange={set('cin')}
                placeholder="U72900MH2018PTC312456" style={{ ...INPUT, fontFamily: 'monospace' }} />
            </Field>
          </div>
        )}

        {/* Officer note */}
        {isOfficer && (
          <>
            <Field label="Reason for Access Request">
              <textarea id="signup-note" value={form.requestNote} onChange={set('requestNote')}
                rows={2} placeholder="Briefly describe your role and reason for officer access..."
                style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }} />
            </Field>
            <Alert type="pending" message="Procurement Officer accounts require Admin approval before you can sign in. You'll receive confirmation once approved." />
          </>
        )}

        {/* Passwords */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <Field label="Password">
            <div style={{ position: 'relative' }}>
              <input id="signup-password" type={showPw ? 'text' : 'password'} value={form.password}
                onChange={set('password')} placeholder="Min. 8 characters"
                style={{ ...INPUT, paddingRight: 42 }} autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', display: 'flex', padding: 4,
              }}>
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password">
            <input id="signup-confirm" type={showPw ? 'text' : 'password'} value={form.confirmPassword}
              onChange={set('confirmPassword')} placeholder="Re-enter password"
              style={INPUT} autoComplete="new-password" />
          </Field>
        </div>

        <button id="signup-submit" type="submit" disabled={loading} style={{
          width: '100%', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700,
          background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg,#10b981,#059669)',
          color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: loading ? 'none' : '0 4px 18px rgba(16,185,129,0.35)',
        }}>
          {loading ? <><Spinner size={16} /> Creating account…</> : <><UserPlus size={15} /> Create Account</>}
        </button>
      </form>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginTop: 18 }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{
          background: 'none', border: 'none', color: '#818cf8',
          cursor: 'pointer', fontSize: 12, fontWeight: 700, textDecoration: 'underline',
        }}>
          Sign in →
        </button>
      </p>
    </div>
  );
}

/* ─── Root Page ──────────────────────────────────────────────────────────── */

export default function LoginPage() {
  const [tab, setTab] = useState('login');

  return (
    <>
      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }
        @keyframes loginPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.3); }
          50% { box-shadow: 0 0 0 12px rgba(245,158,11,0); }
        }
        @keyframes loginFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-right-panel {
          animation: loginFadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
        }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(99,102,241,0.6) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        input[type="password"]:focus {
          border-color: rgba(99,102,241,0.6) !important;
        }
        option { background: #1e1e2e; color: white; }
        @media (max-width: 768px) {
          .login-brand-panel { display: none !important; }
          .login-right-panel { padding: 32px 24px !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#090d16', display: 'flex' }}>
        {/* Left branding */}
        <div className="login-brand-panel">
          <BrandPanel />
        </div>

        {/* Right form panel */}
        <div
          className="login-right-panel"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 52px', overflowY: 'auto',
          }}
        >
          {tab === 'login'
            ? <LoginForm onSwitch={() => setTab('signup')} />
            : <SignupForm onSwitch={() => setTab('login')} />}
        </div>
      </div>
    </>
  );
}
