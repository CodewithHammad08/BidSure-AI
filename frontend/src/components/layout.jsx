import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users, FolderOpen,
  ShieldCheck, AlertTriangle, CheckSquare, ClipboardList,
  Settings, LogOut, ChevronRight, Scale
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

const NAV_ITEMS = [
  { label: 'Overview',     icon: LayoutDashboard, href: '/' },
  { label: 'Tenders',      icon: FileText,         href: '/tenders' },
  { label: 'Bidders',      icon: Users,            href: '/bidders' },
  { label: 'Documents',    icon: FolderOpen,       href: '/documents' },
  { label: 'Compliance',   icon: ShieldCheck,      href: '/compliance' },
  { label: 'Findings',     icon: AlertTriangle,    href: '/findings' },
  { label: 'Verification', icon: CheckSquare,      href: '/verification' },
  { label: 'Audit Trail',  icon: ClipboardList,    href: '/audit' },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">
            <Scale size={20} color="white" />
          </div>
          <div>
            <div className="sidebar-title">
              BidSure <span style={{ fontSize: 10, background: 'rgba(79, 70, 229, 0.25)', border: '1px solid rgba(79, 70, 229, 0.4)', color: '#818cf8', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>AI</span>
            </div>
            <div className="sidebar-subtitle">Compliance Intelligence</div>
          </div>
        </div>
      </div>

      {/* System notice */}
      <div className="sidebar-notice">
        <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: 2 }}>⚠ DECISION SUPPORT</div>
        <div>All final determinations remain with the Procurement Officer.</div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-section-title">Navigation</div>
        <div className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} color={isActive ? '#ffffff' : '#94a3b8'} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} color="#818cf8" style={{ marginLeft: 'auto' }} />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom: user + settings */}
      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          style={{ marginBottom: 8 }}
        >
          <Settings size={16} color="#94a3b8" />
          <span>Settings</span>
        </NavLink>

        {user && (
          <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="sidebar-user-card">
              <div className="sidebar-avatar">{user.avatarInitials}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="sidebar-user-name">{user.name}</div>
                <div className="sidebar-user-role">{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="sidebar-link"
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }}
            >
              <LogOut size={15} color="#f87171" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export function Topbar({ breadcrumbs }) {
  const { user } = useAuthStore();

  return (
    <header className="topbar">
      <div className="breadcrumbs">
        {breadcrumbs && breadcrumbs.map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <ChevronRight size={12} color="#94a3b8" />}
            <span className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? 'active' : ''}`}>
              {b.label}
            </span>
          </span>
        ))}
      </div>
      <div className="topbar-right">
        <div className="topbar-user-info">
          <div className="topbar-user-name">{user?.name}</div>
          <div className="topbar-user-dept">{user?.department}</div>
        </div>
        <div className="topbar-avatar">{user?.avatarInitials}</div>
      </div>
    </header>
  );
}

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-wrapper">
        {children}
      </div>
    </div>
  );
}
