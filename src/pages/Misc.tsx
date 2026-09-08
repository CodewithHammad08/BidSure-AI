import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AUDIT_LOGS, VERIFICATION_PROVIDERS, BIDDERS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { PageHeader, SectionCard } from '../components/shared';
import { CheckCircle, AlertTriangle, Clock, Filter } from 'lucide-react';

// ============================================================
// AUDIT TRAIL
// ============================================================
export function AuditTrailPage() {
  const [userFilter, setUserFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const users = ['ALL', ...Array.from(new Set(AUDIT_LOGS.map(l => l.userName)))];
  const actions = ['ALL', ...Array.from(new Set(AUDIT_LOGS.map(l => l.action)))];

  const filtered = AUDIT_LOGS.filter(log =>
    (userFilter === 'ALL' || log.userName === userFilter) &&
    (actionFilter === 'ALL' || log.action === actionFilter)
  );

  function ActionIcon({ action }: { action: string }) {
    if (action.includes('Generated')) return <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertTriangle size={13} color="#dc2626" /></div>;
    if (action.includes('Dismissed')) return <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle size={13} color="#16a34a" /></div>;
    if (action.includes('Completed')) return <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CheckCircle size={13} color="#2563eb" /></div>;
    return <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Clock size={13} color="#94a3b8" /></div>;
  }

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Audit Trail' }]} />
      <div className="page-container">
        <PageHeader
          title="Audit Trail"
          subtitle={`${AUDIT_LOGS.length} events recorded — complete decision log for this tender`}
        />

        {/* Notice */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <CheckCircle size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: '#15803d', lineHeight: 1.6 }}>
            <strong>Audit Integrity:</strong> All system actions, AI-generated findings, and Procurement Officer decisions are immutably recorded. This log supports full accountability and regulatory compliance review.
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Filter size={14} color="#64748b" />
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, outline: 'none', background: 'white', color: '#334155' }}
          >
            {users.map(u => <option key={u} value={u}>{u === 'ALL' ? 'All Users' : u}</option>)}
          </select>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            style={{ padding: '7px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, outline: 'none', background: 'white', color: '#334155' }}
          >
            {actions.map(a => <option key={a} value={a}>{a === 'ALL' ? 'All Actions' : a}</option>)}
          </select>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{filtered.length} records</span>
        </div>

        <SectionCard
          title="Event Log"
          subtitle="Chronological audit of all system and officer actions"
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Timestamp', 'User', 'Action', 'Entity', 'Finding', 'Decision', 'Details'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc' }} className="table-row">
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, color: '#334155', fontFamily: 'monospace' }}>
                        {new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: log.userId === 'system' ? '#7c3aed' : '#0f172a' }}>{log.userName}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ActionIcon action={log.action} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#334155' }}>{log.action}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{log.entityType}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{log.entityName}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {log.findingCode && (
                        <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 3, padding: '2px 6px' }}>{log.findingCode}</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {log.decision && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: log.decision === 'DISMISS' ? '#16a34a' : '#d97706', background: log.decision === 'DISMISS' ? '#f0fdf4' : '#fffbeb', border: `1px solid ${log.decision === 'DISMISS' ? '#bbf7d0' : '#fde68a'}`, borderRadius: 4, padding: '2px 8px' }}>
                          {log.decision}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: 300 }}>
                      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{log.details}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

