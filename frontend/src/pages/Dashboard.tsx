import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Users, FolderOpen, AlertTriangle,
  ArrowRight, Activity
} from 'lucide-react';
import { api } from '../api/client';
import { AppShell, Topbar } from '../components/layout';
import { KpiCard, StatusBadge, SeverityBadge, SectionCard, PageHeader } from '../components/shared';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

function formatTime(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [tenders, setTenders] = useState<any[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    api.getStats().then(setStats);
    api.getTenders().then(setTenders);
    api.getFindings().then(setFindings);
    api.getAuditLogs().then(setAuditLogs);
  }, []);

  const kpis = stats?.kpis || {
    activeTenders: 1,
    biddersUnderReview: 3,
    documentsProcessed: 10,
    issuesRequiringReview: 3,
  };

  const riskData = stats?.riskDistribution || [
    { name: 'Low Risk', count: 1, color: '#10b981' },
    { name: 'Med Risk', count: 1, color: '#f59e0b' },
    { name: 'High Risk', count: 1, color: '#ef4444' },
  ];

  const openFindings = findings.filter(f => f.status === 'OPEN');

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Overview' }]} />
      <div className="page-container">
        <PageHeader
          title="Procurement Compliance Intelligence Overview"
          subtitle="Real-time KPI analytics & decision-support queue — GeM Procurement Compliance Platform"
          actions={
            <button
              onClick={() => navigate('/tenders/tender-001')}
              className="btn btn-primary"
            >
              Open Active Tender <ArrowRight size={14} />
            </button>
          }
        />

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 }}>
          <KpiCard
            label="Active Tenders"
            value={kpis.activeTenders}
            sub="SIH GeM Procurement Pipeline"
            color="#3b82f6"
            icon={<FileText size={20} />}
          />
          <KpiCard
            label="Bidders Under Review"
            value={kpis.biddersUnderReview}
            sub="Registered Entity Profiles"
            color="#f59e0b"
            icon={<Users size={20} />}
          />
          <KpiCard
            label="Documents Processed"
            value={kpis.documentsProcessed}
            sub="Parsed & Hashed Certificates"
            color="#10b981"
            icon={<FolderOpen size={20} />}
          />
          <KpiCard
            label="Issues Requiring Review"
            value={kpis.issuesRequiringReview}
            sub="AI Compliance Flags"
            color="#ef4444"
            icon={<AlertTriangle size={20} />}
          />
        </div>

        {/* Middle row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 18, marginBottom: 24 }}>
          {/* Risk distribution */}
          <SectionCard title="Bidder Risk Distribution" subtitle="Automated 100-Point Score Mapping">
            <div style={{ padding: '24px 20px' }}>
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={riskData} barSize={38}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: '1px solid var(--border-accent)', borderRadius: 8, color: 'white', fontSize: 12 }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {riskData.map((entry: any, i: number) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 14, marginTop: 12, justifyContent: 'center' }}>
                {riskData.map((r: any) => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.name} ({r.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Active tenders */}
          <SectionCard
            title="Active Procurement Tenders"
            actions={
              <button onClick={() => navigate('/tenders')} className="btn btn-outline btn-sm">View All Tenders →</button>
            }
          >
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    {['Tender ID', 'Title', 'Submission Deadline', 'Bidders', 'Status', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((t: any) => (
                    <tr key={t.id} className="table-row">
                      <td>
                        <span className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-400)', fontWeight: 700 }}>
                          {t.referenceNumber || t.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{t.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.department}</div>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {t.submissionDeadline || t.submissionDate}
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{t.biddersCount || t.bidderCount}</td>
                      <td><StatusBadge status="ACTIVE" /></td>
                      <td>
                        <button
                          onClick={() => navigate(`/tenders/${t.id}`)}
                          className="btn btn-secondary btn-sm"
                        >
                          Inspect <ArrowRight size={12} />
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
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 18 }}>
          {/* Review queue */}
          <SectionCard
            title="Officer Review Queue"
            subtitle={`${openFindings.length} findings requiring Procurement Officer review`}
            actions={
              <button onClick={() => navigate('/findings')} className="btn btn-outline btn-sm">All Findings →</button>
            }
          >
            <div>
              {openFindings.slice(0, 5).map((finding: any) => (
                <div
                  key={finding.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                  onClick={() => navigate(`/findings/${finding.id}`)}
                  className="table-row"
                >
                  <SeverityBadge severity={finding.severity === 'CRITICAL' ? 'CRITICAL' : finding.severity === 'WARNING' ? 'HIGH' : 'MEDIUM'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>
                      {finding.title || finding.category}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>{finding.bidderName}</span> — {finding.requirementTitle || finding.ruleId}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">
                    Review →
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent activity */}
          <SectionCard
            title="Immutable Audit Stream"
            actions={
              <button onClick={() => navigate('/audit')} className="btn btn-outline btn-sm">Full Trail →</button>
            }
          >
            <div style={{ padding: '8px 0' }}>
              {auditLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} style={{ display: 'flex', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Activity size={14} color="var(--primary-400)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{log.detail || log.action}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{log.userName} · {formatTime(log.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

      </div>
    </AppShell>
  );
}
