import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BIDDERS, DOCUMENTS } from '../data/mockData.js';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, RiskChip, StatusBadge, SectionCard, EmptyState } from '../components/shared.jsx';
import { Users, FileText, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

export function BiddersPage() {
  const navigate = useNavigate();
  const [bidders, setBidders] = useState([]);

  useEffect(() => {
    api.getBidders().then(setBidders);
  }, []);

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Bidders' }]} />
      <div className="page-container">
        <PageHeader
          title="Registered Bidder Profiles"
          subtitle="Cross-document verification, risk scoring, and mandatory evidence tracking"
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {bidders.map(b => (
            <div key={b.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-400)', fontWeight: 700 }}>
                    {b.gstin || b.registrationNumber || b.id}
                  </span>
                  <RiskChip level={b.riskLevel} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                  {b.companyName || b.name}
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Submitted: {b.submittedAt || b.addedAt}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'rgba(0,0,0,0.25)', borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: b.score >= 90 ? 'var(--emerald-400)' : b.score >= 65 ? 'var(--amber-400)' : 'var(--rose-400)' }}>
                    {b.score}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 600 }}>Compliance Score</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>100-Point Explainable Scale</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => navigate(`/bidders/${b.id}`)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  View Profile <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function BidderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidder, setBidder] = useState(null);

  useEffect(() => {
    if (id) {
      api.getBidderById(id).then(setBidder);
    }
  }, [id]);

  if (!bidder) return (
    <AppShell><Topbar /><div className="page-container"><EmptyState title="Bidder loading or not found" /></div></AppShell>
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Bidders', href: '/bidders' }, { label: bidder.companyName || bidder.name }]} />
      <div className="page-container">
        <PageHeader
          title={bidder.companyName || bidder.name}
          subtitle={`GSTIN / Registration: ${bidder.gstin || bidder.registrationNumber || bidder.id}`}
          actions={
            <button
              onClick={() => navigate(`/bidders/${bidder.id}/compliance`)}
              className="btn btn-primary"
            >
              View Compliance Matrix →
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>Profile Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Compliance Score</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: bidder.score >= 80 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                  {bidder.score} / 100
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>Risk Rating</div>
                <RiskChip level={bidder.riskLevel} />
              </div>
            </div>
          </div>

          <SectionCard title="Submitted Document Repository">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th>Type</th>
                    <th>Pages</th>
                    <th>SHA-256 Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {(bidder.documents || DOCUMENTS).map(d => (
                    <tr key={d.id} className="table-row">
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{d.name || d.fileName}</td>
                      <td><span className="badge badge-info">{d.type || d.documentType}</span></td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.pageCount} Pages</td>
                      <td className="font-mono" style={{ fontSize: 11, color: 'var(--cyan-400)' }}>
                        {(d.sha256 || 'e3b0c44...').slice(0, 16)}...
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

export function DocumentDetailPage() {
  return <BidderDetailPage />;
}

export function AllDocumentsPage() {
  return <BiddersPage />;
}
