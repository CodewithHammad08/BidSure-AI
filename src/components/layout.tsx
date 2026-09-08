import { NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard, FileText, Users, FolderOpen,
  ShieldCheck, AlertTriangle, CheckSquare, ClipboardList,
  Settings, LogOut, ChevronRight, Scale
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

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
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <Scale size={18} color="white" />
          </div>
          <div>
            <div className="text-white font-extrabold text-base tracking-tight leading-none flex items-center gap-1.5">
              BidSure <span className="text-indigo-400 text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 font-semibold">AI</span>
            </div>
            <div className="text-slate-400 text-[10px] font-medium leading-none mt-1">Compliance Intelligence Platform</div>
          </div>
        </div>
      </div>

      {/* System notice */}
      <div className="px-3.5 py-2.5 bg-indigo-950/40 border border-indigo-500/20 mx-3 mt-3.5 rounded-lg shadow-inner">
        <div className="text-[10px] text-indigo-300 font-medium leading-relaxed flex items-start gap-1.5">
          <span className="text-amber-400 font-bold flex-shrink-0">⚠</span>
          <span><strong>DECISION SUPPORT:</strong> All final determinations remain with the Procurement Officer.</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4">
        <div className="px-3 mb-1">
          <span className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider px-2">Navigation</span>
        </div>
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all group relative',
                    isActive
                      ? 'nav-item-active'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={15} className={isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-neutral-300'} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight size={12} className="ml-auto text-blue-400" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: user + settings */}
      <div className="border-t border-neutral-800 p-3 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
              isActive ? 'nav-item-active' : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
            )
          }
        >
          <Settings size={14} className="text-neutral-500" />
          <span className="font-medium">Settings</span>
        </NavLink>

        {user && (
          <div className="mt-2 pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">{user.avatarInitials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium truncate">{user.name}</div>
                <div className="text-neutral-500 text-[10px] truncate">{user.role}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:bg-neutral-800 hover:text-red-400 transition-all w-full mt-1"
            >
              <LogOut size={13} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================================
// TOPBAR
// ============================================================
interface TopbarProps {
  breadcrumbs?: { label: string }[];
}

export function Topbar({ breadcrumbs }: TopbarProps) {
  const { user } = useAuthStore();

  return (
    <header className="topbar gap-3">
      {breadcrumbs && (
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} />}
              <span className={i === breadcrumbs.length - 1 ? 'text-neutral-900 font-medium' : ''}>{b.label}</span>
            </span>
          ))}
        </div>
      )}
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <div className="text-xs font-semibold text-neutral-800">{user?.name}</div>
          <div className="text-[10px] text-neutral-500">{user?.department}</div>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{user?.avatarInitials}</span>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// APP SHELL
// ============================================================
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="main-content flex-1">
        {children}
      </div>
    </div>
  );
}
