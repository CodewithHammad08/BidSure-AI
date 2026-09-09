import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, SectionCard, StatusBadge } from '../components/shared.jsx';
import { ClipboardList, CheckSquare, Settings, Activity, RefreshCw } from 'lucide-react';

export function AuditTrailPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
  }, []);

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Audit Trail' }]} />
      <div className="page-container">
        <PageHeader
          title="Immutable Audit Trail"
          subtitle="Complete record of automated findings, API adapter calls, and officer decision notes"
        />

        <SectionCard title="System Event Logs">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Officer / User</th>
                  <th>Action Type</th>
                  <th>Entity ID</th>
                  <th>Details & Rationale</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="table-row">
                    <td className="font-mono" style={{ fontSize: 11, color: 'var(--cyan-400)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{log.userName}</td>
                    <td><span className="badge badge-info">{log.actionType || log.action}</span></td>
                    <td className="font-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.entityId}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{log.detail || log.details}</td>
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

export function VerificationGatewayPage() {
  const [adapters, setAdapters] = useState([]);
  const [testingId, setTestingId] = useState(null);

  useEffect(() => {
    api.getAdapters().then(setAdapters);
  }, []);

  const handleTestPing = async (id) => {
    setTestingId(id);
    await api.testAdapterPing(id);
    const updated = await api.getAdapters();
    setAdapters(updated);
    setTestingId(null);
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Verification Gateway' }]} />
      <div className="page-container">
        <PageHeader
          title="External Verification Gateway Adapters"
          subtitle="Adapter status and live connection checks for government registries (GSTN, Udyam, MCA21, PAN)"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {adapters.map((adapter) => (
            <div key={adapter.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{adapter.name}</h3>
                <StatusBadge status={adapter.status === 'HEALTHY' ? 'PASS' : 'REVIEW_REQUIRED'} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>{adapter.service || adapter.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Latency</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--emerald-400)' }}>{adapter.latencyMs || 120} ms</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Total Checks</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{adapter.checkCount || 980}</div>
                </div>
              </div>

              <button
                onClick={() => handleTestPing(adapter.id)}
                disabled={testingId === adapter.id}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                <RefreshCw size={13} className={testingId === adapter.id ? 'animate-spin' : ''} />
                {testingId === adapter.id ? 'Testing Connection...' : 'Test Connection (Mock)'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function SettingsPage() {
  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Settings' }]} />
      <div className="page-container">
        <PageHeader title="System Settings" subtitle="Platform configuration and security rules" />
        <div className="card" style={{ padding: 24 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>System parameters operating under default SIH26100 configuration.</p>
        </div>
      </div>
    </AppShell>
  );
}

export function BidderComparisonPage() {
  return <VerificationGatewayPage />;
}
