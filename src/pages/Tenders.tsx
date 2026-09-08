import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, FileText, Users, Calendar, Building2, CheckCircle } from 'lucide-react';
import { TENDERS, REQUIREMENTS, BIDDERS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { PageHeader, StatusBadge, SectionCard, EmptyState } from '../components/shared';

// ============================================================
// TENDER LIST
// ============================================================
export function TendersPage() {
  const navigate = useNavigate();
  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders' }]} />
      <div className="page-container">
        <PageHeader
          title="Tender Management"
          subtitle="Manage and analyze procurement tenders"
          breadcrumbs={[{ label: 'Overview', href: '/' }, { label: 'Tenders' }]}
          actions={
            <button
              onClick={() => navigate('/tenders/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              + New Tender
            </button>
          }
        />

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Tender ID', 'Tender Name', 'Organization', 'Submission Date', 'Bidders', 'Requirements', 'Compliance', 'Last Analysis', ''].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TENDERS.map(t => (
                <tr key={t.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onClick={() => navigate(`/tenders/${t.id}`)}>
                  <td style={{ padding: '14px 16px' }}>
                    <span className="font-mono" style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>{t.referenceNumber}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>{t.name}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.organization}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#475569' }}>
                    {new Date(t.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#334155' }}>{t.bidderCount}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#334155' }}>{t.requirementCount}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge status={t.complianceStatus === 'REVIEW_REQUIRED' ? 'REVIEW_REQUIRED' : 'PASS'} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 11, color: '#94a3b8' }}>
                    {new Date(t.lastAnalysis).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ fontSize: 12, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                      Open <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// TENDER DETAIL
// ============================================================
export function TenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tender = TENDERS.find(t => t.id === id);
  const requirements = REQUIREMENTS.filter(r => r.tenderId === id);
  const bidders = BIDDERS.filter(b => b.tenderId === id);

  if (!tender) return (
    <AppShell>
      <Topbar />
      <div className="page-container"><EmptyState title="Tender not found" description="This tender does not exist." /></div>
    </AppShell>
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders' }, { label: tender.referenceNumber }, { label: 'Overview' }]} />
      <div className="page-container">
        <PageHeader
          title={tender.name}
          subtitle={tender.referenceNumber + ' · ' + tender.organization}
          breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: tender.referenceNumber }]}
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate(`/tenders/${id}/requirements`)}
                style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
              >
                View Requirements
              </button>
              <button
                onClick={() => navigate(`/tenders/${id}/bidders`)}
                style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
              >
                View Bidders →
              </button>
            </div>
          }
        />

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { icon: <Calendar size={16} />, label: 'Submission Date', value: new Date(tender.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
            { icon: <FileText size={16} />, label: 'Requirements', value: requirements.length + ' extracted' },
            { icon: <Users size={16} />, label: 'Bidders', value: bidders.length + ' registered' },
            { icon: <Building2 size={16} />, label: 'Organization', value: tender.organization.split(',')[0] },
          ].map(item => (
            <div key={item.label} className="card" style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ color: '#2563eb', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          {/* Requirements preview */}
          <SectionCard
            title="Extracted Requirements"
            subtitle={`${requirements.length} requirements from tender document`}
            actions={
              <button onClick={() => navigate(`/tenders/${id}/requirements`)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Full analysis →</button>
            }
          >
            <div>
              {requirements.map((req, idx) => (
                <div key={req.id} style={{ display: 'flex', gap: 12, padding: '14px 20px', borderBottom: idx < requirements.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>{idx + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                      <span className="font-mono" style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>{req.code}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{req.name}</span>
                      {req.mandatory && (
                        <span style={{ fontSize: 10, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>Mandatory</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Source: Page {req.sourcePage}</span>
                      <span style={{ fontSize: 11, color: req.confidence >= 90 ? '#16a34a' : '#d97706' }}>Confidence: {req.confidence}%</span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{req.type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <CheckCircle size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 6 }} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Bidder summary */}
          <SectionCard title="Registered Bidders" actions={
            <button onClick={() => navigate(`/tenders/${id}/bidders`)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">All →</button>
          }>
            <div>
              {bidders.map((b, idx) => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/bidders/${b.id}`)}
                  style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: idx < bidders.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer', alignItems: 'center' }}
                  className="table-row"
                >
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: b.riskLevel === 'LOW' ? '#f0fdf4' : b.riskLevel === 'MEDIUM' ? '#fffbeb' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: b.riskLevel === 'LOW' ? '#16a34a' : b.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626' }}>{b.score}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', marginBottom: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{b.findingsCount} findings · {b.riskLevel} risk</div>
                  </div>
                  <ArrowRight size={12} color="#94a3b8" />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Description */}
        <div className="card" style={{ marginTop: 16, padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 8 }}>Tender Description</h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{tender.description}</p>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// REQUIREMENTS ANALYSIS
// ============================================================
export function RequirementsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tender = TENDERS.find(t => t.id === id);
  const requirements = REQUIREMENTS.filter(r => r.tenderId === id);

  const typeLabels: Record<string, string> = {
    DOCUMENT_REQUIRED: 'Document Required',
    DATE_VALIDITY: 'Date Validity Check',
    ENTITY_CONSISTENCY: 'Entity Consistency',
    DECLARATION: 'Declaration Required',
    FINANCIAL: 'Financial',
  };

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Tenders' }, { label: tender?.referenceNumber ?? '' }, { label: 'Requirement Analysis' }]} />
      <div className="page-container">
        <PageHeader
          title="Requirement Analysis"
          subtitle={`AI-extracted compliance requirements from tender document · ${tender?.referenceNumber}`}
          breadcrumbs={[{ label: 'Tenders', href: '/tenders' }, { label: tender?.referenceNumber ?? '', href: `/tenders/${id}` }, { label: 'Requirements' }]}
          actions={
            <button
              onClick={() => navigate(`/tenders/${id}/bidders`)}
              style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              View Bidders <ArrowRight size={14} />
            </button>
          }
        />

        {/* AI notice */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1d4ed8', marginBottom: 2 }}>AI Extraction Pipeline Complete</div>
            <div style={{ fontSize: 12, color: '#3b82f6' }}>
              Text extraction → Requirement identification → Normalization → Compliance checklist generation. {requirements.length} requirements extracted. All requirements require Procurement Officer review before use.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {requirements.map((req) => (
            <div key={req.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {/* Left color bar */}
                <div style={{ width: 4, background: req.mandatory ? '#2563eb' : '#94a3b8', flexShrink: 0 }} />

                <div style={{ flex: 1, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 6px' }}>{req.code}</span>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{req.name}</h3>
                      </div>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginBottom: 10 }}>{req.description}</p>
                    </div>

                    {/* Right meta */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180, flexShrink: 0 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <div style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Type</div>
                          <div style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>{typeLabels[req.type] ?? req.type}</div>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Mandatory</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: req.mandatory ? '#dc2626' : '#16a34a' }}>{req.mandatory ? 'YES' : 'NO'}</div>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Source</div>
                          <div style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>Page {req.sourcePage}</div>
                        </div>
                        <div style={{ background: '#f8fafc', borderRadius: 6, padding: '8px 10px' }}>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>Confidence</div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: req.confidence >= 90 ? '#16a34a' : '#d97706' }}>{req.confidence}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rule */}
                  {req.rule && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginRight: 6 }}>Validation Rule:</span>
                      <code style={{ fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>{req.rule}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
          <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>{requirements.filter(r => r.mandatory).length}</strong> Mandatory requirements
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>{requirements.filter(r => r.confidence >= 90).length}</strong> High confidence extractions
            </span>
            <span style={{ fontSize: 12, color: '#64748b' }}>
              <strong style={{ color: '#0f172a' }}>Status:</strong>{' '}
              <span style={{ color: '#16a34a', fontWeight: 600 }}>READY FOR VERIFICATION</span>
            </span>
          </div>
          <button
            onClick={() => navigate(`/tenders/${id}/bidders`)}
            style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            Proceed to Bidder Analysis <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