// ============================================================
// VERIFICATION GATEWAY
// ============================================================
export function VerificationGatewayPage() {
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});

  const handleTest = async (providerId: string) => {
    setTesting(providerId);
    await new Promise(r => setTimeout(r, 1500));
    setTesting(null);
    setTestResults(prev => ({
      ...prev,
      [providerId]: 'Mock adapter responded in 143ms — Prototype mode',
    }));
  };

  const statusColors: Record<string, { bg: string; color: string; border: string }> = {
    AVAILABLE:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    UNAVAILABLE: { bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },
    DEGRADED:    { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    MOCK:        { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Verification' }]} />
      <div className="page-container">
        <PageHeader
          title="Verification Gateway"
          subtitle="External verification provider adapters — architecture and status"
        />

        {/* Important notice */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>Prototype Mode — No Live Government APIs</div>
            <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
              This verification gateway uses demonstration adapters only. No real government databases (GSTN, Udyam, MCA21, ITD) are connected. All verification results shown are simulated. Production integration requires authorized API access from respective government authorities. The adapter architecture is designed for plug-and-play replacement with production APIs.
            </div>
          </div>
        </div>

        {/* Architecture diagram */}
        <SectionCard title="Verification Architecture" subtitle="How production integrations will connect">
          <div style={{ padding: '24px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
              {[
                { label: 'Compliance Engine', color: '#2563eb', bg: '#eff6ff' },
                { label: '→' },
                { label: 'Verification Gateway', color: '#7c3aed', bg: '#f5f3ff' },
                { label: '→' },
                { label: 'Provider Adapter', color: '#0f172a', bg: '#f1f5f9' },
                { label: '→' },
                { label: 'API / Sandbox / Mock', color: '#64748b', bg: '#f8fafc' },
              ].map((item, idx) => (
                item.label === '→'
                  ? <div key={idx} style={{ fontSize: 20, color: '#94a3b8', padding: '0 8px', flexShrink: 0 }}>→</div>
                  : <div key={idx} style={{ background: item.bg, border: `1px solid ${item.color}30`, borderRadius: 8, padding: '10px 16px', flexShrink: 0, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.label}</div>
                  </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Provider cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 16 }}>
          {VERIFICATION_PROVIDERS.map(provider => {
            const sc = statusColors[provider.status];
            return (
              <div key={provider.id} className="card" style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{provider.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{provider.description}</div>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, borderRadius: 6, padding: '4px 10px' }}>
                    {provider.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Provider</div>
                    <div style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{provider.providerName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Last Checked</div>
                    <div style={{ fontSize: 12, color: '#334155' }}>
                      {new Date(provider.lastChecked).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 10px', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>{provider.note}</div>
                </div>

                {testResults[provider.id] && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '8px 10px', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>✓ {testResults[provider.id]}</div>
                  </div>
                )}

                {provider.status === 'AVAILABLE' && (
                  <button
                    onClick={() => handleTest(provider.id)}
                    disabled={testing === provider.id}
                    style={{
                      width: '100%', padding: '9px', fontSize: 12, fontWeight: 600,
                      background: testing === provider.id ? '#e2e8f0' : '#0f172a',
                      color: testing === provider.id ? '#94a3b8' : 'white',
                      border: 'none', borderRadius: 6, cursor: testing === provider.id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {testing === provider.id ? 'Testing adapter…' : 'Test Connection (Mock)'}
                  </button>
                )}

                {provider.status === 'UNAVAILABLE' && (
                  <div style={{ padding: '9px', fontSize: 12, color: '#94a3b8', textAlign: 'center', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    Requires authorized API access for production
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// SETTINGS
// ============================================================
export function SettingsPage() {
  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Settings' }]} />
      <div className="page-container">
        <PageHeader
          title="System Settings"
          subtitle="BidSure AI Platform Configuration"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SectionCard title="System Information">
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Application', value: 'BidSure AI v1.0.0-prototype' },
                { label: 'Problem Statement', value: 'SIH26100' },
                { label: 'Platform', value: 'GeM Procurement Compliance' },
                { label: 'Environment', value: 'SIH Prototype — Not for Production Use' },
                { label: 'Build Date', value: '09 Sep 2026' },
                { label: 'Stack', value: 'React + TypeScript + FastAPI' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="AI / ML Components">
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Document Classifier', type: 'AI (Mock)', status: 'Active' },
                { name: 'Field Extractor', type: 'AI (Mock)', status: 'Active' },
                { name: 'Entity Similarity (RapidFuzz)', type: 'Deterministic', status: 'Active' },
                { name: 'Expiry Checker', type: 'Deterministic', status: 'Active' },
                { name: 'Presence Checker', type: 'Deterministic', status: 'Active' },
                { name: 'Scoring Engine', type: 'Rules-based', status: 'Active' },
                { name: 'Audit Logger', type: 'System', status: 'Active' },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#0f172a', flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{c.type}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 3, padding: '1px 6px' }}>{c.status}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// BIDDER COMPARISON
// ============================================================
export function BidderComparisonPage() {
  const { tenderId } = useParams<{ tenderId: string }>();
  const tenderBidders = BIDDERS.filter(b => b.tenderId === (tenderId ?? 'tender-001'));

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders' }, { label: 'TENDER-2026-001' }, { label: 'Compare Bidders' }]} />
      <div className="page-container">
        <PageHeader
          title="Bidder Comparison"
          subtitle="Side-by-side compliance analysis for TENDER-2026-001"
          breadcrumbs={[
            { label: 'Tenders', href: '/tenders' },
            { label: 'TENDER-2026-001', href: `/tenders/${tenderId ?? 'tender-001'}` },
            { label: 'Compare' }
          ]}
        />

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', width: 200 }}>Criteria</th>
                {tenderBidders.map((b: any) => (
                  <th key={b.id} style={{ padding: '12px 16px', textAlign: 'center', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{b.name.split(' ').slice(0, 2).join(' ')}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Compliance Score', render: (b: any) => (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: b.score >= 80 ? '#16a34a' : b.score >= 60 ? '#d97706' : '#dc2626' }}>{b.score}</span>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>/100</span>
                    </div>
                  )
                },
                { label: 'Risk Level', render: (b: any) => <div style={{ textAlign: 'center' }}><RiskChipInline level={b.riskLevel} /></div> },
                { label: 'Total Findings', render: (b: any) => <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: b.findingsCount > 0 ? '#dc2626' : '#16a34a' }}>{b.findingsCount}</div> },
                { label: 'Critical Findings', render: (b: any) => <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: b.criticalFindings > 0 ? '#dc2626' : '#16a34a' }}>{b.criticalFindings}</div> },
                { label: 'Status', render: (b: any) => <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: b.status === 'REVIEW_REQUIRED' ? '#d97706' : '#16a34a' }}>{b.status === 'REVIEW_REQUIRED' ? '⚠ Review Required' : '✓ Analysis Complete'}</div> },
                { label: 'GST Certificate', render: (b: any) => <div style={{ textAlign: 'center' }}>{b.id !== 'bidder-c' ? <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Present</span> : <><span style={{ color: '#dc2626', fontWeight: 700 }}>✕ Expired</span><div style={{ fontSize: 10, color: '#94a3b8' }}>01 Jun 2025</div></>}</div> },
                { label: 'MSME Certificate', render: () => <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>✓ Present</div> },
                { label: 'OEM Authorization', render: (b: any) => <div style={{ textAlign: 'center' }}>{b.id === 'bidder-c' ? <span style={{ color: '#7c3aed', fontWeight: 700 }}>○ Missing</span> : <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Present</span>}</div> },
                { label: 'Entity Consistency', render: (b: any) => <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: b.id === 'bidder-a' ? '#16a34a' : b.id === 'bidder-b' ? '#d97706' : '#dc2626' }}>{b.id === 'bidder-a' ? '100% Match' : b.id === 'bidder-b' ? '71% – Review' : '41% – Mismatch'}</div> },
                { label: 'Certificate Validity', render: (b: any) => <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: b.id === 'bidder-c' ? '#dc2626' : '#16a34a' }}>{b.id === 'bidder-c' ? '✕ Expired' : '✓ Valid'}</div> },
              ].map((row, ridx) => (
                <tr key={row.label} style={{ borderBottom: '1px solid #f1f5f9', background: ridx % 2 === 0 ? 'white' : '#fafbfc' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#64748b' }}>{row.label}</td>
                  {tenderBidders.map((b: any) => (
                    <td key={b.id} style={{ padding: '12px 16px', borderLeft: '1px solid #e2e8f0' }}>
                      {row.render(b)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, fontSize: 11, color: '#94a3b8' }}>
          ⚠ This comparison is for decision-support purposes only. The Procurement Officer makes all final procurement decisions.
        </div>
      </div>
    </AppShell>
  );
}

function RiskChipInline({ level }: { level: string }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    LOW: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
    MEDIUM: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    HIGH: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  };
  const c = colors[level] ?? colors.LOW;
  return (
    <span style={{ fontSize: 12, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 6, padding: '4px 10px' }}>
      {level} Risk
    </span>
  );
}
