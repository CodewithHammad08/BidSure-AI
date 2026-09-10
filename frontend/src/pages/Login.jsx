import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ShieldCheck, Lock, UserPlus, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

function Spinner({ size = 18 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        verticalAlign: 'middle',
        marginRight: 8,
      }}
    />
  );
}

const INPUT_STYLE = {
  width: '100%',
  padding: '11px 16px',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'white',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};
const LABEL_STYLE = {
  display: 'block',
  color: 'rgba(255,255,255,0.5)',
  fontSize: 11,
  fontWeight: 700,
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

// ─── Left branding panel ───────────────────────────────────────────────────
function BrandPanel() {
  return (
    <div style={{
      width: '42%',
      background: 'linear-gradient(160deg,#1e1b4b 0%,#090d16 65%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '56px 52px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg,#6366f1 0%,#3b82f6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Scale size={22} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>BidSure AI</div>
            <div style={{ color: '#22d3ee', fontSize: 11, marginTop: 3, fontWeight: 600, letterSpacing: '0.06em' }}>
              Procurement Compliance Intelligence
            </div>
          </div>
        </div>

        <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
          AI-Powered<br />Bid Compliance<br />Verification Platform
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.75, marginBottom: 36 }}>
          Convert fragmented tender and bidder documents into evidence-linked compliance intelligence — enabling procurement officers to verify requirements faster and make better-informed, auditable decisions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '⚖️', text: 'SIH Problem Statement SIH26100' },
            { icon: '🏛️', text: 'GeM Procurement — Ministry of Heavy Industries' },
            { icon: '🧠', text: 'AI/ML Risk Prediction Engine' },
            { icon: '🔒', text: 'Human-in-the-Loop Decision Support' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', gap: 24 }}>
        {[
          { label: 'Decision Support', sub: 'Not auto-qualification' },
          { label: 'Source-Linked', sub: 'Every finding has evidence' },
          { label: 'Fully Auditable', sub: 'Complete decision trail' },
        ].map((s) => (
          <div key={s.label}>
            <div style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{s.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LOGIN FORM ────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingMsg, setPendingMsg] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingMsg('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'Bidder') {
        navigate('/portal');
      } else if (currentUser?.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else if (result.pending) {
      setPendingMsg(result.error);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Sign In</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          Secure access to BidSure AI Compliance Platform
        </p>
      </div>

      {/* Demo credentials hint */}
      <div style={{
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: 10, padding: '12px 16px', marginBottom: 22,
      }}>
        <p style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🔑 Quick Demo Accounts</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            ['Bidder (Vendor)', 'bidder@apextech.in', 'Bidder@2026'],
            ['Procurement Officer', 'priya.nair@gem.gov.in', 'Officer@2026'],
            ['Compliance Auditor', 'rajesh.kumar@audit.gov.in', 'Auditor@2026'],
            ['System Admin', 'admin@gem.gov.in', 'Admin@2026'],
          ].map(([role, em, pw]) => (
            <button
              key={role}
              type="button"
              onClick={() => { setEmail(em); setPassword(pw); }}
              style={{
                background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'monospace', padding: '2px 0',
              }}
            >
              <strong style={{ color: '#38bdf8' }}>{role}:</strong> {em} / {pw}
            </button>
          ))}
        </div>
      </div>

      {pendingMsg && (
        <div style={{
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 18, display: 'flex', gap: 8,
        }}>
          <Clock size={15} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: '#fbbf24', fontSize: 12 }}>{pendingMsg}</p>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 18,
        }}>
          <p style={{ color: '#f87171', fontSize: 13 }}>⚠ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={LABEL_STYLE}>Email Address</label>
          <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            required placeholder="your.email@company.com" style={INPUT_STYLE} />
        </div>

        <div style={{ marginBottom: 22, position: 'relative' }}>
          <label style={LABEL_STYLE}>Password</label>
          <div style={{ position: 'relative' }}>
            <input id="login-password" type={showPw ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} required style={{ ...INPUT_STYLE, paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button id="login-submit" type="submit" disabled={loading} style={{
          width: '100%', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: 'linear-gradient(135deg,#6366f1,#3b82f6)', color: 'white',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
        }}>
          {loading ? <><Spinner size={16} /> Authenticating…</> : <><Lock size={15} /> Sign In Securely</>}
        </button>
      </form>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch} style={{
          background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
        }}>
          Register here →
        </button>
      </p>

      <div style={{
        marginTop: 20, padding: '12px 14px',
        background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <ShieldCheck size={14} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, lineHeight: 1.6 }}>
            Authorized GeM Procurement Portal access. Bidders and officers must provide verified credentials.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SIGNUP FORM ───────────────────────────────────────────────────────────
function SignupForm({ onSwitch }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Bidder',
    department: 'Apex Technologies',
    companyName: 'Apex Tech Solutions Pvt Ltd',
    gstin: '27AAACA0000A1Z5',
    udyamNo: 'UDYAM-MH-03-0012345',
    cin: 'U72900MH2018PTC312456',
    requestNote: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { autoLogin, pending, message }
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (form.password.length < 8) {
      return setError('Password must be at least 8 characters.');
    }

    setLoading(true);
    const result = await signup(form);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    } else if (result.autoLogin) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.role === 'Bidder') {
        navigate('/portal');
      } else {
        navigate('/');
      }
    } else {
      setSuccess({ pending: true, message: result.message });
    }
  };

  if (success?.pending) {
    return (
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <Clock size={28} color="#fbbf24" />
        </div>
        <h2 style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Request Submitted!</h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>
          {success.message}
        </p>
        <button type="button" onClick={onSwitch} style={{
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)',
          color: '#818cf8', borderRadius: 10, padding: '11px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 13,
        }}>
          ← Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Create Account</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          Register for BidSure AI — Bidders are auto-activated immediately.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
        }}>
          <p style={{ color: '#f87171', fontSize: 13 }}>⚠ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={LABEL_STYLE}>Full Name</label>
            <input id="signup-name" type="text" value={form.name} onChange={set('name')}
              required placeholder="Vikram Mehta" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>User Role</label>
            <select id="signup-role" value={form.role} onChange={set('role')} style={{ ...INPUT_STYLE, cursor: 'pointer' }}>
              <option value="Bidder">Bidder (Vendor / Contractor)</option>
              <option value="Procurement Officer">Procurement Officer</option>
              <option value="Compliance Auditor">Compliance Auditor</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={LABEL_STYLE}>Email Address</label>
            <input id="signup-email" type="email" value={form.email} onChange={set('email')}
              required placeholder="name@company.com" style={INPUT_STYLE} />
          </div>
          <div>
            <label style={LABEL_STYLE}>Department / Category</label>
            <input id="signup-department" type="text" value={form.department} onChange={set('department')}
              required placeholder="e.g. IT & Software Infrastructure" style={INPUT_STYLE} />
          </div>
        </div>

        {form.role === 'Bidder' && (
          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: '0.05em' }}>
              🏢 BIDDER & VENDOR BUSINESS DETAILS
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={LABEL_STYLE}>Registered Company Name</label>
              <input id="signup-company" type="text" value={form.companyName} onChange={set('companyName')}
                required placeholder="Apex Tech Solutions Pvt Ltd" style={INPUT_STYLE} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={LABEL_STYLE}>GSTIN Number</label>
                <input id="signup-gstin" type="text" value={form.gstin} onChange={set('gstin')}
                  required placeholder="27AAACA0000A1Z5" style={INPUT_STYLE} />
              </div>
              <div>
                <label style={LABEL_STYLE}>Udyam Registration</label>
                <input id="signup-udyam" type="text" value={form.udyamNo} onChange={set('udyamNo')}
                  placeholder="UDYAM-MH-03-0012345" style={INPUT_STYLE} />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={LABEL_STYLE}>CIN / Business Registration</label>
              <input id="signup-cin" type="text" value={form.cin} onChange={set('cin')}
                placeholder="U72900MH2018PTC312456" style={INPUT_STYLE} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ position: 'relative' }}>
            <label style={LABEL_STYLE}>Password</label>
            <input id="signup-password" type={showPw ? 'text' : 'password'} value={form.password}
              onChange={set('password')} required minLength={8}
              style={{ ...INPUT_STYLE, paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: 'absolute', right: 12, bottom: 11,
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
            }}>
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div>
            <label style={LABEL_STYLE}>Confirm Password</label>
            <input id="signup-confirm" type={showPw ? 'text' : 'password'} value={form.confirmPassword}
              onChange={set('confirmPassword')} required style={INPUT_STYLE} />
          </div>
        </div>

        {form.role === 'Procurement Officer' && (
          <div style={{ marginBottom: 14 }}>
            <label style={LABEL_STYLE}>Request Note (Why are you requesting officer access?)</label>
            <textarea id="signup-note" value={form.requestNote} onChange={set('requestNote')}
              rows={2} placeholder="Briefly describe your role and reason for access..."
              style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
        )}

        {form.role === 'Procurement Officer' && (
          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8,
          }}>
            <Clock size={14} color="#fbbf24" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: '#fbbf24', fontSize: 12, lineHeight: 1.6 }}>
              Procurement Officer accounts require Admin approval before login access is granted.
            </p>
          </div>
        )}

        <button id="signup-submit" type="submit" disabled={loading} style={{
          width: '100%', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 700,
          background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white',
          border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
        }}>
          {loading ? <><Spinner size={16} /> Creating account…</> : <><UserPlus size={15} /> Create Account</>}
        </button>
      </form>

      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginTop: 18 }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} style={{
          background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
        }}>
          Sign in →
        </button>
      </p>
    </div>
  );
}

// ─── ROOT PAGE ─────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus, textarea:focus {
          border-color: rgba(99,102,241,0.6) !important;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
        option { background: #1e1e2e; color: white; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#090d16', display: 'flex' }}>
        <BrandPanel />

        {/* Right panel */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px 48px', overflowY: 'auto',
        }}>
          {tab === 'login'
            ? <LoginForm onSwitch={() => setTab('signup')} />
            : <SignupForm onSwitch={() => setTab('login')} />}
        </div>
      </div>
    </>
  );
}
