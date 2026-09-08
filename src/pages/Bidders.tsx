import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Search, Upload, FileText, AlertTriangle } from 'lucide-react';
import { BIDDERS, DOCUMENTS, EXTRACTED_FIELDS, TENDERS } from '../data/mockData';
import { AppShell, Topbar } from '../components/layout';
import { PageHeader, RiskChip, DocStatusBadge, SectionCard, EmptyState, ConfidenceBar, ScoreRing } from '../components/shared';
import type { RiskLevel } from '../types';

// ============================================================
// BIDDER LIST
// ============================================================
export function BiddersPage() {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  const activeTenderId = tenderId ?? 'tender-001';
  const tender = TENDERS.find(t => t.id === activeTenderId);
  const bidders = BIDDERS
    .filter(b => b.tenderId === activeTenderId)
    .filter(b => search === '' || b.name.toLowerCase().includes(search.toLowerCase()))
    .filter(b => riskFilter === 'ALL' || b.riskLevel === riskFilter);

  return (
    <AppShell>
      <Topbar breadcrumbs={[
        { label: 'Tenders' },
        { label: tender?.referenceNumber ?? 'Tender' },
        { label: 'Bidders' }
      ]} />
      <div className="page-container">
        <PageHeader
          title="Bidder Management"
          subtitle={`${tender?.referenceNumber} — ${bidders.length} bidders registered`}
          breadcrumbs={[
            { label: 'Tenders', href: '/tenders' },
            { label: tender?.referenceNumber ?? '', href: `/tenders/${activeTenderId}` },
            { label: 'Bidders' }
          ]}
          actions={
            <button
              onClick={() => navigate(`/tenders/${activeTenderId}/compare`)}
              style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}
            >
              Compare Bidders
            </button>
          }
        />

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bidders…"
              style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: '100%', outline: 'none', background: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['ALL', 'LOW', 'MEDIUM', 'HIGH'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                style={{
                  padding: '7px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, border: '1px solid', cursor: 'pointer',
                  background: riskFilter === r ? '#0f172a' : 'white',
                  color: riskFilter === r ? 'white' : '#64748b',
                  borderColor: riskFilter === r ? '#0f172a' : '#e2e8f0',
                }}
              >
                {r === 'ALL' ? 'All Risk' : r}
              </button>
            ))}
          </div>
        </div>

        {/* Bidder cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bidders.map(b => (
            <div
              key={b.id}
              className="card"
              style={{ padding: '20px 24px', cursor: 'pointer', borderLeft: `4px solid ${b.riskLevel === 'LOW' ? '#16a34a' : b.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'}` }}
              onClick={() => navigate(`/bidders/${b.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Score */}
                <ScoreRing score={b.score} size={72} />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{b.name}</h3>
                    <RiskChip level={b.riskLevel} />
                    {b.status === 'REVIEW_REQUIRED' && (
                      <span style={{ fontSize: 11, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, padding: '2px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={10} /> Review Required
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{b.registrationNumber}</div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Total Findings: </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: b.findingsCount > 0 ? '#dc2626' : '#16a34a' }}>{b.findingsCount}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Critical: </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: b.criticalFindings > 0 ? '#dc2626' : '#16a34a' }}>{b.criticalFindings}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Added: </span>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{new Date(b.addedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/bidders/${b.id}/compliance`); }}
                    style={{ fontSize: 12, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Compliance Matrix
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/bidders/${b.id}`); }}
                    style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}
                  >
                    View Detail <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {bidders.length === 0 && (
            <EmptyState
              title="No bidders match your filter"
              description="Try adjusting the search or risk filter."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// BIDDER DETAIL
// ============================================================
export function BidderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bidder = BIDDERS.find(b => b.id === id);
  const docs = DOCUMENTS.filter(d => d.bidderId === id);
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
        { label: 'Bidders' },
        { label: bidder.name }
      ]} />
      <div className="page-container">
        <PageHeader
          title={bidder.name}
          subtitle={bidder.registrationNumber + ' · ' + bidder.contactEmail}
          breadcrumbs={[
            { label: 'Tenders', href: '/tenders' },
            { label: tender?.referenceNumber ?? '', href: `/tenders/${bidder.tenderId}` },
            { label: 'Bidders', href: `/tenders/${bidder.tenderId}/bidders` },
            { label: bidder.name }
          ]}
          actions={
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate(`/bidders/${id}/compliance`)} style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer' }}>
                Compliance Matrix →
              </button>
            </div>
          }
        />

        {/* Score header */}
        <div className="card" style={{ padding: '24px 28px', marginBottom: 20, display: 'flex', gap: 32, alignItems: 'center', borderLeft: `4px solid ${bidder.riskLevel === 'LOW' ? '#16a34a' : bidder.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'}` }}>
          <ScoreRing score={bidder.score} size={100} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4 }}>Compliance Score</div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <RiskChip level={bidder.riskLevel} size="md" />
              {bidder.status === 'REVIEW_REQUIRED' && (
                <span style={{ fontSize: 12, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '4px 10px', fontWeight: 700 }}>⚠ OFFICER REVIEW REQUIRED</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Total Findings: </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: bidder.findingsCount > 0 ? '#dc2626' : '#16a34a' }}>{bidder.findingsCount}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Critical: </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: bidder.criticalFindings > 0 ? '#dc2626' : '#16a34a' }}>{bidder.criticalFindings}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>Documents: </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{docs.length}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
            <button onClick={() => navigate(`/bidders/${id}/compliance`)} style={{ fontSize: 13, fontWeight: 600, color: 'white', background: '#2563eb', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>Compliance Matrix</button>
            <button onClick={() => navigate(`/bidders/${id}/verification`)} style={{ fontSize: 13, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 20px', cursor: 'pointer' }}>Cross-Doc Verification</button>
          </div>
        </div>

        {/* Document Table */}
        <SectionCard
          title="Submitted Documents"
          subtitle={`${docs.length} documents in submission`}
          actions={
            <button style={{ fontSize: 12, fontWeight: 600, color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Upload size={12} /> Upload Document
            </button>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Document', 'Type', 'Status', 'Pages', 'Extraction', 'Confidence', 'Uploaded', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => {
                  const fields = EXTRACTED_FIELDS.filter(f => f.documentId === doc.id);
                  return (
                    <tr key={doc.id} className="table-row" style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }} onClick={() => navigate(`/documents/${doc.id}`)}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <FileText size={14} color="#3b82f6" />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{doc.fileName}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>{doc.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#334155' }}>{doc.documentType}</td>
                      <td style={{ padding: '12px 14px' }}><DocStatusBadge status={doc.status} /></td>
                      <td style={{ padding: '12px 14px', fontSize: 12, color: '#64748b' }}>{doc.pageCount}</td>
                      <td style={{ padding: '12px 14px', fontSize: 12 }}>
                        <span style={{ color: doc.extractionStatus === 'COMPLETE' ? '#16a34a' : doc.extractionStatus === 'PARTIAL' ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                          {doc.extractionStatus}
                        </span>
                        {fields.length > 0 && <span style={{ color: '#94a3b8', fontSize: 11 }}> · {fields.length} fields</span>}
                      </td>
                      <td style={{ padding: '12px 14px', minWidth: 120 }}>
                        <ConfidenceBar value={doc.confidence} />
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: 11, color: '#94a3b8' }}>
                        {new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View →</button>
                      </td>
                    </tr>
                  );
                })}

                {/* Show missing OEM for Bidder C */}
                {id === 'bidder-c' && (
                  <tr style={{ background: '#fef2f2', borderBottom: '1px solid #f8fafc' }}>
                    <td colSpan={8} style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={14} color="#dc2626" />
                        <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>OEM Authorization Letter — MISSING</span>
                        <span style={{ fontSize: 11, color: '#dc2626' }}>Mandatory requirement (REQ-003, Tender Page 15) — no document submitted</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

// ============================================================
// DOCUMENT DETAIL
// ============================================================
export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const doc = DOCUMENTS.find(d => d.id === id);
  const fields = EXTRACTED_FIELDS.filter(f => f.documentId === id);

  if (!doc) return (
    <AppShell><Topbar />
      <div className="page-container"><EmptyState title="Document not found" /></div>
    </AppShell>
  );

  const bidder = BIDDERS.find(b => b.id === doc.bidderId);

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Documents' }, { label: doc.fileName }]} />
      <div className="page-container">
        <PageHeader
          title={doc.fileName}
          subtitle={`${doc.documentType} · ${doc.pageCount} pages · Uploaded ${new Date(doc.uploadedAt).toLocaleDateString('en-IN')}`}
          breadcrumbs={[
            { label: 'Bidders', href: '/bidders' },
            { label: bidder?.name ?? '', href: `/bidders/${doc.bidderId}` },
            { label: doc.fileName }
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
          {/* Document overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SectionCard title="Document Overview">
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Classification', value: doc.documentType, highlight: true },
                  { label: 'Status', value: doc.status },
                  { label: 'Pages', value: doc.pageCount.toString() },
                  { label: 'File Size', value: doc.fileSize },
                  { label: 'Extraction', value: doc.extractionStatus },
                  { label: 'Confidence', value: doc.confidence + '%' },
                  { label: 'Uploaded', value: new Date(doc.uploadedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: item.highlight ? '#2563eb' : '#334155', textAlign: 'right' }}>{item.value}</span>
                  </div>
                ))}
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>SHA-256 Hash</div>
                  <code style={{ fontSize: 10, background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: 4, display: 'block', wordBreak: 'break-all', fontFamily: 'monospace' }}>{doc.sha256}…</code>
                </div>
              </div>
            </SectionCard>

            {/* Classification confidence */}
            <SectionCard title="AI Classification">
              <div style={{ padding: '16px 20px' }}>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 700, marginBottom: 2 }}>Classified As</div>
                  <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 700 }}>{doc.documentType}</div>
                  <div style={{ fontSize: 11, color: '#3b82f6', marginTop: 2 }}>Confidence: {doc.confidence}%</div>
                </div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Classification is based on document structure, header text, and issuing authority identification.</div>
              </div>
            </SectionCard>
          </div>

          {/* Extracted fields */}
          <SectionCard
            title="Extracted Fields"
            subtitle={`${fields.length} fields extracted from document`}
          >
            <div>
              {fields.map((field, idx) => (
                <div key={field.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '14px 20px', borderBottom: idx < fields.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{field.fieldName}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{field.value}</div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>Source: Page {field.sourcePage}</span>
                      {field.needsReview && (
                        <span style={{ fontSize: 10, color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>REVIEW REQUIRED</span>
                      )}
                    </div>
                  </div>
                  <div style={{ minWidth: 140 }}>
                    <ConfidenceBar value={field.confidence} />
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No fields extracted</div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// ALL DOCUMENTS PAGE
// ============================================================
export function AllDocumentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const docs = DOCUMENTS.filter(d =>
    search === '' ||
    d.fileName.toLowerCase().includes(search.toLowerCase()) ||
    d.documentType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Documents' }]} />
      <div className="page-container">
        <PageHeader
          title="Document Repository"
          subtitle={`${DOCUMENTS.length} documents across all active tenders`}
        />

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents…"
            style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, width: '100%', maxWidth: 360, outline: 'none', background: 'white' }}
          />
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Document', 'Bidder', 'Type', 'Status', 'Pages', 'Confidence', 'Uploaded', ''].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => {
                const bidder = BIDDERS.find(b => b.id === doc.bidderId);
                return (
                  <tr key={doc.id} className="table-row" style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }} onClick={() => navigate(`/documents/${doc.id}`)}>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                        <FileText size={13} color="#3b82f6" />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{doc.fileName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748b' }}>{bidder?.name ?? '—'}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#475569' }}>{doc.documentType}</td>
                    <td style={{ padding: '11px 14px' }}><DocStatusBadge status={doc.status} /></td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#64748b' }}>{doc.pageCount}</td>
                    <td style={{ padding: '11px 14px', minWidth: 120 }}><ConfidenceBar value={doc.confidence} /></td>
                    <td style={{ padding: '11px 14px', fontSize: 11, color: '#94a3b8' }}>{new Date(doc.uploadedAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '11px 14px' }}><button style={{ fontSize: 11, color: '#2563eb', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View →</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
