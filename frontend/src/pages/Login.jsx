import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { Spinner } from '../components/shared.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('officer@gem.gov.in');
  const [password, setPassword] = useState('BidSure@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Use officer@gem.gov.in / BidSure@2026');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', display: 'flex' }}>
      {/* Left branding panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #1e1b4b 0%, #090d16 60%)',
        borderRight: '1px solid var(--border-subtle)',
        padding: '60px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={22} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1 }}>BidSure AI</div>
              <div style={{ color: 'var(--cyan-400)', fontSize: 11, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>Procurement Compliance Intelligence</div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: 'white', fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              AI-Powered<br />Bid Compliance<br />Verification Platform
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
              Convert fragmented tender and bidder documents into evidence-linked compliance intelligence — enabling procurement officers to verify requirements faster and make better-informed, auditable decisions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '⚖', text: 'SIH Problem Statement SIH26100' },
              { icon: '🏛', text: 'GeM Procurement — Ministry of Heavy Industries' },
              { icon: '🤖', text: 'AI-assisted Decision Support Engine' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ color: 'var(--text-subtle)', fontSize: 13 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 24 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Decision Support', sub: 'Not auto-qualification' },
              { label: 'Source-Linked', sub: 'Every finding has evidence' },
              { label: 'Fully Auditable', sub: 'Complete decision trail' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{stat.label}</div>
                <div style={{ color: 'var(--text-subtle)', fontSize: 11 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ color: 'white', fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Procurement Officer Sign In</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Secure access to BidSure AI Compliance Platform</p>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-accent)', borderRadius: 10, padding: '14px 18px', marginBottom: 24 }}>
            <p style={{ color: 'var(--cyan-400)', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Demo Credentials</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'monospace' }}>Email: officer@gem.gov.in</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'monospace' }}>Password: BidSure@2026</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="officer@gem.gov.in"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', color: 'white',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px', borderRadius: 10,
                    background: 'rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-subtle)', color: 'white',
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, marginTop: 14 }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#6366f1' }}
              />
              <label htmlFor="remember" style={{ color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
                Remember this device
              </label>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 18 }}>
                <p style={{ color: '#f87171', fontSize: 13 }}>⚠ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 700
              }}
            >
              {loading ? <><Spinner size={16} /> Authenticating…</> : <><Lock size={16} /> Sign In Securely</>}
            </button>
          </form>

          <div style={{ marginTop: 28, padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <ShieldCheck size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: 'var(--text-subtle)', fontSize: 11, lineHeight: 1.6 }}>
                Authorized GeM Procurement Portal access only. All interactions logged in immutable audit trail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
