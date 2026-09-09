import { TENDERS, BIDDERS, FINDINGS, AUDIT_LOGS, VERIFICATION_PROVIDERS } from '../data/mockData';

const API_BASE = 'http://localhost:5000/api';

async function fetchJson(url, options) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn(`[BidSure API Client Notice] ${url} request failed. Using local state fallback.`);
    return null;
  }
}

export const api = {
  // Stats & Dashboard
  getStats: async () => {
    const data = await fetchJson('/stats');
    if (data) return data;

    const activeTenders = TENDERS.filter(t => t.status === 'ACTIVE').length;
    const totalBidders = BIDDERS.length;
    const totalDocs = 11;
    const openFindings = FINDINGS.filter(f => f.status === 'OPEN').length;

    return {
      kpis: {
        activeTenders,
        biddersUnderReview: totalBidders,
        documentsProcessed: totalDocs,
        issuesRequiringReview: openFindings,
      },
      riskDistribution: [
        { name: 'Low Risk (Score >= 90)', count: BIDDERS.filter(b => b.riskLevel === 'LOW').length, color: '#10b981' },
        { name: 'Medium Risk (65-89)', count: BIDDERS.filter(b => b.riskLevel === 'MEDIUM').length, color: '#f59e0b' },
        { name: 'High Risk (<65)', count: BIDDERS.filter(b => b.riskLevel === 'HIGH').length, color: '#ef4444' },
      ],
    };
  },

  // Auth
  login: async (role) => {
    const data = await fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    return data;
  },

  // Tenders
  getTenders: async () => {
    const data = await fetchJson('/tenders');
    return data || TENDERS;
  },

  getTenderById: async (id) => {
    const data = await fetchJson(`/tenders/${id}`);
    return data || TENDERS.find(t => t.id === id);
  },

  // Bidders
  getBidders: async () => {
    const data = await fetchJson('/bidders');
    return data || BIDDERS;
  },

  getBidderById: async (id) => {
    const data = await fetchJson(`/bidders/${id}`);
    return data || BIDDERS.find(b => b.id === id);
  },

  // Findings
  getFindings: async () => {
    const data = await fetchJson('/findings');
    return data || FINDINGS;
  },

  getFindingById: async (id) => {
    const data = await fetchJson(`/findings/${id}`);
    return data || FINDINGS.find(f => f.id === id);
  },

  updateFindingDecision: async (id, status, officerNote, reviewedBy) => {
    const data = await fetchJson(`/findings/${id}/decision`, {
      method: 'PATCH',
      body: JSON.stringify({ status, officerNote, reviewedBy }),
    });

    if (data) return data;

    const finding = FINDINGS.find(f => f.id === id);
    if (finding) {
      finding.status = status;
      finding.reviewNote = officerNote;
      finding.reviewedAt = new Date().toISOString();
    }
    const auditEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: 'user-001',
      userName: reviewedBy || 'Priya Nair',
      userRole: 'Procurement Officer',
      action: 'OFFICER_DECISION',
      entityType: 'FINDING',
      entityId: id,
      details: `Officer decision recorded: ${status} for finding. Note: ${officerNote || 'N/A'}`,
      previousState: 'OPEN',
      newState: status,
    };
    AUDIT_LOGS.unshift(auditEntry);
    return { finding, auditEntry };
  },

  // Audit Logs
  getAuditLogs: async () => {
    const data = await fetchJson('/audit');
    return data || AUDIT_LOGS;
  },

  // Verification Gateway Adapters
  getAdapters: async () => {
    const data = await fetchJson('/adapters');
    return data || VERIFICATION_PROVIDERS;
  },

  testAdapterPing: async (id) => {
    const data = await fetchJson(`/adapters/${id}/test`, {
      method: 'POST',
    });
    if (data) return data;

    const adapter = VERIFICATION_PROVIDERS.find(a => a.id === id);
    if (adapter) {
      adapter.lastChecked = new Date().toISOString();
    }
    return { adapter };
  },
};
