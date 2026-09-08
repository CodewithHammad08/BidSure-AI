import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FINDINGS, AUDIT_LOGS, BIDDERS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { PageHeader, SeverityBadge, SectionCard, EmptyState } from '../components/shared';
import type { FindingSeverity, FindingType, FindingDecision } from '../types';
import { AlertTriangle, FileText, CheckCircle, MessageSquare, X, ArrowRight } from 'lucide-react';

// ============================================================
// FINDINGS LIST
// ============================================================
export function FindingsPage() {
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState<FindingSeverity | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<FindingType | 'ALL'>('ALL');

  const filtered = FINDINGS.filter(f =>
    (severityFilter === 'ALL' || f.severity === severityFilter) &&
    (typeFilter === 'ALL' || f.type === typeFilter)
  );

  const typeLabels: Partial<Record<FindingType | 'ALL', string>> = {
    ALL: 'All Types',
    MISSING_DOCUMENT: 'Missing Document',
    EXPIRED_CERTIFICATE: 'Expired Certificate',
    ENTITY_INCONSISTENCY: 'Entity Inconsistency',
    LOW_CONFIDENCE: 'Low Confidence',
    VERIFICATION_FAILED: 'Verification Failed',
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Findings' }]} />
      <div className="page-container">
        <PageHeader
          title="Findings"
          subtitle={`${FINDINGS.filter(f => f.status === 'OPEN').length} open findings requiring officer review`}
        />

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer',
                  background: severityFilter === s ? '#0f172a' : 'white',
                  color: severityFilter === s ? 'white' : '#64748b',
                  borderColor: severityFilter === s ? '#0f172a' : '#e2e8f0',
                }}
              >
                {s === 'ALL' ? 'All Severity' : s}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {(['ALL', 'MISSING_DOCUMENT', 'EXPIRED_CERTIFICATE', 'ENTITY_INCONSISTENCY', 'LOW_CONFIDENCE'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid', cursor: 'pointer',
                  background: typeFilter === t ? '#1e293b' : 'white',
                  color: typeFilter === t ? 'white' : '#64748b',
                  borderColor: typeFilter === t ? '#1e293b' : '#e2e8f0',
                }}
              >
                {typeLabels[t] ?? t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(finding => (
            <div
              key={finding.id}
              className="card"
              style={{
                padding: '16px 20px', cursor: 'pointer',
                borderLeft: `4px solid ${finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? '#dc2626' : finding.severity === 'MEDIUM' ? '#d97706' : '#94a3b8'}`,
              }}
              onClick={() => navigate(`/findings/${finding.id}`)}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>{finding.code}</span>
                    <SeverityBadge severity={finding.severity} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{finding.type.replace(/_/g, ' ')}</span>
                    {finding.status === 'REVIEWED' && (
                      <span style={{ fontSize: 11, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>Reviewed</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#334155', marginBottom: 4 }}>
                    <strong>{finding.bidderName}</strong> — {finding.requirementName}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 8 }}>
                    {finding.description.slice(0, 160)}…
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {finding.evidence.length > 0 && (
                      <span style={{ fontSize: 11, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}>
                        {finding.evidence.length} evidence doc{finding.evidence.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Detected: {new Date(finding.detectedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    {finding.tenderName && <span style={{ fontSize: 11, color: '#94a3b8' }}>{finding.tenderName}</span>}
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 'auto' }}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/findings/${finding.id}`); }}
                    style={{ fontSize: 12, fontWeight: 700, color: 'white', background: '#2563eb', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                  >
                    View Evidence <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <EmptyState title="No findings match filter" description="Try adjusting the severity or type filter." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// EVIDENCE VIEWER — THE SIGNATURE FEATURE
// ============================================================
export function EvidenceViewerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const finding = FINDINGS.find(f => f.id === id);
  const [activeEvidenceIdx, setActiveEvidenceIdx] = useState(0);
  const [decision, setDecision] = useState<FindingDecision | null>(finding?.decision !== 'PENDING' ? finding?.decision ?? null : null);
  const [reviewNote, setReviewNote] = useState(finding?.reviewNote ?? '');
  const [saved, setSaved] = useState(false);

  if (!finding) return (
    <AppShell><Topbar />
      <div className="page-container"><EmptyState title="Finding not found" /></div>
    </AppShell>
  );

  const bidder = BIDDERS.find(b => b.id === finding.bidderId);
  const activeEvidence = finding.evidence[activeEvidenceIdx];

  const handleDecision = (d: FindingDecision) => {
    setDecision(d);
    setSaved(false);
  };

  const handleSave = () => {
    // In production: POST /api/findings/{id}/decision
    setSaved(true);
    // Append to audit log in real implementation
  };

  const decisionButtons: { key: FindingDecision; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
    { key: 'ACCEPT', label: 'Accept Finding', icon: <CheckCircle size={14} />, color: '#16a34a', bg: '#f0fdf4' },
    { key: 'DISMISS', label: 'Dismiss Finding', icon: <X size={14} />, color: '#64748b', bg: '#f8fafc' },
    { key: 'REQUEST_CLARIFICATION', label: 'Request Clarification', icon: <MessageSquare size={14} />, color: '#d97706', bg: '#fffbeb' },
  ];

  const severityColors: Record<string, string> = {
    CRITICAL: '#dc2626', HIGH: '#dc2626', MEDIUM: '#d97706', LOW: '#94a3b8',
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[
        { label: 'Findings' },
        { label: finding.code },
        { label: 'Evidence' }
      ]} />
      <div className="page-container" style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title={`Evidence Viewer — ${finding.code}`}
          subtitle={`${finding.bidderName} · ${finding.requirementName}`}
          breadcrumbs={[
            { label: 'Findings', href: '/findings' },
            { label: finding.code },
            { label: 'Evidence' }
          ]}
        />

        {/* 3-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 340px', gap: 14, flex: 1 }}>

          {/* LEFT — Document navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Finding Evidence</div>
              {finding.evidence.length > 0 ? (
                finding.evidence.map((ev, idx) => (
                  <button
                    key={ev.id}
                    onClick={() => setActiveEvidenceIdx(idx)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '10px 10px', borderRadius: 6, border: '1px solid', cursor: 'pointer', marginBottom: 6,
                      background: activeEvidenceIdx === idx ? '#eff6ff' : 'white',
                      borderColor: activeEvidenceIdx === idx ? '#bfdbfe' : '#e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 3 }}>
                      <FileText size={12} color={activeEvidenceIdx === idx ? '#2563eb' : '#64748b'} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: activeEvidenceIdx === idx ? '#2563eb' : '#334155' }}>{ev.documentType}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{ev.documentName}</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Page {ev.sourcePage}</div>
                  </button>
                ))
              ) : (
                <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', padding: '8px 0' }}>
                  No evidence documents — this is a missing document finding.
                </div>
              )}
            </div>

            {/* Finding trace */}
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Traceability Chain</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'Finding', value: finding.code },
                  { label: 'Requirement', value: finding.requirementName },
                  { label: 'Bidder', value: finding.bidderName.split(' ').slice(0, 3).join(' ') },
                  { label: 'Tender', value: 'TENDER-2026-001' },
                  { label: 'Type', value: finding.type.replace(/_/g, ' ') },
                ].map((item, idx, arr) => (
                  <div key={item.label} style={{ display: 'flex', flexDirection: 'column', paddingBottom: idx < arr.length - 1 ? 8 : 0, marginBottom: idx < arr.length - 1 ? 8 : 0, borderBottom: idx < arr.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER — Document preview / evidence */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  {activeEvidence ? activeEvidence.documentName : 'No Evidence Document'}
                </div>
                {activeEvidence && (
                  <div style={{ fontSize: 11, color: '#64748b' }}>{activeEvidence.documentType} · Page {activeEvidence.sourcePage}</div>
                )}
              </div>
              {activeEvidence && (
                <span style={{ fontSize: 11, fontWeight: 600, color: activeEvidence.confidence >= 90 ? '#16a34a' : '#d97706', background: activeEvidence.confidence >= 90 ? '#f0fdf4' : '#fffbeb', border: `1px solid ${activeEvidence.confidence >= 90 ? '#bbf7d0' : '#fde68a'}`, borderRadius: 4, padding: '3px 8px' }}>
                  {activeEvidence.confidence}% confidence
                </span>
              )}
            </div>

            {activeEvidence ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Simulated document page */}
                <div style={{
                  background: 'white', border: '1px solid #e2e8f0', borderRadius: 8,
                  padding: '32px', minHeight: 400,
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02)',
                  position: 'relative'
                }}>
                  {/* Page header simulation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #0f172a' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                        {activeEvidence.documentType === 'GST Certificate' ? 'GOODS AND SERVICES TAX — REGISTRATION CERTIFICATE' :
                          activeEvidence.documentType === 'MSME / Udyam Certificate' ? 'UDYAM REGISTRATION CERTIFICATE' :
                          activeEvidence.documentType === 'OEM Authorization Letter' ? 'ORIGINAL EQUIPMENT MANUFACTURER AUTHORIZATION' :
                          activeEvidence.documentType}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>
                        {activeEvidence.documentType === 'GST Certificate' ? 'Government of India — GSTN Authority' :
                          activeEvidence.documentType === 'MSME / Udyam Certificate' ? 'Ministry of MSME — Udyam Registration Portal' :
                          'Government of India'}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>Page {activeEvidence.sourcePage}</div>
                  </div>

                  {/* Document content simulation */}
                  <div style={{ fontSize: 12, color: '#334155', lineHeight: 2, marginBottom: 24 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      {/* Highlighted field */}
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{activeEvidence.fieldName}</div>
                        <div style={{
                          background: '#fef9c3', border: '2px solid #facc15', borderRadius: 4,
                          padding: '8px 12px', fontSize: 14, fontWeight: 700, color: '#0f172a',
                          position: 'relative'
                        }}>
                          {activeEvidence.extractedValue}
                          <div style={{ position: 'absolute', top: -10, right: 8, background: '#2563eb', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3 }}>
                            EXTRACTED
                          </div>
                        </div>
                      </div>

                      {[
                        { label: 'Document Reference', value: `${activeEvidence.documentType === 'GST Certificate' ? 'GST REG-06' : 'UDYAM'}-${Math.random().toString(36).slice(2, 8).toUpperCase()}` },
                        { label: 'Issuing Authority', value: activeEvidence.documentType === 'GST Certificate' ? 'GSTN Authority' : 'Udyam Portal' },
                        { label: 'Date of Issue', value: '12 March 2022' },
                        { label: 'Document Status', value: finding.type === 'EXPIRED_CERTIFICATE' ? '⚠ EXPIRED — 01 Jun 2025' : 'ACTIVE' },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlight note */}
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '10px 12px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 2 }}>🔍 Extracted Value</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#451a03', fontWeight: 700 }}>"{activeEvidence.extractedValue}"</div>
                    <div style={{ fontSize: 10, color: '#92400e', marginTop: 4 }}>Extracted from {activeEvidence.documentName} · Page {activeEvidence.sourcePage} · Confidence: {activeEvidence.confidence}%</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, color: '#94a3b8' }}>
                <AlertTriangle size={48} color="#fde68a" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', marginBottom: 4 }}>Missing Document</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>No document was submitted for this mandatory requirement. The absence of evidence is itself the finding.</div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Finding details + Officer actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Finding details */}
            <div className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <SeverityBadge severity={finding.severity} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{finding.type.replace(/_/g, ' ')}</span>
              </div>

              <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.7, marginBottom: 12 }}>
                {finding.description}
              </div>

              {finding.evidence.length > 1 && (
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Comparison</div>
                  {finding.evidence.map((ev, idx) => (
                    <div key={ev.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 5 }} />
                      <div>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{ev.documentType} · Page {ev.sourcePage}</div>
                        <div className="evidence-quote" style={{ marginTop: 3 }}>"{ev.extractedValue}"</div>
                      </div>
                    </div>
                  ))}

                  {finding.evidence.length === 2 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>String Similarity (RapidFuzz)</div>
                      <div style={{ height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden', marginBottom: 4 }}>
                        {(() => {
                          const sim = finding.type === 'ENTITY_INCONSISTENCY' && finding.bidderId === 'bidder-b' ? 71 :
                            finding.type === 'ENTITY_INCONSISTENCY' && finding.bidderId === 'bidder-c' ? 41 : 88;
                          const col = sim >= 90 ? '#16a34a' : sim >= 75 ? '#d97706' : '#dc2626';
                          return <div style={{ height: '100%', width: `${sim}%`, background: col, transition: 'width 0.8s ease' }} />;
                        })()}
                      </div>
                      <div style={{ fontSize: 11, color: '#dc2626', fontWeight: 700 }}>
                        Similarity: {finding.bidderId === 'bidder-b' ? '71%' : finding.bidderId === 'bidder-c' && finding.type === 'ENTITY_INCONSISTENCY' ? '41%' : '88%'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AI recommendation */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>AI Recommendation</div>
                <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>
                  {finding.type === 'ENTITY_INCONSISTENCY' && 'Verify whether the name variation represents the same legal entity. Request MCA certificate or official correspondence.'}
                  {finding.type === 'EXPIRED_CERTIFICATE' && 'Certificate has expired before bid submission date. Request updated certificate or clarification from bidder.'}
                  {finding.type === 'MISSING_DOCUMENT' && 'Required document not submitted. Request submission or confirm bidder is exempt.'}
                  {finding.type === 'LOW_CONFIDENCE' && 'Manual verification of document recommended due to low extraction confidence.'}
                </div>
              </div>

              {/* Human-in-the-loop */}
              <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Officer Action</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                {decisionButtons.map(btn => (
                  <button
                    key={btn.key}
                    onClick={() => handleDecision(btn.key)}
                    style={{
                      padding: '9px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, border: '1px solid',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      background: decision === btn.key ? btn.color : btn.bg,
                      color: decision === btn.key ? 'white' : btn.color,
                      borderColor: btn.color + '60',
                      transition: 'all 0.15s',
                    }}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>

              {decision && (
                <>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 4 }}>Officer Note</label>
                    <textarea
                      value={reviewNote}
                      onChange={e => { setReviewNote(e.target.value); setSaved(false); }}
                      placeholder="Add your review note…"
                      rows={3}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#334155' }}
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    style={{ width: '100%', marginTop: 8, padding: '10px', background: '#0f172a', color: 'white', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    {saved ? '✓ Decision Recorded in Audit Trail' : 'Record Decision'}
                  </button>
                  {saved && (
                    <div style={{ marginTop: 8, padding: '8px 10px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6 }}>
                      <div style={{ fontSize: 11, color: '#15803d', fontWeight: 600 }}>✓ Audit trail updated · Priya Nair (PO-001) · {new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick links */}
            <div className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Quick Navigation</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button onClick={() => navigate(`/bidders/${finding.bidderId}/compliance`)} style={{ textAlign: 'left', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Compliance Matrix <ArrowRight size={11} />
                </button>
                <button onClick={() => navigate(`/bidders/${finding.bidderId}/verification`)} style={{ textAlign: 'left', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Cross-Doc Verification <ArrowRight size={11} />
                </button>
                <button onClick={() => navigate(`/bidders/${finding.bidderId}/score`)} style={{ textAlign: 'left', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Score Breakdown <ArrowRight size={11} />
                </button>
                <button onClick={() => navigate('/audit')} style={{ textAlign: 'left', padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Audit Trail <ArrowRight size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
