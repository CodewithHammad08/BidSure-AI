import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, SeverityBadge, EmptyState } from '../components/shared.jsx';
import { FileText, CheckCircle, MessageSquare, X, ArrowRight, ShieldAlert, FileCheck, Layers } from 'lucide-react';

export function FindingsPage() {
  const navigate = useNavigate();
  const [findings, setFindings] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    api.getFindings().then(setFindings);
  }, []);

  const filtered = findings.filter(f =>
    severityFilter === 'ALL' || f.severity === severityFilter
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Findings' }]} />
      <div className="page-container">
        <PageHeader
          title="Compliance Findings & Review Queue"
          subtitle={`${findings.filter(f => f.status === 'OPEN').length} active findings flagged by AI analytical pipeline requiring Procurement Officer action`}
        />

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(s => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className="btn btn-sm"
              style={{
                background: severityFilter === s ? 'var(--primary-600)' : 'rgba(255,255,255,0.05)',
                color: severityFilter === s ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${severityFilter === s ? 'var(--primary-400)' : 'var(--border-subtle)'}`
              }}
            >
              {s === 'ALL' ? 'All Severities' : s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(finding => (
            <div
              key={finding.id}
              className="card"
              style={{
                padding: '20px 24px', cursor: 'pointer',
                borderLeft: `4px solid ${finding.severity === 'CRITICAL' ? '#ef4444' : finding.severity === 'WARNING' ? '#f59e0b' : '#3b82f6'}`,
              }}
              onClick={() => navigate(`/findings/${finding.id}`)}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan-400)' }}>{finding.ruleId || finding.id}</span>
                    <SeverityBadge severity={finding.severity === 'CRITICAL' ? 'CRITICAL' : finding.severity === 'WARNING' ? 'HIGH' : 'MEDIUM'} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{finding.category}</span>
                    {finding.status !== 'OPEN' && (
                      <span className="badge badge-pass">
                        <CheckCircle size={12} /> {finding.status}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                    {finding.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <strong>{finding.bidderName}</strong> — {finding.requirementTitle || finding.ruleId}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
                    {finding.description}
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/findings/${finding.id}`); }}
                    className="btn btn-primary btn-sm"
                  >
                    View Evidence <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <EmptyState title="No findings match filter" description="Try selecting a different severity category." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

export function EvidenceViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [finding, setFinding] = useState(null);
  const [decision, setDecision] = useState(null);
  const [officerNote, setOfficerNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      api.getFindingById(id).then(res => {
        if (res) {
          setFinding(res);
          if (res.status && res.status !== 'OPEN') {
            setDecision(res.status);
            setOfficerNote(res.officerNote || '');
          }
        }
      });
    }
  }, [id]);

  if (!finding) return (
    <AppShell><Topbar />
      <div className="page-container"><EmptyState title="Finding loading or not found" /></div>
    </AppShell>
  );

  const handleRecordDecision = async (selectedDecision) => {
    setDecision(selectedDecision);
    setIsSaving(true);
    try {
      await api.updateFindingDecision(finding.id, selectedDecision, officerNote, 'Priya Nair (PO-001)');
      setSavedSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[
        { label: 'Findings' },
        { label: finding.id },
        { label: '3-Panel Evidence Viewer' }
      ]} />
      <div className="page-container" style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title={`3-Panel Evidence Viewer — ${finding.ruleId || finding.id}`}
          subtitle={`${finding.bidderName} · ${finding.requirementTitle}`}
        />

        {/* 3-PANEL INTERFACE */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 360px', gap: 18, flex: 1, marginTop: 10 }}>

          {/* LEFT PANEL: Traceability & Multi-Doc Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={14} /> Evidence Document
              </div>
              <div style={{
                padding: '12px 14px', borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(56,189,248,0.1) 100%)',
                border: '1px solid var(--border-accent)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <FileText size={16} color="var(--cyan-400)" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{finding.documentName}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Page {finding.pageNumber} · Extracted Highlight</div>
              </div>
            </div>

            {/* Traceability Tree */}
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Traceability Chain
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Rule ID', value: finding.ruleId },
                  { label: 'Requirement', value: finding.requirementTitle },
                  { label: 'Bidder Entity', value: finding.bidderName },
                  { label: 'Tender Ref', value: 'GEM/2026/B/7482910' },
                  { label: 'Category', value: finding.category }
                ].map((item, idx) => (
                  <div key={idx} style={{ paddingBottom: 8, borderBottom: idx < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: '#ffffff', fontWeight: 600, marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Simulated High-Res Document Canvas */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="section-card-header">
              <div>
                <div className="section-card-title">{finding.documentName}</div>
                <div className="section-card-subtitle">Source Document Page {finding.pageNumber} — High-Precision Bounding Box OCR Extraction</div>
              </div>
              <span className="badge badge-warn">Bounding Box Highlighted</span>
            </div>

            <div style={{ flex: 1, padding: 24, background: '#05070e', overflowY: 'auto' }}>
              {/* Simulated Paper Canvas */}
              <div style={{
                background: '#ffffff', color: '#0f172a', borderRadius: 8, padding: 36, minHeight: 460,
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)', position: 'relative'
              }}>
                <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      GOVERNMENT OF INDIA — PROCUREMENT COMPLIANCE DOCUMENT
                    </h3>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Official Verification Artifact · Page {finding.pageNumber}</div>
                  </div>
                  <FileCheck size={28} color="#2563eb" />
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.8, color: '#334155', marginBottom: 24 }}>
                  <p><strong>Entity Designation:</strong> {finding.bidderName}</p>
                  <p><strong>Clause Reference:</strong> {finding.requirementTitle}</p>
                  <p><strong>Section Audit Note:</strong> Verification of statutory provisions and signatory authorization.</p>
                </div>

                {/* Yellow Highlighted Bounding Box */}
                <div style={{
                  background: '#fef08a', border: '2px dashed #ca8a04', padding: '14px 18px', borderRadius: 6,
                  boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)', position: 'relative', marginTop: 20
                }}>
                  <div style={{ position: 'absolute', top: -11, right: 12, background: '#ca8a04', color: '#ffffff', fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>
                    AI EXTRACTED BOUNDING BOX
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#854d0e', marginBottom: 4 }}>
                    EXTRACTED CLAUSE / EVIDENCE TEXT:
                  </div>
                  <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#451a03' }}>
                    "{finding.evidenceQuote}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Human-in-the-Loop Officer Action Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={18} color="var(--cyan-400)" /> AI Recommendation
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16, background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                {finding.aiRecommendation}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Procurement Officer Decision
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { key: 'ACCEPTED', label: 'Accept Finding', icon: CheckCircle, color: 'var(--emerald-400)', bg: 'rgba(16,185,129,0.15)' },
                  { key: 'DISMISSED', label: 'Dismiss Finding', icon: X, color: 'var(--rose-400)', bg: 'rgba(239,68,68,0.15)' },
                  { key: 'CLARIFICATION_REQUESTED', label: 'Request Clarification', icon: MessageSquare, color: 'var(--amber-400)', bg: 'rgba(245,158,11,0.15)' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => handleRecordDecision(item.key)}
                    disabled={isSaving}
                    className="btn"
                    style={{
                      justifyContent: 'flex-start',
                      background: decision === item.key ? item.bg : 'rgba(255,255,255,0.03)',
                      color: decision === item.key ? item.color : 'var(--text-muted)',
                      border: `1px solid ${decision === item.key ? item.color : 'var(--border-subtle)'}`
                    }}
                  >
                    <item.icon size={15} color={item.color} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Officer Review Note & Rationale
                </label>
                <textarea
                  value={officerNote}
                  onChange={e => setOfficerNote(e.target.value)}
                  placeholder="Record administrative justification..."
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, color: '#ffffff', fontSize: 12, outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              {savedSuccess && (
                <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--emerald-400)', fontWeight: 600, marginBottom: 10 }}>
                  ✓ Decision and rationale recorded in MongoDB immutable audit trail.
                </div>
              )}

              <button
                onClick={() => navigate('/audit')}
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
              >
                View in Audit Trail →
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
