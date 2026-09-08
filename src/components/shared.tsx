import React from 'react';
import type { ComplianceStatus, RiskLevel, FindingSeverity, DocumentStatus } from '../types';

// ============================================================
// STATUS BADGE
// ============================================================
interface BadgeProps {
  status: ComplianceStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
  PASS:                 { label: 'Pass',                 className: 'badge-pass',    icon: '✓' },
  REVIEW_REQUIRED:      { label: 'Review Required',      className: 'badge-warn',    icon: '⚠' },
  MISSING:              { label: 'Missing',              className: 'badge-missing', icon: '○' },
  EXPIRED:              { label: 'Expired',              className: 'badge-danger',  icon: '✕' },
  MISMATCH:             { label: 'Mismatch',             className: 'badge-danger',  icon: '≠' },
  PENDING:              { label: 'Pending',              className: 'badge-neutral', icon: '…' },
  SIGNIFICANT_MISMATCH: { label: 'Significant Mismatch', className: 'badge-danger',  icon: '≠' },
  LIKELY_MATCH:         { label: 'Likely Match',         className: 'badge-warn',    icon: '≈' },
  MATCH:                { label: 'Match',                className: 'badge-pass',    icon: '✓' },
};

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, className: 'badge-neutral', icon: '·' };
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 8px' : '4px 10px';

  return (
    <span className={`badge ${cfg.className}`} style={{ fontSize, padding }}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  );
}

// ============================================================
// RISK CHIP
// ============================================================
interface RiskChipProps { level: RiskLevel; size?: 'sm' | 'md'; }

const riskConfig: Record<RiskLevel, { label: string; className: string }> = {
  LOW:    { label: 'Low Risk',    className: 'badge-pass' },
  MEDIUM: { label: 'Medium Risk', className: 'badge-warn' },
  HIGH:   { label: 'High Risk',   className: 'badge-danger' },
};

export function RiskChip({ level, size = 'md' }: RiskChipProps) {
  const cfg = riskConfig[level];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 8px' : '4px 10px';

  return (
    <span className={`badge ${cfg.className}`} style={{ fontSize, padding }}>
      {cfg.label}
    </span>
  );
}

// ============================================================
// SEVERITY BADGE
// ============================================================
const severityConfig: Record<FindingSeverity, { label: string; className: string }> = {
  CRITICAL: { label: 'Critical', className: 'badge-danger' },
  HIGH:     { label: 'High',     className: 'badge-danger' },
  MEDIUM:   { label: 'Medium',   className: 'badge-warn' },
  LOW:      { label: 'Low',      className: 'badge-neutral' },
};

export function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const cfg = severityConfig[severity];
  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ============================================================
// DOC STATUS BADGE
// ============================================================
const docStatusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  UPLOADING:    { label: 'Uploading',     className: 'badge-info' },
  QUEUED:       { label: 'Queued',        className: 'badge-neutral' },
  PROCESSING:   { label: 'Processing',    className: 'badge-info' },
  PROCESSED:    { label: 'Processed',     className: 'badge-pass' },
  NEEDS_REVIEW: { label: 'Needs Review',  className: 'badge-warn' },
  FAILED:       { label: 'Failed',        className: 'badge-danger' },
  MISSING:      { label: 'Missing',       className: 'badge-missing' },
};

export function DocStatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = docStatusConfig[status];
  return (
    <span className={`badge ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ============================================================
// CONFIDENCE BAR
// ============================================================
export function ConfidenceBar({ value, showLabel = true }: { value: number; showLabel?: boolean }) {
  const color = value >= 90 ? '#16a34a' : value >= 75 ? '#d97706' : '#dc2626';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden', minWidth: 60 }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      {showLabel && (
        <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
      )}
    </div>
  );
}

// ============================================================
// SCORE RING
// ============================================================
export function ScoreRing({ score, max = 100, size = 96 }: { score: number; max?: number; size?: number }) {
  const pct = score / max;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626';

  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.12, color: '#94a3b8', marginTop: 2 }}>/ {max}</span>
      </div>
    </div>
  );
}

// ============================================================
// SPINNER
// ============================================================
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// SIMILARITY METER
// ============================================================
export function SimilarityMeter({ value }: { value: number }) {
  const color = value >= 90 ? '#16a34a' : value >= 75 ? '#d97706' : '#dc2626';
  const label = value >= 90 ? 'Match' : value >= 75 ? 'Likely Match' : value >= 60 ? 'Review Required' : 'Significant Mismatch';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Similarity</span>
        <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ marginTop: 4, textAlign: 'right' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{label}</span>
      </div>
    </div>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="page-header-container">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: '#94a3b8', fontSize: 11 }}>/</span>}
              <span style={{ fontSize: 12, color: b.href ? '#2563eb' : '#64748b', fontWeight: b.href ? 600 : 500, cursor: b.href ? 'pointer' : 'default' }}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="page-header-main">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  );
}

// ============================================================
// KPI CARD
// ============================================================
interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function KpiCard({ label, value, sub, color = '#3b82f6', icon }: KpiCardProps) {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>{sub}</p>}
        </div>
        {icon && (
          <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '15', color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SECTION CARD
// ============================================================
export function SectionCard({ title, subtitle, children, actions }: {
  title?: string; subtitle?: string; children: React.ReactNode; actions?: React.ReactNode;
}) {
  return (
    <div className="card">
      {(title || actions) && (
        <div className="section-card-header">
          <div>
            {title && <h2 className="section-card-title">{title}</h2>}
            {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
      {icon && <div style={{ marginBottom: 12, color: '#cbd5e1' }}>{icon}</div>}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 4 }}>{title}</h3>
      {description && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, maxWidth: 360 }}>{description}</p>}
      {action}
    </div>
  );
}
