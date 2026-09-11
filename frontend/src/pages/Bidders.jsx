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
  const [evaluating, setEvaluating] = useState(false);
  const [evalMsg, setEvalMsg] = useState('');

  const loadBidder = () => {
    if (id) api.getBidderById(id).then(setBidder);
  };

  useEffect(() => {
    loadBidder();
  }, [id]);

  const handleAIReEvaluate = async () => {
    if (!bidder) return;
    setEvaluating(true);
    setEvalMsg('');
    try {
      const res = await fetch(`http://localhost:5000/api/bidders/${bidder.id}/ai-evaluate`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setBidder(data.bidder);
        setEvalMsg('✓ Gemini AI re-evaluation completed successfully.');
      } else {
        setEvalMsg(`⚠ Evaluation failed: ${data.error}`);
      }
    } catch (err) {
      setEvalMsg('⚠ Could not connect to backend for AI evaluation.');
    } finally {
      setEvaluating(false);
    }
  };

  if (!bidder) return (
    <AppShell><Topbar /><div className="page-container"><EmptyState title="Bidder loading or not found" /></div></AppShell>
  );

  const scoreColor = bidder.score >= 90 ? 'var(--emerald-400)' : bidder.score >= 70 ? 'var(--amber-400)' : 'var(--rose-400)';
  const catScores = bidder.categoryScores || {};
  const catItems = [
    { label: 'Mandatory Docs', val: catScores.mandatoryDocs ?? 25, max: 25 },
    { label: 'Validity', val: catScores.validity ?? 20, max: 20 },
    { label: 'Entity Consistency', val: catScores.entityConsistency ?? 25, max: 25 },
    { label: 'Technical Requirements', val: catScores.technicalRequirements ?? 20, max: 20 },
    { label: 'Verification Checks', val: catScores.verificationChecks ?? 10, max: 10 },
  ];

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Bidders', href: '/bidders' }, { label: bidder.companyName || bidder.name }]} />
      <div className="page-container">
        <PageHeader
          title={bidder.companyName || bidder.name}
          subtitle={`GSTIN: ${bidder.gstin || bidder.id} · CIN: ${bidder.cin || '—'} · Udyam: ${bidder.udyamNo || '—'}`}
          actions={
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={handleAIReEvaluate}
                disabled={evaluating}
                style={{
                  background: evaluating ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg,#6366f1,#3b82f6)',
                  border: 'none', color: 'white', borderRadius: 10,
                  padding: '10px 18px', cursor: evaluating ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                }}
              >
                {evaluating ? (
                  <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Evaluating...</>
                ) : (
                  <>✦ Re-Evaluate with Gemini AI</>
                )}
              </button>
              <button
                onClick={() => navigate(`/bidders/${bidder.id}/compliance`)}
                className="btn btn-primary"
              >
                View Compliance Matrix →
              </button>
            </div>
          }
        />

        {evalMsg && (
          <div style={{
            background: evalMsg.startsWith('✓') ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${evalMsg.startsWith('✓') ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
            borderRadius: 10, padding: '10px 16px', marginBottom: 20,
            color: evalMsg.startsWith('✓') ? '#34d399' : '#f87171', fontSize: 13, fontWeight: 600,
          }}>
            {evalMsg}
          </div>
        )}

        {/* Anomaly Alert Banner */}
        {bidder.anomalyDetected && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 12, padding: '12px 18px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>⚠</span>
            <div>
              <div style={{ color: '#f87171', fontWeight: 700, fontSize: 14 }}>Anomaly Detected by Gemini AI</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 }}>
                This bidder submission triggered anomaly flags during AI evaluation. Please review findings carefully before award.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 20 }}>
          {/* LEFT: Score + AI Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score Card */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>AI Compliance Score</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{bidder.score}</div>
                <div style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 4 }}>/100</div>
              </div>
              <div style={{ height: 6, borderRadius: 6, background: 'rgba(255,255,255,0.07)', marginBottom: 12 }}>
                <div style={{ height: '100%', borderRadius: 6, width: `${bidder.score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`, transition: 'width 0.6s' }} />
              </div>
              <RiskChip level={bidder.riskLevel || 'LOW'} />
            </div>

            {/* Category Scores */}
            <div className="card" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Category Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {catItems.map(c => (
                  <div key={c.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{c.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{c.val}/{c.max}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.07)' }}>
                      <div style={{ height: '100%', borderRadius: 4, width: `${(c.val / c.max) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#38bdf8)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: AI Summary + Findings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* AI Executive Summary */}
            {bidder.aiSummary && (
              <div className="card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
                  }}>✦</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>Gemini AI Executive Summary</h3>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: '12px 14px' }}>
                  {bidder.aiSummary}
                </p>
              </div>
            )}

            {/* AI Findings List */}
            {bidder.findingsList && bidder.findingsList.length > 0 && (
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>AI Audit Findings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {bidder.findingsList.map((f, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 10, padding: '10px 12px',
                      background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <span style={{ color: '#34d399', marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cross-Doc Verification Table */}
            {bidder.crossDocVerification && bidder.crossDocVerification.length > 0 && (
              <SectionCard title="Cross-Document Verification (AI)">
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Document A</th>
                        <th>Document B</th>
                        <th>Similarity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bidder.crossDocVerification.map((cv, i) => (
                        <tr key={i} className="table-row">
                          <td style={{ fontWeight: 700, color: 'var(--cyan-400)', fontSize: 12 }}>{cv.field}</td>
                          <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{cv.doc1}</td>
                          <td style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{cv.doc2}</td>
                          <td style={{ fontWeight: 700, color: cv.similarityPercentage >= 90 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>
                            {cv.similarityPercentage}%
                          </td>
                          <td>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                              background: cv.flagged ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                              color: cv.flagged ? '#f87171' : '#34d399',
                              border: `1px solid ${cv.flagged ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                            }}>
                              {cv.flagged ? '⚠ FLAGGED' : '✓ MATCH'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}
          </div>
        </div>

        {/* Documents Table */}
        <SectionCard title="Submitted Document Repository">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Pages</th>
                  <th>Confidence</th>
                  <th>OCR Status</th>
                  <th>SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody>
                {(bidder.documents || DOCUMENTS).map(d => (
                  <tr key={d.id} className="table-row">
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{d.name || d.fileName}</td>
                    <td><span className="badge badge-info">{d.type || d.documentType}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.pageCount} Pages</td>
                    <td style={{ fontWeight: 700, color: d.confidenceScore >= 90 ? 'var(--emerald-400)' : 'var(--amber-400)' }}>{d.confidenceScore}%</td>
                    <td>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: d.ocrStatus === 'SUCCESS' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: d.ocrStatus === 'SUCCESS' ? '#34d399' : '#fbbf24',
                      }}>
                        {d.ocrStatus || 'SUCCESS'}
                      </span>
                    </td>
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}

export function DocumentDetailPage() {
  return <BidderDetailPage />;
}

export function AllDocumentsPage() {
  return <BiddersPage />;
}

