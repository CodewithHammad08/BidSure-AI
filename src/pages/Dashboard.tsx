import { useNavigate } from 'react-router-dom';
import {
  FileText, Users, FolderOpen, AlertTriangle,
  TrendingDown, Clock, CheckCircle, ArrowRight,
  Activity
} from 'lucide-react';
import { TENDERS, BIDDERS, FINDINGS, DASHBOARD_STATS, AUDIT_LOGS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { KpiCard, StatusBadge, RiskChip, SeverityBadge, SectionCard, PageHeader } from '../components/shared';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const riskData = [
  { name: 'Low Risk', value: 1, color: '#16a34a' },
  { name: 'Med Risk', value: 1, color: '#d97706' },
  { name: 'High Risk', value: 1, color: '#dc2626' },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const openFindings = FINDINGS.filter(f => f.status === 'OPEN');

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Overview' }]} />
      <div className="page-container">
        <PageHeader
          title="Procurement Compliance Overview"
          subtitle="Tender analysis dashboard — BidSure AI Compliance Intelligence Platform"
          actions={
            <button
              onClick={() => navigate('/tenders/tender-001')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Active Tender <ArrowRight size={14} />
            </button>
          }
        />

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <KpiCard
            label="Active Tenders"
            value={DASHBOARD_STATS.activeTenders}
            sub="1 tender in analysis"
            color="#2563eb"
            icon={<FileText size={18} />}
          />
          <KpiCard
            label="Bidders Under Review"
            value={DASHBOARD_STATS.biddersUnderReview}
            sub="2 require officer attention"
            color="#d97706"
            icon={<Users size={18} />}
          />
          <KpiCard
            label="Documents Processed"
            value={DASHBOARD_STATS.documentsProcessed}
            sub="11 of 12 processed"
            color="#16a34a"
            icon={<FolderOpen size={18} />}
          />
          <KpiCard
            label="Issues Requiring Review"
            value={DASHBOARD_STATS.issuesRequiringReview}
            sub="1 critical, 3 high"
            color="#dc2626"
            icon={<AlertTriangle size={18} />}
          />
        </div>

        {/* Middle row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
          {/* Risk distribution */}
          <SectionCard title="Bidder Risk Distribution" subtitle="Current tender analysis">
            <div style={{ padding: '20px 16px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={riskData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: 'white', fontSize: 12 }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {riskData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
                {riskData.map(r => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                    <span style={{ fontSize: 11, color: '#64748b' }}>{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Active tenders */}
          <SectionCard
            title="Active Tenders"
            actions={
              <button onClick={() => navigate('/tenders')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all →</button>
            }
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Tender ID', 'Name', 'Submission', 'Bidders', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TENDERS.map(t => (
                    <tr key={t.id} className="table-row" style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <span className="font-mono" style={{ fontSize: 12, color: '#2563eb', fontWeight: 600 }}>{t.referenceNumber}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.organization}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                        {new Date(t.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#334155' }}>{t.bidderCount}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={t.complianceStatus === 'REVIEW_REQUIRED' ? 'REVIEW_REQUIRED' : 'PASS'} /></td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => navigate(`/tenders/${t.id}`)}
                          style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          Open <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Review Queue + Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
          {/* Review queue */}
          <SectionCard
            title="Review Queue"
            subtitle={`${openFindings.length} findings requiring officer attention`}
            actions={
              <button onClick={() => navigate('/findings')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">All findings →</button>
            }
          >
            <div style={{ divide: 'y' }}>
              {openFindings.slice(0, 5).map((finding) => (
                <div
                  key={finding.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer' }}
                  onClick={() => navigate(`/findings/${finding.id}`)}
                  className="table-row"
                >
                  <div style={{ flexShrink: 0, marginTop: 1 }}>
                    <SeverityBadge severity={finding.severity} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace' }}>{finding.code}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                        {finding.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, color: '#334155' }}>{finding.bidderName}</span> — {finding.requirementName}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{finding.description.slice(0, 100)}…</div>
                  </div>
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    {finding.evidence.length > 0 && (
                      <span style={{ fontSize: 10, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>
                        {finding.evidence.length} evidence
                      </span>
                    )}
                    <button
                      style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}
                    >
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent activity */}
          <SectionCard
            title="Recent Activity"
            actions={
              <button onClick={() => navigate('/audit')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Audit trail →</button>
            }
          >
            <div style={{ padding: '8px 0' }}>
              {AUDIT_LOGS.slice(0, 6).map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: 10, padding: '10px 16px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={12} color="#64748b" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#1e293b', marginBottom: 1 }}>{log.action}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{log.userName}</div>
                    <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 2 }}>{formatTime(log.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Bidder summary row */}
        <div style={{ marginTop: 16 }}>
          <SectionCard
            title="Bidder Compliance Summary"
            subtitle="TENDER-2026-001 — Supply of Industrial Equipment"
            actions={
              <button onClick={() => navigate('/tenders/tender-001/bidders')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">View all bidders →</button>
            }
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {['Bidder', 'Score', 'Risk', 'Documents', 'Findings', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BIDDERS.map(b => (
                    <tr key={b.id} className="table-row" style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{b.name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.registrationNumber}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{
                            fontSize: 20, fontWeight: 800,
                            color: b.score >= 80 ? '#16a34a' : b.score >= 60 ? '#d97706' : '#dc2626'
                          }}>{b.score}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>/100</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}><RiskChip level={b.riskLevel} /></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#334155', fontWeight: 500 }}>
                        {FINDINGS.filter(f => f.bidderId === b.id).length > 0 ? '✓' : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: b.findingsCount > 0 ? '#dc2626' : '#16a34a' }}>{b.findingsCount}</span>
                          {b.criticalFindings > 0 && (
                            <span style={{ fontSize: 10, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
                              {b.criticalFindings} critical
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {b.status === 'REVIEW_REQUIRED'
                          ? <StatusBadge status="REVIEW_REQUIRED" />
                          : <StatusBadge status="PASS" />}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => navigate(`/bidders/${b.id}`)}
                          style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          View <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
