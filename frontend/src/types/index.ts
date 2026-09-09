// ============================================================
// BidSure AI — Core TypeScript Types
// ============================================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ComplianceStatus = 'PASS' | 'REVIEW_REQUIRED' | 'MISSING' | 'EXPIRED' | 'MISMATCH' | 'PENDING';
export type FindingSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type FindingType =
  | 'MISSING_DOCUMENT'
  | 'EXPIRED_CERTIFICATE'
  | 'ENTITY_INCONSISTENCY'
  | 'LOW_CONFIDENCE'
  | 'VERIFICATION_FAILED';
export type DocumentStatus = 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'PROCESSED' | 'NEEDS_REVIEW' | 'FAILED' | 'MISSING';
export type RequirementType = 'DOCUMENT_REQUIRED' | 'DATE_VALIDITY' | 'ENTITY_CONSISTENCY' | 'DECLARATION' | 'FINANCIAL';
export type FindingDecision = 'ACCEPT' | 'DISMISS' | 'REQUEST_CLARIFICATION' | 'PENDING';
export type VerificationProviderStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'DEGRADED' | 'MOCK';

// ============================================================
// User
// ============================================================
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatarInitials: string;
}

// ============================================================
// Tender
// ============================================================
export interface Tender {
  id: string;
  referenceNumber: string;
  name: string;
  organization: string;
  submissionDate: string;
  description: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  bidderCount: number;
  requirementCount: number;
  lastAnalysis: string;
  complianceStatus: 'COMPLIANT' | 'PARTIAL' | 'REVIEW_REQUIRED' | 'PENDING';
  createdAt: string;
}

// ============================================================
// Requirement
// ============================================================
export interface Requirement {
  id: string;
  tenderId: string;
  code: string;
  name: string;
  description: string;
  type: RequirementType;
  mandatory: boolean;
  sourcePage: number;
  confidence: number;
  status: 'READY' | 'PENDING' | 'NEEDS_REVIEW';
  rule?: string;
}

// ============================================================
// Bidder
// ============================================================
export interface Bidder {
  id: string;
  tenderId: string;
  name: string;
  registrationNumber: string;
  contactEmail: string;
  score: number;
  riskLevel: RiskLevel;
  status: 'REVIEW_REQUIRED' | 'ANALYSIS_COMPLETE' | 'PENDING';
  findingsCount: number;
  criticalFindings: number;
  addedAt: string;
}

// ============================================================
// Document
// ============================================================
export interface Document {
  id: string;
  bidderId: string;
  fileName: string;
  documentType: string;
  status: DocumentStatus;
  pageCount: number;
  extractionStatus: 'COMPLETE' | 'PARTIAL' | 'FAILED' | 'PENDING';
  confidence: number;
  fileSize: string;
  sha256: string;
  uploadedAt: string;
  processedAt?: string;
}

// ============================================================
// Extracted Field
// ============================================================
export interface ExtractedField {
  id: string;
  documentId: string;
  fieldName: string;
  value: string;
  confidence: number;
  sourcePage: number;
  needsReview: boolean;
}

// ============================================================
// Compliance Check
// ============================================================
export interface ComplianceCheck {
  id: string;
  bidderId: string;
  requirementId: string;
  requirement: Requirement;
  documentId?: string;
  documentName?: string;
  extractedData?: string;
  validation?: string;
  status: ComplianceStatus;
  confidence: number;
  notes?: string;
}

// ============================================================
// Finding
// ============================================================
export interface Finding {
  id: string;
  code: string;
  bidderId: string;
  bidderName: string;
  tenderId: string;
  tenderName: string;
  type: FindingType;
  severity: FindingSeverity;
  requirementId: string;
  requirementName: string;
  status: 'OPEN' | 'REVIEWED' | 'RESOLVED';
  decision: FindingDecision;
  detectedAt: string;
  description: string;
  evidence: Evidence[];
  reviewedAt?: string;
  reviewNote?: string;
}

// ============================================================
// Evidence
// ============================================================
export interface Evidence {
  id: string;
  findingId: string;
  documentId: string;
  documentName: string;
  documentType: string;
  sourcePage: number;
  extractedValue: string;
  confidence: number;
  fieldName: string;
  highlightText?: string;
}

// ============================================================
// Cross-Document Comparison
// ============================================================
export interface EntityComparison {
  fieldName: string;
  documents: {
    documentType: string;
    documentName: string;
    value: string;
    sourcePage: number;
  }[];
  similarity: number;
  result: 'MATCH' | 'LIKELY_MATCH' | 'REVIEW_REQUIRED' | 'SIGNIFICANT_MISMATCH';
  note: string;
}

// ============================================================
// Compliance Score
// ============================================================
export interface ScoreBreakdown {
  category: string;
  earned: number;
  total: number;
  note: string;
}

export interface ComplianceScore {
  bidderId: string;
  total: number;
  maxTotal: number;
  riskLevel: RiskLevel;
  breakdown: ScoreBreakdown[];
  generatedAt: string;
  disclaimer: string;
}

// ============================================================
// Audit Log
// ============================================================
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  findingId?: string;
  findingCode?: string;
  decision?: string;
  details: string;
  tenderId?: string;
  bidderId?: string;
}

// ============================================================
// Verification Provider
// ============================================================
export interface VerificationProvider {
  id: string;
  name: string;
  description: string;
  providerName: string;
  status: VerificationProviderStatus;
  lastChecked: string;
  note: string;
  apiEndpoint?: string;
}

// ============================================================
// Dashboard Stats
// ============================================================
export interface DashboardStats {
  activeTenders: number;
  biddersUnderReview: number;
  documentsProcessed: number;
  issuesRequiringReview: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    reviewRequired: number;
  };
}
