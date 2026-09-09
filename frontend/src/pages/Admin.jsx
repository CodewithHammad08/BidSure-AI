import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserX, UserPlus, ShieldAlert,
  Clock, CheckCircle, XCircle, Eye, EyeOff, RefreshCw, LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

// ── helpers ─────────────────────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: '2px solid rgba(255,255,255,0.25)', borderTopColor: 'white',
      borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      verticalAlign: 'middle', marginRight: 6,
    }} />
  );
}

function StatusBadge({ status }) {
  const map = {
    ACTIVE: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: '● Active' },
    PENDING_APPROVAL: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '⏳ Pending' },
    REJECTED: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: '✕ Rejected' },
  };
  const s = map[status] || map.PENDING_APPROVAL;
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.color}33`,
      borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700,
    }}>
      {s.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const colors = {
    Admin: '#a78bfa',
    'Procurement Officer': '#38bdf8',
    'Compliance Auditor': '#34d399',
  };
  return (
    <span style={{
      background: `${colors[role] || '#94a3b8'}18`,
      color: colors[role] || '#94a3b8',
      border: `1px solid ${colors[role] || '#94a3b8'}33`,
      borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700,
    }}>
      {role}
    </span>
  );
}

const CARD = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  padding: '20px 24px',
};
const INPUT_STYLE = {
  width: '100%', padding: '10px 14px', borderRadius: 9,
  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
  color: 'white', fontSize: 13, outline: 'none', boxSizing: 'border-box',
};
const LABEL = {
  display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 10,
  fontWeight: 700, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em',
};

// ─── Add Officer Modal ───────────────────────────────────────────────────────
function AddOfficerModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addOfficer } = useAuthStore();

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await addOfficer(form);
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onSuccess(res.user);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#111827', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 460,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h3 style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>
            <UserPlus size={18} style={{ verticalAlign: 'middle', marginRight: 8, color: '#38bdf8' }} />
            Add Procurement Officer
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '9px 13px', marginBottom: 14 }}>
            <p style={{ color: '#f87171', fontSize: 12 }}>⚠ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>Full Name</label>
            <input type="text" value={form.name} onChange={set('name')} required placeholder="Officer Name" style={INPUT_STYLE} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>Official Email</label>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="officer@gem.gov.in" style={INPUT_STYLE} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={LABEL}>Department</label>
            <input type="text" value={form.department} onChange={set('department')} required placeholder="e.g. Ministry of Heavy Industries" style={INPUT_STYLE} />
          </div>
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <label style={LABEL}>Temporary Password</label>
            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
              required minLength={8} style={{ ...INPUT_STYLE, paddingRight: 40 }} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{
              position: 'absolute', right: 12, bottom: 10,
              background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)',
            }}>
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '11px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '11px', borderRadius: 9, border: 'none',
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <><Spinner /> Creating…</> : <><UserPlus size={14} style={{ marginRight: 6 }} /> Add Officer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout, getOfficerRequests, getAllUsers, approveOfficer, rejectOfficer } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState('requests'); // 'requests' | 'users'
  const [requests, setRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // { userId: 'approve'|'reject' }
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRequests = async () => {
    setLoadingReqs(true);
    const data = await getOfficerRequests();
    setRequests(data);
    setLoadingReqs(false);
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    const data = await getAllUsers();
    setAllUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
    fetchRequests();
    fetchUsers();
  }, []);

  const handleApprove = async (userId, name) => {
    setActionLoading((a) => ({ ...a, [userId]: 'approve' }));
    await approveOfficer(userId);
    showToast(`✓ ${name} has been approved as Procurement Officer.`);
    fetchRequests();
    fetchUsers();
    setActionLoading((a) => ({ ...a, [userId]: null }));
  };

  const handleReject = async (userId, name) => {
    setActionLoading((a) => ({ ...a, [userId]: 'reject' }));
    await rejectOfficer(userId);
    showToast(`${name}'s request has been rejected.`, 'warn');
    fetchRequests();
    fetchUsers();
    setActionLoading((a) => ({ ...a, [userId]: null }));
  };

  const handleOfficerAdded = (newUser) => {
    setShowAddModal(false);
    showToast(`✓ Officer "${newUser.name}" created and activated.`);
    fetchUsers();
  };

  if (!user || user.role !== 'Admin') return null;

  const TAB_BTN = (id, label, count) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: '9px 18px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer',
        border: 'none',
        background: tab === id ? 'rgba(99,102,241,0.2)' : 'transparent',
        color: tab === id ? '#818cf8' : 'rgba(255,255,255,0.4)',
        borderBottom: tab === id ? '2px solid #6366f1' : '2px solid transparent',
        transition: 'all 0.15s',
      }}
    >
      {label} {count != null && <span style={{
        background: 'rgba(239,68,68,0.2)', color: '#f87171',
        borderRadius: 20, padding: '1px 7px', fontSize: 10, marginLeft: 5,
      }}>{count}</span>}
    </button>
  );

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: toast.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
          border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}`,
          borderRadius: 10, padding: '12px 18px', color: toast.type === 'success' ? '#34d399' : '#fbbf24',
          fontSize: 13, fontWeight: 600, boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
          {toast.msg}
        </div>
      )}

      {showAddModal && <AddOfficerModal onClose={() => setShowAddModal(false)} onSuccess={handleOfficerAdded} />}

      <div style={{ minHeight: '100vh', background: '#090d16', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        {/* Top bar */}
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '0 32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 60,
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>BidSure AI</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 6px' }}>|</span>
            <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 700 }}>Admin Console</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>{user.name}</div>
              <div style={{ color: '#a78bfa', fontSize: 11 }}>{user.role}</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg,#a78bfa,#6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: 'white',
            }}>
              {user.avatarInitials}
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171', borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
            }}>
              <LogOut size={13} /> Logout
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          {/* Header */}
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>User Management</h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                Approve officer access requests and manage all platform users.
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)', border: 'none',
              color: 'white', borderRadius: 10, padding: '11px 20px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13,
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}>
              <UserPlus size={15} /> Add Officer Manually
            </button>
          </div>

          {/* KPI row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { label: 'Total Users', value: allUsers.length, icon: <Users size={18} color="#818cf8" />, color: '#818cf8' },
              { label: 'Pending Requests', value: requests.length, icon: <Clock size={18} color="#fbbf24" />, color: '#fbbf24' },
              { label: 'Active Officers', value: allUsers.filter(u => u.role === 'Procurement Officer' && u.status === 'ACTIVE').length, icon: <UserCheck size={18} color="#34d399" />, color: '#34d399' },
            ].map((k) => (
              <div key={k.label} style={{ ...CARD, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${k.color}15`, border: `1px solid ${k.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {k.icon}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'white', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 3 }}>{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {TAB_BTN('requests', '⏳ Officer Requests', requests.length > 0 ? requests.length : null)}
            {TAB_BTN('users', '👥 All Users')}
          </div>

          {/* ── Officer Requests Tab ────────────────────────────────────────── */}
          {tab === 'requests' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  {requests.length === 0 ? 'No pending requests.' : `${requests.length} officer account(s) awaiting approval.`}
                </p>
                <button onClick={fetchRequests} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)', borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {loadingReqs ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                  <Spinner size={24} /> Loading requests…
                </div>
              ) : requests.length === 0 ? (
                <div style={{
                  ...CARD, textAlign: 'center', padding: 48,
                  color: 'rgba(255,255,255,0.25)',
                }}>
                  <CheckCircle size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                  All caught up! No pending officer requests.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {requests.map((req) => (
                    <div key={req.id} style={{
                      ...CARD,
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 20,
                    }}>
                      <div style={{ display: 'flex', gap: 14, flex: 1 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 800, color: 'white',
                        }}>
                          {req.avatarInitials}
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{req.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{req.email}</div>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 1 }}>{req.department}</div>
                          {req.requestNote && (
                            <div style={{
                              marginTop: 8, padding: '6px 10px',
                              background: 'rgba(255,255,255,0.04)', borderRadius: 7,
                              color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.5,
                              border: '1px solid rgba(255,255,255,0.07)',
                            }}>
                              💬 {req.requestNote}
                            </div>
                          )}
                          <div style={{ marginTop: 8 }}>
                            <StatusBadge status={req.status} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => handleReject(req.id, req.name)}
                          disabled={!!actionLoading[req.id]}
                          style={{
                            padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 5,
                            opacity: actionLoading[req.id] ? 0.6 : 1,
                          }}
                        >
                          {actionLoading[req.id] === 'reject' ? <Spinner size={12} /> : <XCircle size={13} />}
                          Reject
                        </button>
                        <button
                          onClick={() => handleApprove(req.id, req.name)}
                          disabled={!!actionLoading[req.id]}
                          style={{
                            padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 12,
                            background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none',
                            color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 5,
                            opacity: actionLoading[req.id] ? 0.6 : 1,
                          }}
                        >
                          {actionLoading[req.id] === 'approve' ? <Spinner size={12} /> : <UserCheck size={13} />}
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── All Users Tab ───────────────────────────────────────────────── */}
          {tab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  {allUsers.length} registered user(s) in the system.
                </p>
                <button onClick={fetchUsers} style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)', borderRadius: 8, padding: '6px 12px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {loadingUsers ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>
                  <Spinner size={24} /> Loading users…
                </div>
              ) : (
                <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        {['User', 'Email', 'Department', 'Role', 'Status', 'Joined'].map((h) => (
                          <th key={h} style={{
                            padding: '12px 16px', textAlign: 'left',
                            color: 'rgba(255,255,255,0.35)', fontSize: 11,
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                          }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u, i) => (
                        <tr key={u.id} style={{
                          borderBottom: i < allUsers.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '13px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0,
                              }}>
                                {u.avatarInitials}
                              </div>
                              <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{u.email}</td>
                          <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{u.department}</td>
                          <td style={{ padding: '13px 16px' }}><RoleBadge role={u.role} /></td>
                          <td style={{ padding: '13px 16px' }}><StatusBadge status={u.status} /></td>
                          <td style={{ padding: '13px 16px', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
