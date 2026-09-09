import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TENDERS, REQUIREMENTS, BIDDERS } from '../data/mockData.js';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, StatusBadge, SectionCard, EmptyState } from '../components/shared.jsx';
import { FileText, ArrowRight, CheckCircle2, AlertTriangle, Plus, Search, Calendar } from 'lucide-react';

export function TendersPage() {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getTenders().then(setTenders);
  }, []);

  const filtered = tenders.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    t.referenceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders' }]} />
      <div className="page-container">
        <PageHeader
          title="Procurement Tenders"
          subtitle="Manage active tenders, mandatory compliance rules, and registered bidder packages"
        />

        <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search tender reference or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 40px', background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)', borderRadius: 10, color: 'white', fontSize: 13, outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat( auto-fit, minmax(340px, 1fr) )', gap: 20 }}>
          {filtered.map(t => (
            <div key={t.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan-400)' }}>
                    {t.referenceNumber || t.id}
                  </span>
                  <StatusBadge status={t.status || 'ACTIVE'} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8, lineHeight: 1.4 }}>
                  {t.title || t.name}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
                  {t.department || t.organization}
                </p>
                <div style={{ display: 'flex', gap: 16, padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600 }}>Estimated Value</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{t.estimatedValue || '₹ 14.5 Cr'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600 }}>Registered Bidders</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan-400)' }}>{t.biddersCount || t.bidderCount} Bidders</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => navigate(`/tenders/${t.id}`)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  View Details <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function TenderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);

  useEffect(() => {
    if (id) {
      api.getTenderById(id).then(setTender);
    }
  }, [id]);

  if (!tender) return (
    <AppShell><Topbar /><div className="page-container"><EmptyState title="Tender loading or not found" /></div></AppShell>
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: tender.referenceNumber || tender.id }]} />
      <div className="page-container">
        <PageHeader
          title={tender.title || tender.name}
          subtitle={`Reference Number: ${tender.referenceNumber || tender.id} · ${tender.department || tender.organization}`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <SectionCard title="Tender Requirements Specification">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Rule Code</th>
                    <th>Requirement Title</th>
                    <th>Category</th>
                    <th>Page Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {(tender.requirements || REQUIREMENTS).map(r => (
                    <tr key={r.id} className="table-row">
                      <td className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-400)', fontWeight: 700 }}>{r.code}</td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{r.title || r.name}</td>
                      <td><span className="badge badge-info">{r.category || r.type}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>Page {r.pageRef || r.sourcePage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 14 }}>Actions</h3>
            <button
              onClick={() => navigate(`/tenders/${tender.id}/bidders`)}
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 12 }}
            >
              View Registered Bidders →
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function RequirementsPage() {
  return <TenderDetailPage />;
}
