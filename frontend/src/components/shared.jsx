import { Link } from 'react-router-dom';
import {
  CheckCircle, AlertTriangle, XCircle, Clock,
  FileText, ShieldCheck, AlertCircle, ChevronRight
} from 'lucide-react';

export function StatusBadge({ status }) {
  const configs = {
    PASS: { label: 'Compliant', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle },
    REVIEW_REQUIRED: { label: 'Review Required', bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: AlertTriangle },
    MISSING: { label: 'Missing Document', bg: '#fef2f2', color: '#dc2626', border: '#fecaca', icon: XCircle },
    EXPIRED: { label: 'Expired', bg: '#fef2f2', color: '#dc2626', border: '#fecaca', icon: Clock },
    MISMATCH: { label: 'Mismatch Flagged', bg: '#fff7ed', color: '#ea580c', border: '#ffedd5', icon: AlertCircle },
    ACTIVE: { label: 'Active', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle },
    CLOSED: { label: 'Closed', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', icon: FileText },
  };

  const cfg = configs[status] || { label: status, bg: '#f8fafc', color: '#64748b', border: '#e2e8f0', icon: FileText };
  const Icon = cfg.icon;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap'
    }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

export function RiskChip({ level }) {
  const configs = {
    LOW: { label: 'Low Risk', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    MEDIUM: { label: 'Medium Risk', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    HIGH: { label: 'High Risk', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };

  const cfg = configs[level] || { label: level, bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const configs = {
    CRITICAL: { label: 'Critical', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    HIGH: { label: 'High', bg: '#fff7ed', color: '#ea580c', border: '#ffedd5' },
    MEDIUM: { label: 'Medium', bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    LOW: { label: 'Low', bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  };

  const cfg = configs[severity] || { label: severity, bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      textTransform: 'uppercase', letterSpacing: '0.04em'
    }}>
      {cfg.label}
    </span>
  );
}

export function KpiCard({ label, value, sub, icon, color }) {
  return (
    <div className="card" style={{ padding: '20px 24px', borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: color
        }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{sub}</div>
    </div>
  );
}

export function SectionCard({ title, subtitle, actions, children }) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {(title || actions) && (
        <div className="section-card-header">
          <div>
            <div className="section-card-title">{title}</div>
            {subtitle && <div className="section-card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }) {
  return (
    <div className="page-header-container">
      {breadcrumbs && (
        <div style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <ChevronRight size={12} color="var(--text-muted)" />}
              {b.href ? (
                <Link to={b.href} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{b.label}</Link>
              ) : (
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{b.label}</span>
              )}
            </span>
          ))}
        </div>
      )}
      <div className="page-header-main">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
      <ShieldCheck size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{title}</h3>
      {description && <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 16px' }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}

export function Spinner({ size = 20 }) {
  return (
    <div style={{
      width: size, height: size, border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#ffffff', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );
}
