import React from 'react';
import clsx from 'clsx';
import type { ComplianceStatus, RiskLevel, FindingSeverity, DocumentStatus } from '../types';

// ============================================================
// STATUS BADGE
// ============================================================
interface BadgeProps {
  status: ComplianceStatus | string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
  PASS:              { label: 'Pass',              className: 'badge-pass',    icon: '✓' },
  REVIEW_REQUIRED:   { label: 'Review Required',   className: 'badge-warn',    icon: '⚠' },
  MISSING:           { label: 'Missing',           className: 'badge-missing', icon: '○' },
  EXPIRED:           { label: 'Expired',           className: 'badge-danger',  icon: '✕' },
  MISMATCH:          { label: 'Mismatch',          className: 'badge-danger',  icon: '≠' },
  PENDING:           { label: 'Pending',           className: 'badge-neutral', icon: '…' },
  SIGNIFICANT_MISMATCH: { label: 'Significant Mismatch', className: 'badge-danger', icon: '≠' },
  LIKELY_MATCH:      { label: 'Likely Match',      className: 'badge-warn',    icon: '≈' },
  MATCH:             { label: 'Match',             className: 'badge-pass',    icon: '✓' },
};

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  const cfg = statusConfig[status] ?? { label: status, className: 'badge-neutral', icon: '·' };
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium rounded-full leading-none',
      cfg.className,
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
    )}>
      <span>{cfg.icon}</span>
      {cfg.label}
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
  return (
    <span className={clsx(
      'inline-flex items-center font-semibold rounded-full',
      cfg.className,
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
    )}>
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
    <span className={clsx('inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full', cfg.className)}>
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
    <span className={clsx('inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full', cfg.className)}>
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
    <div className="flex items-center gap-2">
      <div className="conf-bar flex-1" style={{ minWidth: 60 }}>
        <div className="conf-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      {showLabel && (
        <span className="text-xs font-mono font-medium" style={{ color, minWidth: 32 }}>{value}%</span>
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
    <div style={{ width: size, height: size }} className="relative inline-flex items-center justify-center">
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold" style={{ fontSize: size * 0.22, color }}>{score}</span>
        <span className="text-neutral-400" style={{ fontSize: size * 0.12 }}>/ {max}</span>
      </div>
    </div>
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin-slow">
      <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ============================================================
// SKELETON
// ============================================================
export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 w-full" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
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
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && <div className="mb-4 text-neutral-300">{icon}</div>}
      <h3 className="text-base font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-500 mb-6 max-w-sm">{description}</p>}
      {action}
    </div>
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
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-neutral-500">Similarity</span>
        <span className="text-sm font-bold font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="similarity-bar">
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <div className="mt-1 text-right">
        <span className="text-[11px] font-medium" style={{ color }}>{label}</span>
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
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-neutral-400 text-xs">/</span>}
              <span className={clsx('text-xs', b.href ? 'text-blue-600 cursor-pointer hover:underline' : 'text-neutral-500')}>
                {b.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
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
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + '15', color }}>
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            {title && <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>}
            {subtitle && <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
