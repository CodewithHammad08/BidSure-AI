import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { BIDDERS, COMPLIANCE_CHECKS, COMPLIANCE_SCORES, ENTITY_COMPARISONS, TENDERS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { PageHeader, StatusBadge, SectionCard, ScoreRing, RiskChip, SimilarityMeter, ConfidenceBar, EmptyState } from '../components/shared';
import type { ComplianceStatus } from '../types';

// ============================================================
// STATUS ICON
// ============================================================
function StatusIcon({ status }: { status: ComplianceStatus }) {
  const props = { size: 16 };
  switch (status) {
    case 'PASS': return <CheckCircle {...props} color="#16a34a" />;
    case 'MISSING': return <XCircle {...props} color="#7c3aed" />;
    case 'EXPIRED': return <XCircle {...props} color="#dc2626" />;
    case 'MISMATCH': return <AlertTriangle {...props} color="#dc2626" />;
    case 'REVIEW_REQUIRED': return <AlertTriangle {...props} color="#d97706" />;
    default: return <Clock {...props} color="#94a3b8" />;
  }
}

// ============================================================
// COMPLIANCE MATRIX PAGE
// ============================================================
export function ComplianceMatrixPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bidder = BIDDERS.find(b => b.id === id);
  const checks = COMPLIANCE_CHECKS[id ?? ''] ?? [];
  const score = COMPLIANCE_SCORES[id ?? ''];
  const tender = TENDERS.find(t => t.id === bidder?.tenderId);

  if (!bidder) return (
    <AppShell><Topbar />
      <div className="page-container"><EmptyState title="Bidder not found" /></div>
    </AppShell>
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[
        { label: 'Tenders' },
        { label: tender?.referenceNumber ?? '' },
        { label: bidder.name },
        { label: 'Compliance Matrix' }
      ]} />
      <div className="page-container">
        <PageHeader
          title="Compliance Matrix"
          subtitle={`${bidder.name} — requirement-by-requirement verification results`}
          breadcrumbs={[
            { label: 'Tenders', href: '/tenders' },
            { label: tender?.referenceNumber ?? '', href: `/tenders/${bidder.tenderId}` },
            { label: 'Bidders', href: `/tenders/${bidder.tenderId}/bidders` },
            { label: bidder.name, href: `/bidders/${id}` },
            { label: 'Compliance' }
          ]}
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate(`/bidders/${id}/verification`)} style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
                Cross-Doc Verification
              </button>
              <button onClick={() => navigate(`/bidders/${id}/score`)} style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
                Score Breakdown →
              </button>
            </div>
          }
        />

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, marginBottom: 20 }}>
          <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'center' }}>
            <ScoreRing score={bidder.score} size={88} />
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Overall Score</div>
              <RiskChip level={bidder.riskLevel} />
              {score && (
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                  Generated: {new Date(score.generatedAt).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {[
              { label: 'Pass', count: checks.filter(c => c.status === 'PASS').length, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Review Required', count: checks.filter(c => c.status === 'REVIEW_REQUIRED').length, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
              { label: 'Missing', count: checks.filter(c => c.status === 'MISSING').length, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
              { label: 'Expired', count: checks.filter(c => c.status === 'EXPIRED').length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
              { label: 'Mismatch', count: checks.filter(c => c.status === 'MISMATCH').length, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '14px', textAlign: 'center', background: s.count > 0 ? s.bg : 'white', borderColor: s.count > 0 ? s.border : undefined }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.count > 0 ? s.color : '#cbd5e1' }}>{s.count}</div>
                <div style={{ fontSize: 11, color: s.count > 0 ? s.color : '#94a3b8', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Matrix table */}
        <SectionCard
          title="Requirement Compliance Matrix"
          subtitle="Requirement-by-requirement evidence validation results"
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Requirement', 'Mandatory', 'Evidence Document', 'Extracted Data', 'Validation', 'Status', 'Confidence', 'Action'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {checks.map((check, idx) => (
                  <tr
                    key={check.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: check.status === 'PASS' ? 'white' :
                        check.status === 'MISSING' ? '#faf5ff' :
                        check.status === 'EXPIRED' || check.status === 'MISMATCH' ? '#fff8f8' :
                        '#fffdf5',
                    }}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
                        <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 3, padding: '1px 5px' }}>{check.requirement.code}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{check.requirement.name}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: check.requirement.mandatory ? '#dc2626' : '#64748b' }}>
                        {check.requirement.mandatory ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      {check.documentName
                        ? <span style={{ fontSize: 12, color: '#2563eb', fontWeight: 500 }}>{check.documentName}</span>
                        : <span style={{ fontSize: 11, color: '#dc2626', fontStyle: 'italic' }}>No document found</span>
                      }
                    </td>
                    <td style={{ padding: '14px', maxWidth: 220 }}>
                      <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>
                        {check.extractedData ?? '—'}
                      </div>
                    </td>
                    <td style={{ padding: '14px', maxWidth: 220 }}>
                      <div style={{ fontSize: 11, color: check.status === 'PASS' ? '#16a34a' : check.status === 'REVIEW_REQUIRED' ? '#d97706' : '#dc2626', lineHeight: 1.5, fontWeight: 500 }}>
                        {check.validation ?? check.notes ?? '—'}
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusIcon status={check.status} />
                        <StatusBadge status={check.status} size="sm" />
                      </div>
                    </td>
                    <td style={{ padding: '14px', minWidth: 130 }}>
                      {check.status !== 'MISSING' ? (
                        <ConfidenceBar value={check.confidence} />
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    <td style={{ padding: '14px' }}>
                      {check.status !== 'PASS' && check.status !== 'PENDING' && (
                        <button
                          onClick={() => {
                            const finding = (id === 'bidder-b' && idx === 4) ? '/findings/fnd-1042' :
                              (id === 'bidder-c' && idx === 0) ? '/findings/fnd-1044' :
                              (id === 'bidder-c' && idx === 2) ? '/findings/fnd-1045' :
                              (id === 'bidder-c' && idx === 4) ? '/findings/fnd-1046' :
                              '/findings';
                            navigate(finding);
                          }}
                          style={{ fontSize: 11, color: '#2563eb', fontWeight: 700, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}
                        >
                          View Finding →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* Disclaimer */}
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6 }}>
            <strong>Decision Support System:</strong> This compliance matrix is generated by BidSure AI for Procurement Officer review. Statuses are AI recommendations based on document analysis. The Procurement Officer must review all flagged findings before making procurement decisions. This system does not automatically qualify or disqualify any bidder.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// CROSS-DOCUMENT VERIFICATION
// ============================================================
export function CrossDocVerificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bidder = BIDDERS.find(b => b.id === id);
  const comparisons = ENTITY_COMPARISONS[id ?? ''] ?? [];

  const resultColors: Record<string, string> = {
    MATCH: '#16a34a',
    LIKELY_MATCH: '#d97706',
    REVIEW_REQUIRED: '#d97706',
    SIGNIFICANT_MISMATCH: '#dc2626',
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[
        { label: 'Bidders' },
        { label: bidder?.name ?? '' },
        { label: 'Cross-Doc Verification' }
      ]} />
      <div className="page-container">
        <PageHeader
          title="Cross-Document Verification"
          subtitle={`${bidder?.name} — entity consistency analysis across all submitted documents`}
          breadcrumbs={[
            { label: 'Bidders', href: `/tenders/${bidder?.tenderId}/bidders` },
            { label: bidder?.name ?? '', href: `/bidders/${id}` },
            { label: 'Verification' }
          ]}
          actions={
            <button onClick={() => navigate(`/bidders/${id}/compliance`)} style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
              ← Compliance Matrix
            </button>
          }
        />

        {/* Notice */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <HelpCircle size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ fontSize: 12, color: '#2563eb', lineHeight: 1.6 }}>
            Cross-document verification uses string similarity matching (RapidFuzz) to compare extracted field values across documents. Similarity ≥ 90% = Match · 75–89% = Likely Match · 60–74% = Review Required · &lt; 60% = Significant Mismatch. All results require Procurement Officer review.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comparisons.map((comp, idx) => {
            const resultColor = resultColors[comp.result] ?? '#64748b';
            return (
              <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', borderLeft: `4px solid ${resultColor}` }}>
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Field Comparison</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{comp.fieldName}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ minWidth: 200 }}>
                      <SimilarityMeter value={comp.similarity} />
                    </div>
                    <div style={{ background: resultColor + '15', border: `1px solid ${resultColor}40`, borderRadius: 6, padding: '6px 12px', color: resultColor, fontSize: 12, fontWeight: 700 }}>
                      {comp.result.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                {/* Document values */}
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${comp.documents.length}, 1fr)`, gap: 12, marginBottom: 14 }}>
                    {comp.documents.map((doc, di) => (
                      <div key={di} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{doc.documentType}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{doc.documentName}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>"{doc.value}"</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Source: Page {doc.sourcePage}</div>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div style={{ display: 'flex', gap: 8, padding: '10px 12px', background: resultColor === '#16a34a' ? '#f0fdf4' : resultColor === '#d97706' ? '#fffbeb' : '#fef2f2', borderRadius: 6, border: `1px solid ${resultColor}30` }}>
                    <AlertTriangle size={13} color={resultColor} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div style={{ fontSize: 12, color: resultColor === '#16a34a' ? '#15803d' : resultColor === '#d97706' ? '#92400e' : '#991b1b', lineHeight: 1.5 }}>{comp.note}</div>
                  </div>
                </div>

                {/* Action */}
                {comp.result !== 'MATCH' && (
                  <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        if (id === 'bidder-b') navigate('/findings/fnd-1042');
                        else if (id === 'bidder-c') navigate('/findings/fnd-1046');
                        else navigate('/findings');
                      }}
                      style={{ fontSize: 12, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      View Finding & Evidence <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {comparisons.length === 0 && (
            <EmptyState title="No comparisons available" description="Entity comparison data will appear after document processing." />
          )}
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// COMPLIANCE SCORE PAGE
// ============================================================
export function ComplianceScorePage() {
  const { id } = useParams<{ id: string }>();
  const bidder = BIDDERS.find(b => b.id === id);
  const score = COMPLIANCE_SCORES[id ?? ''];

  if (!bidder || !score) return (
    <AppShell><Topbar />
      <div className="page-container"><EmptyState title="Score not available" /></div>
    </AppShell>
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Bidders' }, { label: bidder.name }, { label: 'Score' }]} />
      <div className="page-container">
        <PageHeader
          title="Compliance Score Breakdown"
          subtitle={`${bidder.name} — explainable scoring with source traceability`}
          breadcrumbs={[
            { label: 'Bidders', href: `/tenders/${bidder.tenderId}/bidders` },
            { label: bidder.name, href: `/bidders/${id}` },
            { label: 'Score' }
          ]}
        />

        {/* Score hero */}
        <div className="card" style={{ padding: '32px', marginBottom: 20, display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <ScoreRing score={score.total} max={score.maxTotal} size={130} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Compliance Score</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: score.total >= 80 ? '#16a34a' : score.total >= 60 ? '#d97706' : '#dc2626', marginBottom: 8, lineHeight: 1 }}>
              {score.total} <span style={{ fontSize: 18, color: '#94a3b8' }}>/ {score.maxTotal}</span>
            </div>
            <RiskChip level={score.riskLevel} />
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Prototype scoring — not an official qualification threshold</div>
          </div>
        </div>

        {/* Breakdown */}
        <SectionCard title="Score Breakdown" subtitle="Point-by-point explanation of score deductions">
          <div>
            {score.breakdown.map((cat, idx) => (
              <div key={cat.category} style={{ padding: '16px 20px', borderBottom: idx < score.breakdown.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{cat.category}</div>
                    <div style={{ fontSize: 12, color: cat.earned < cat.total ? '#d97706' : '#64748b' }}>{cat.note}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: cat.earned === cat.total ? '#16a34a' : cat.earned > cat.total * 0.6 ? '#d97706' : '#dc2626' }}>{cat.earned}</span>
                    <span style={{ fontSize: 13, color: '#94a3b8' }}> / {cat.total}</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(cat.earned / cat.total) * 100}%`, borderRadius: 4, background: cat.earned === cat.total ? '#16a34a' : cat.earned > cat.total * 0.6 ? '#d97706' : '#dc2626', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}

            <div style={{ padding: '16px 20px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Total Score</span>
              <div>
                <span style={{ fontSize: 24, fontWeight: 900, color: score.total >= 80 ? '#16a34a' : score.total >= 60 ? '#d97706' : '#dc2626' }}>{score.total}</span>
                <span style={{ fontSize: 14, color: '#94a3b8' }}> / {score.maxTotal}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Disclaimer */}
        <div style={{ marginTop: 12, padding: '12px 16px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.7 }}>
            <strong>⚠ Important:</strong> {score.disclaimer}
          </p>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// ALL COMPLIANCE PAGE
// ============================================================
export function AllCompliancePage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Compliance' }]} />
      <div className="page-container">
        <PageHeader
          title="Compliance Overview"
          subtitle="Compliance analysis across all active tenders and bidders"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BIDDERS.map(b => (
            <div key={b.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => navigate(`/bidders/${b.id}/compliance`)}>
              <ScoreRing score={b.score} size={60} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{b.name}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <RiskChip level={b.riskLevel} size="sm" />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>TENDER-2026-001</span>
                  <span style={{ fontSize: 11, color: b.findingsCount > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{b.findingsCount} findings</span>
                </div>
              </div>
              <button style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Compliance Matrix <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
