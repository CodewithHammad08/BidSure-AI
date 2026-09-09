import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { COMPLIANCE_CHECKS, ENTITY_COMPARISONS, COMPLIANCE_SCORES } from '../data/mockData.js';
import { api } from '../api/client.js';
import { AppShell, Topbar } from '../components/layout.jsx';
import { PageHeader, StatusBadge, RiskChip, SectionCard, EmptyState } from '../components/shared.jsx';
import { ShieldCheck, CheckCircle, AlertTriangle, ArrowRight, Activity, Percent } from 'lucide-react';

export function ComplianceMatrixPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bidderId = id || 'bidder-a';
  const checks = COMPLIANCE_CHECKS[bidderId] || COMPLIANCE_CHECKS['bidder-a'];

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Compliance', href: '/compliance' }, { label: '5-Tier Compliance Matrix' }]} />
      <div className="page-container">
        <PageHeader
          title="5-Tier Compliance Matrix"
          subtitle="Requirement-by-requirement status mapping (PASS, REVIEW_REQUIRED, MISSING, EXPIRED, MISMATCH)"
          actions={
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => navigate(`/bidders/${bidderId}/verification`)} className="btn btn-secondary btn-sm">
                Cross-Doc Verification →
              </button>
              <button onClick={() => navigate(`/bidders/${bidderId}/score`)} className="btn btn-primary btn-sm">
                Score Breakdown →
              </button>
            </div>
          }
        />

        <SectionCard title="Mandatory Requirement Status">
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rule ID</th>
                  <th>Requirement Name</th>
                  <th>Extracted Evidence</th>
                  <th>Validation Rationale</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {checks.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-400)', fontWeight: 700 }}>
                      {c.requirement?.code || c.id}
                    </td>
                    <td style={{ fontWeight: 600, color: '#ffffff' }}>{c.requirement?.name || 'GST Registration'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.extractedData}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{c.validation}</td>
                    <td><StatusBadge status={c.status} /></td>
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

export function CrossDocVerificationPage() {
  const { id } = useParams();
  const bidderId = id || 'bidder-b';
  const comparisons = ENTITY_COMPARISONS[bidderId] || ENTITY_COMPARISONS['bidder-b'];

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Compliance' }, { label: 'RapidFuzz Cross-Doc Verification' }]} />
      <div className="page-container">
        <PageHeader
          title="RapidFuzz Cross-Document Intelligence"
          subtitle="String similarity entity comparison across GST, MSME, and Signatory documents"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {comparisons.map((comp, idx) => (
            <div key={idx} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{comp.fieldName}</h3>
                <span className={`badge ${comp.similarity >= 90 ? 'badge-pass' : comp.similarity >= 70 ? 'badge-warn' : 'badge-danger'}`}>
                  <Percent size={12} /> {comp.similarity}% Similarity Match
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                {comp.note}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                {comp.documents.map((doc, dIdx) => (
                  <div key={dIdx} style={{ padding: 14, background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 11, color: 'var(--cyan-400)', fontWeight: 600, marginBottom: 4 }}>{doc.documentType}</div>
                    <div className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>"{doc.value}"</div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 4 }}>Page {doc.sourcePage}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export function ComplianceScorePage() {
  const { id } = useParams();
  const bidderId = id || 'bidder-a';
  const scoreData = COMPLIANCE_SCORES[bidderId] || COMPLIANCE_SCORES['bidder-a'];

  return (
    <AppShell>
      <Topbar breadcrumbs={[{ label: 'Compliance' }, { label: '100-Point Score Rationale' }]} />
      <div className="page-container">
        <PageHeader
          title="Explainable 100-Point Compliance Score Model"
          subtitle="Transparent point breakdown across 5 evaluation categories"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8 }}>Total Compliance Score</div>
            <div style={{ fontSize: 56, fontWeight: 800, color: scoreData.total >= 80 ? 'var(--emerald-400)' : 'var(--amber-400)', lineHeight: 1 }}>
              {scoreData.total}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-subtle)', marginTop: 4 }}>out of 100 Points</div>
            <div style={{ marginTop: 16 }}><RiskChip level={scoreData.riskLevel} /></div>
          </div>

          <SectionCard title="Category Point Allocation">
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Earned / Max</th>
                    <th>Audit Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreData.breakdown.map((b, idx) => (
                    <tr key={idx} className="table-row">
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{b.category}</td>
                      <td style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>{b.earned} / {b.total} pts</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.note}</td>
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

export function AllCompliancePage() {
  return <ComplianceMatrixPage />;
}
