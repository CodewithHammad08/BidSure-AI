import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Eye, EyeOff, ShieldCheck, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Spinner } from '../components/shared';

export default function LoginPage() {
  const [email, setEmail] = useState('officer@gem.gov.in');
  const [password, setPassword] = useState('BidSure@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex' }}>
      {/* Left — branding panel */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(160deg, #1e3a8a 0%, #0f172a 60%)',
        borderRight: '1px solid #1e293b',
        padding: '60px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={20} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>BidSure AI</div>
              <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>Procurement Compliance Intelligence</div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: 'white', fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              AI-Powered<br />Bid Compliance<br />Verification
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
              Convert fragmented tender and bidder documents into evidence-linked compliance intelligence — enabling procurement officers to verify requirements faster and make better-informed, auditable decisions.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '⚖', text: 'SIH Problem Statement SIH26100' },
              { icon: '🏛', text: 'GeM Procurement — Ministry of Heavy Industries' },
              { icon: '🤖', text: 'AI-assisted — Officer decides' },
            ].map((item) => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ color: '#64748b', fontSize: 12 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'Decision Support', sub: 'Not auto-qualification' },
              { label: 'Source-Linked', sub: 'Every finding has evidence' },
              { label: 'Fully Auditable', sub: 'Complete decision trail' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{stat.label}</div>
                <div style={{ color: '#475569', fontSize: 11 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Procurement Officer Sign In</h2>
            <p style={{ color: '#64748b', fontSize: 13 }}>Secure access to the BidSure AI Compliance Platform</p>
          </div>

          {/* Demo credentials notice */}
          <div style={{ background: '#1e293b', border: '1px solid #2563eb40', borderRadius: 8, padding: '12px 16px', marginBottom: 24 }}>
            <p style={{ color: '#93c5fd', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Demo Credentials</p>
            <p style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>Email: officer@gem.gov.in</p>
            <p style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace' }}>Password: BidSure@2026</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="officer@gem.gov.in"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 8,
                  background: '#1e293b', border: '1px solid #334155', color: 'white',
                  fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px', borderRadius: 8,
                    background: '#1e293b', border: '1px solid #334155', color: 'white',
                    fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, marginTop: 12 }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: '#3b82f6' }}
              />
              <label htmlFor="remember" style={{ color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}>
                Remember this device
              </label>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ color: '#dc2626', fontSize: 13 }}>⚠ {error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? '#1d4ed8' : '#2563eb',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 0.2s',
              }}
            >
              {loading ? <><Spinner size={16} /> Authenticating…</> : <><Lock size={15} /> Sign In Securely</>}
            </button>
          </form>

          {/* Security notice */}
          <div style={{ marginTop: 28, padding: '14px 16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <ShieldCheck size={14} color="#475569" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: '#475569', fontSize: 11, lineHeight: 1.6 }}>
                This system is for authorized GeM Procurement Officers only. All activity is logged for audit purposes. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
