import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DOCUMENTS } from '../data/mockData.js';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, RiskChip, StatusBadge, SectionCard, EmptyState } from '../components/shared.jsx';
import { Users, ArrowRight, Plus, X } from 'lucide-react';

export function BiddersPage() {
  const navigate = useNavigate();
  const [bidders, setBidders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBidder, setNewBidder] = useState({
    companyName: '',
    gstin: '',
    udyamNo: '',
    cin: '',
    score: 85,
    riskLevel: 'LOW',
    tenderId: 'tender-001'
  });

  const loadBidders = () => {
    api.getBidders().then(setBidders);
  };

  useEffect(() => {
    loadBidders();
  }, []);

  const handleRegisterBidder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createBidder({
        ...newBidder,
        documents: [
          { id: `doc-${Date.now()}-1`, name: 'GST_Certificate_New.pdf', type: 'GST Certificate', pageCount: 3, extractedFields: 10, confidenceScore: 98.0, sha256: 'a1b2c3d4e5f67890123456789abcdef0' },
          { id: `doc-${Date.now()}-2`, name: 'MSME_Udyam_New.pdf', type: 'MSME Certificate', pageCount: 2, extractedFields: 8, confidenceScore: 97.5, sha256: 'f0e9d8c7b6a543210987654321fedcba' }
        ]
      });
      setShowModal(false);
      setNewBidder({ companyName: '', gstin: '', udyamNo: '', cin: '', score: 85, riskLevel: 'LOW', tenderId: 'tender-001' });
      loadBidders();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Bidders' }]} />
      <div className="page-container">
        <PageHeader
          title="Registered Bidder Profiles"
          subtitle="Cross-document verification, risk scoring, and mandatory evidence tracking"
          actions={
            <button onClick={() => setShowModal(true)} className="btn btn-primary">
              <Plus size={16} /> Register New Bidder
            </button>
          }
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {bidders.map(b => (
            <div key={b.id} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-400)', fontWeight: 700 }}>
                    {b.gstin || b.registrationNumber || b.id}
                  </span>
                  <RiskChip level={b.riskLevel || 'LOW'} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
                  {b.companyName || b.name}
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                  Submitted: {b.submittedAt || b.addedAt || '2026-09-10'}
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

        {/* REGISTER BIDDER MODAL */}
        {showModal && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
          }}>
            <div className="card" style={{ width: 480, padding: 28, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>Register New Bidder Entity</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRegisterBidder} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Technologies Pvt Ltd"
                    value={newBidder.companyName}
                    onChange={e => setNewBidder({ ...newBidder, companyName: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: '#ffffff', fontSize: 13, outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>GSTIN Number</label>
                    <input
                      type="text"
                      required
                      placeholder="07AAAAA0000A1Z5"
                      value={newBidder.gstin}
                      onChange={e => setNewBidder({ ...newBidder, gstin: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: '#ffffff', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Udyam MSME No.</label>
                    <input
                      type="text"
                      required
                      placeholder="UDYAM-DL-03-0099887"
                      value={newBidder.udyamNo}
                      onChange={e => setNewBidder({ ...newBidder, udyamNo: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: '#ffffff', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Initial Score (0-100)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newBidder.score}
                      onChange={e => setNewBidder({ ...newBidder, score: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: '#ffffff', fontSize: 13, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Risk Level</label>
                    <select
                      value={newBidder.riskLevel}
                      onChange={e => setNewBidder({ ...newBidder, riskLevel: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: '#ffffff', fontSize: 13, outline: 'none' }}
                    >
                      <option value="LOW" style={{ background: '#111827' }}>LOW Risk</option>
                      <option value="MEDIUM" style={{ background: '#111827' }}>MEDIUM Risk</option>
                      <option value="HIGH" style={{ background: '#111827' }}>HIGH Risk</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ marginTop: 10, width: '100%' }}
                >
                  {isSubmitting ? 'Registering in MongoDB Atlas...' : 'Register Bidder to MongoDB Atlas'}
                </button>
              </form>
            </div>
          </div>
        )}
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
                <RiskChip level={bidder.riskLevel || 'LOW'} />
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
