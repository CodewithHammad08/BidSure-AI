import type {
  Tender, Requirement, Bidder, Document, ExtractedField,
  ComplianceCheck, Finding, EntityComparison,
  ComplianceScore, AuditLog, VerificationProvider, DashboardStats
} from '../types';

// ============================================================
// TENDER
// ============================================================
export const TENDERS: Tender[] = [
  {
    id: 'tender-001',
    referenceNumber: 'TENDER-2026-001',
    name: 'Supply of Industrial Equipment & Automation Systems',
    organization: 'Ministry of Heavy Industries, GoI',
    submissionDate: '2026-09-10',
    description: 'Procurement of industrial automation equipment for the National Manufacturing Hub initiative under Make in India. Bidders must comply with mandatory registration, certification, and OEM authorization requirements as specified in the tender document.',
    status: 'ACTIVE',
    bidderCount: 3,
    requirementCount: 5,
    lastAnalysis: '2026-09-09T00:05:00',
    complianceStatus: 'REVIEW_REQUIRED',
    createdAt: '2026-09-01T09:00:00',
  },
];

// ============================================================
// REQUIREMENTS
// ============================================================
export const REQUIREMENTS: Requirement[] = [
  {
    id: 'req-001',
    tenderId: 'tender-001',
    code: 'REQ-001',
    name: 'GST Registration Certificate',
    description: 'Bidder must submit a valid GST Registration Certificate (Form GST REG-06) issued by GSTN authorities. Certificate must be valid on the date of bid submission.',
    type: 'DOCUMENT_REQUIRED',
    mandatory: true,
    sourcePage: 12,
    confidence: 96,
    status: 'READY',
    rule: 'document_present AND not_expired(bid_date=2026-09-10)',
  },
  {
    id: 'req-002',
    tenderId: 'tender-001',
    code: 'REQ-002',
    name: 'MSME / Udyam Registration Certificate',
    description: 'MSME/Udyam Certificate as issued by the Udyam Registration Portal. Required for MSME preference provisions under the Public Procurement Policy.',
    type: 'DOCUMENT_REQUIRED',
    mandatory: true,
    sourcePage: 14,
    confidence: 94,
    status: 'READY',
    rule: 'document_present',
  },
  {
    id: 'req-003',
    tenderId: 'tender-001',
    code: 'REQ-003',
    name: 'OEM Authorization Letter',
    description: 'Original Equipment Manufacturer (OEM) Authorization Letter on OEM letterhead authorizing the bidder to supply the specified equipment. Must be signed by authorized OEM representative.',
    type: 'DOCUMENT_REQUIRED',
    mandatory: true,
    sourcePage: 15,
    confidence: 91,
    status: 'READY',
    rule: 'document_present AND entity_match(bidder_name, oem_authorized_entity)',
  },
  {
    id: 'req-004',
    tenderId: 'tender-001',
    code: 'REQ-004',
    name: 'Certificate Validity at Bid Submission Date',
    description: 'All mandatory certificates (GST, MSME) must be valid on the bid submission date of 10 September 2026. Expired certificates shall render the bid non-compliant.',
    type: 'DATE_VALIDITY',
    mandatory: true,
    sourcePage: 13,
    confidence: 98,
    status: 'READY',
    rule: 'all_certificates.expiry_date > 2026-09-10',
  },
  {
    id: 'req-005',
    tenderId: 'tender-001',
    code: 'REQ-005',
    name: 'Authorized Signatory Declaration',
    description: 'Duly signed declaration by the Authorized Signatory of the bidding entity on company letterhead with stamp/seal, confirming accuracy of submitted information.',
    type: 'DECLARATION',
    mandatory: true,
    sourcePage: 16,
    confidence: 89,
    status: 'READY',
    rule: 'document_present AND entity_match(declaration_entity, registered_entity)',
  },
];

// ============================================================
// BIDDERS
// ============================================================
export const BIDDERS: Bidder[] = [
  {
    id: 'bidder-a',
    tenderId: 'tender-001',
    name: 'ABC Engineering Pvt Ltd',
    registrationNumber: 'CIN: U28100MH2015PTC264781',
    contactEmail: 'bids@abcengineering.co.in',
    score: 95,
    riskLevel: 'LOW',
    status: 'ANALYSIS_COMPLETE',
    findingsCount: 1,
    criticalFindings: 0,
    addedAt: '2026-09-05T10:00:00',
  },
  {
    id: 'bidder-b',
    tenderId: 'tender-001',
    name: 'Bharat Industrial Systems Pvt Ltd',
    registrationNumber: 'CIN: U29100DL2012PTC238145',
    contactEmail: 'procurement@bharatindustrial.in',
    score: 72,
    riskLevel: 'MEDIUM',
    status: 'REVIEW_REQUIRED',
    findingsCount: 2,
    criticalFindings: 1,
    addedAt: '2026-09-05T11:30:00',
  },
  {
    id: 'bidder-c',
    tenderId: 'tender-001',
    name: 'XYZ Industries Pvt Ltd',
    registrationNumber: 'CIN: U27000GJ2010PTC059832',
    contactEmail: 'tender@xyzindustries.com',
    score: 48,
    riskLevel: 'HIGH',
    status: 'REVIEW_REQUIRED',
    findingsCount: 4,
    criticalFindings: 2,
    addedAt: '2026-09-05T14:00:00',
  },
];

// ============================================================
// DOCUMENTS
// ============================================================
export const DOCUMENTS: Document[] = [
  // Bidder A — all clean
  { id: 'doc-a-1', bidderId: 'bidder-a', fileName: 'GST_Certificate_ABC.pdf', documentType: 'GST Certificate', status: 'PROCESSED', pageCount: 2, extractionStatus: 'COMPLETE', confidence: 98, fileSize: '284 KB', sha256: 'e3b0c44298fc1c149afb4c8996fb924...', uploadedAt: '2026-09-06T09:10:00', processedAt: '2026-09-06T09:12:30' },
  { id: 'doc-a-2', bidderId: 'bidder-a', fileName: 'Udyam_Certificate_ABC.pdf', documentType: 'MSME / Udyam Certificate', status: 'PROCESSED', pageCount: 1, extractionStatus: 'COMPLETE', confidence: 97, fileSize: '156 KB', sha256: 'a8098c1a7a8b4c15d3cfe8e1b6f7e...', uploadedAt: '2026-09-06T09:11:00', processedAt: '2026-09-06T09:13:10' },
  { id: 'doc-a-3', bidderId: 'bidder-a', fileName: 'OEM_Auth_ABC.pdf', documentType: 'OEM Authorization Letter', status: 'PROCESSED', pageCount: 3, extractionStatus: 'COMPLETE', confidence: 95, fileSize: '412 KB', sha256: 'c0535e4be2b79ffd93291305436bf...', uploadedAt: '2026-09-06T09:12:00', processedAt: '2026-09-06T09:14:45' },
  { id: 'doc-a-4', bidderId: 'bidder-a', fileName: 'Declaration_ABC.pdf', documentType: 'Authorized Signatory Declaration', status: 'NEEDS_REVIEW', pageCount: 1, extractionStatus: 'PARTIAL', confidence: 88, fileSize: '98 KB', sha256: 'd41d8cd98f00b204e9800998ecf84...', uploadedAt: '2026-09-06T09:13:00', processedAt: '2026-09-06T09:15:20' },

  // Bidder B — GST entity mismatch
  { id: 'doc-b-1', bidderId: 'bidder-b', fileName: 'GST_Bharat_Industrial.pdf', documentType: 'GST Certificate', status: 'PROCESSED', pageCount: 2, extractionStatus: 'COMPLETE', confidence: 97, fileSize: '301 KB', sha256: 'f7bc83f430538424b13298e6aa6fb1...', uploadedAt: '2026-09-06T10:20:00', processedAt: '2026-09-06T10:22:15' },
  { id: 'doc-b-2', bidderId: 'bidder-b', fileName: 'MSME_Bharat_Systems.pdf', documentType: 'MSME / Udyam Certificate', status: 'PROCESSED', pageCount: 1, extractionStatus: 'COMPLETE', confidence: 96, fileSize: '178 KB', sha256: '9e107d9d372bb6826bd81d3542a41...', uploadedAt: '2026-09-06T10:21:00', processedAt: '2026-09-06T10:23:00' },
  { id: 'doc-b-3', bidderId: 'bidder-b', fileName: 'OEM_Authorization_Bharat.pdf', documentType: 'OEM Authorization Letter', status: 'PROCESSED', pageCount: 2, extractionStatus: 'COMPLETE', confidence: 93, fileSize: '389 KB', sha256: '84b8c5b0f24a72a3b6d0b9e5f2c1d...', uploadedAt: '2026-09-06T10:22:00', processedAt: '2026-09-06T10:24:30' },
  { id: 'doc-b-4', bidderId: 'bidder-b', fileName: 'Declaration_Bharat.pdf', documentType: 'Authorized Signatory Declaration', status: 'PROCESSED', pageCount: 1, extractionStatus: 'COMPLETE', confidence: 94, fileSize: '112 KB', sha256: '2b7e151628aed2a6abf7158809cf4...', uploadedAt: '2026-09-06T10:23:00', processedAt: '2026-09-06T10:25:00' },

  // Bidder C — missing OEM, expired GST
  { id: 'doc-c-1', bidderId: 'bidder-c', fileName: 'GST_XYZ_Industries.pdf', documentType: 'GST Certificate', status: 'PROCESSED', pageCount: 2, extractionStatus: 'COMPLETE', confidence: 96, fileSize: '267 KB', sha256: '3c59dc048e8850243be8079a5c74d...', uploadedAt: '2026-09-06T11:05:00', processedAt: '2026-09-06T11:07:20' },
  { id: 'doc-c-2', bidderId: 'bidder-c', fileName: 'Udyam_XYZ.pdf', documentType: 'MSME / Udyam Certificate', status: 'PROCESSED', pageCount: 1, extractionStatus: 'COMPLETE', confidence: 95, fileSize: '145 KB', sha256: '6b86b273ff34fce19d6b804eff5a3...', uploadedAt: '2026-09-06T11:06:00', processedAt: '2026-09-06T11:08:00' },
  // OEM Missing for Bidder C
  { id: 'doc-c-4', bidderId: 'bidder-c', fileName: 'Declaration_XYZ_Industrial.pdf', documentType: 'Authorized Signatory Declaration', status: 'PROCESSED', pageCount: 1, extractionStatus: 'COMPLETE', confidence: 92, fileSize: '107 KB', sha256: 'd8e8fca2dc0f896fd7cb4cb0031ba...', uploadedAt: '2026-09-06T11:07:00', processedAt: '2026-09-06T11:09:00' },
];

// ============================================================
// EXTRACTED FIELDS
// ============================================================
export const EXTRACTED_FIELDS: ExtractedField[] = [
  // Bidder A — GST
  { id: 'ef-a1-1', documentId: 'doc-a-1', fieldName: 'Company Name', value: 'ABC Engineering Pvt Ltd', confidence: 98, sourcePage: 1, needsReview: false },
  { id: 'ef-a1-2', documentId: 'doc-a-1', fieldName: 'GSTIN', value: '27AABCA1234F1Z5', confidence: 99, sourcePage: 1, needsReview: false },
  { id: 'ef-a1-3', documentId: 'doc-a-1', fieldName: 'Registration Date', value: '15 Mar 2016', confidence: 97, sourcePage: 1, needsReview: false },
  { id: 'ef-a1-4', documentId: 'doc-a-1', fieldName: 'Certificate Validity', value: '31 Dec 2027', confidence: 96, sourcePage: 2, needsReview: false },
  { id: 'ef-a1-5', documentId: 'doc-a-1', fieldName: 'Business Address', value: 'Plot 45, MIDC Industrial Area, Pune – 411019', confidence: 94, sourcePage: 1, needsReview: false },

  // Bidder A — MSME
  { id: 'ef-a2-1', documentId: 'doc-a-2', fieldName: 'Enterprise Name', value: 'ABC Engineering Pvt Ltd', confidence: 97, sourcePage: 1, needsReview: false },
  { id: 'ef-a2-2', documentId: 'doc-a-2', fieldName: 'Udyam Registration Number', value: 'UDYAM-MH-12-0046781', confidence: 99, sourcePage: 1, needsReview: false },
  { id: 'ef-a2-3', documentId: 'doc-a-2', fieldName: 'Date of Registration', value: '20 Jul 2021', confidence: 98, sourcePage: 1, needsReview: false },

  // Bidder A — OEM
  { id: 'ef-a3-1', documentId: 'doc-a-3', fieldName: 'Authorized Entity', value: 'ABC Engineering Pvt Ltd', confidence: 95, sourcePage: 1, needsReview: false },
  { id: 'ef-a3-2', documentId: 'doc-a-3', fieldName: 'OEM Name', value: 'Siemens AG', confidence: 97, sourcePage: 1, needsReview: false },
  { id: 'ef-a3-3', documentId: 'doc-a-3', fieldName: 'Authorization Valid Until', value: '30 Jun 2027', confidence: 94, sourcePage: 2, needsReview: false },

  // Bidder B — GST (entity name will mismatch MSME)
  { id: 'ef-b1-1', documentId: 'doc-b-1', fieldName: 'Company Name', value: 'Bharat Industrial Systems Pvt Ltd', confidence: 97, sourcePage: 1, needsReview: false },
  { id: 'ef-b1-2', documentId: 'doc-b-1', fieldName: 'GSTIN', value: '07AABCB5678G1Z3', confidence: 99, sourcePage: 1, needsReview: false },
  { id: 'ef-b1-3', documentId: 'doc-b-1', fieldName: 'Certificate Validity', value: '31 Dec 2027', confidence: 96, sourcePage: 2, needsReview: false },
  { id: 'ef-b1-4', documentId: 'doc-b-1', fieldName: 'Business Address', value: '14-B, Okhla Industrial Phase II, New Delhi – 110020', confidence: 94, sourcePage: 1, needsReview: false },

  // Bidder B — MSME (DIFFERENT entity name — key mismatch)
  { id: 'ef-b2-1', documentId: 'doc-b-2', fieldName: 'Enterprise Name', value: 'Bharat Industries Systems Private Limited', confidence: 96, sourcePage: 1, needsReview: false },
  { id: 'ef-b2-2', documentId: 'doc-b-2', fieldName: 'Udyam Registration Number', value: 'UDYAM-DL-07-0023541', confidence: 98, sourcePage: 1, needsReview: false },
  { id: 'ef-b2-3', documentId: 'doc-b-2', fieldName: 'Date of Registration', value: '12 Sep 2021', confidence: 97, sourcePage: 1, needsReview: false },

  // Bidder C — GST (EXPIRED)
  { id: 'ef-c1-1', documentId: 'doc-c-1', fieldName: 'Company Name', value: 'XYZ Industries Pvt Ltd', confidence: 96, sourcePage: 1, needsReview: false },
  { id: 'ef-c1-2', documentId: 'doc-c-1', fieldName: 'GSTIN', value: '24AABCX9012H1Z8', confidence: 98, sourcePage: 1, needsReview: false },
  { id: 'ef-c1-3', documentId: 'doc-c-1', fieldName: 'Certificate Validity', value: '01 Jun 2025', confidence: 97, sourcePage: 2, needsReview: true },

  // Bidder C — Declaration (entity mismatch)
  { id: 'ef-c4-1', documentId: 'doc-c-4', fieldName: 'Signatory Entity', value: 'XYZ Industrial Pvt Ltd', confidence: 92, sourcePage: 1, needsReview: true },
  { id: 'ef-c4-2', documentId: 'doc-c-4', fieldName: 'Signatory Name', value: 'Rajesh Mehta', confidence: 95, sourcePage: 1, needsReview: false },
];

// ============================================================
// COMPLIANCE CHECKS
// ============================================================
export const COMPLIANCE_CHECKS: Record<string, ComplianceCheck[]> = {
  'bidder-a': [
    { id: 'cc-a1', bidderId: 'bidder-a', requirementId: 'req-001', requirement: REQUIREMENTS[0], documentId: 'doc-a-1', documentName: 'GST_Certificate_ABC.pdf', extractedData: 'GSTIN: 27AABCA1234F1Z5 | Valid: 31 Dec 2027', validation: 'Valid certificate (expiry 31 Dec 2027 > bid date 10 Sep 2026)', status: 'PASS', confidence: 98 },
    { id: 'cc-a2', bidderId: 'bidder-a', requirementId: 'req-002', requirement: REQUIREMENTS[1], documentId: 'doc-a-2', documentName: 'Udyam_Certificate_ABC.pdf', extractedData: 'UDYAM-MH-12-0046781 | ABC Engineering Pvt Ltd', validation: 'Document present, entity consistent', status: 'PASS', confidence: 97 },
    { id: 'cc-a3', bidderId: 'bidder-a', requirementId: 'req-003', requirement: REQUIREMENTS[2], documentId: 'doc-a-3', documentName: 'OEM_Auth_ABC.pdf', extractedData: 'Authorized: ABC Engineering Pvt Ltd | OEM: Siemens AG', validation: 'OEM authorization present, entity match confirmed', status: 'PASS', confidence: 95 },
    { id: 'cc-a4', bidderId: 'bidder-a', requirementId: 'req-004', requirement: REQUIREMENTS[3], documentId: 'doc-a-1', documentName: 'GST_Certificate_ABC.pdf', extractedData: 'GST Expiry: 31 Dec 2027 | Bid Date: 10 Sep 2026', validation: 'All certificates valid on bid date', status: 'PASS', confidence: 96 },
    { id: 'cc-a5', bidderId: 'bidder-a', requirementId: 'req-005', requirement: REQUIREMENTS[4], documentId: 'doc-a-4', documentName: 'Declaration_ABC.pdf', extractedData: 'Signatory: ABC Engineering Pvt Ltd', validation: 'Declaration present — extraction confidence 88%, manual review recommended', status: 'REVIEW_REQUIRED', confidence: 88 },
  ],
  'bidder-b': [
    { id: 'cc-b1', bidderId: 'bidder-b', requirementId: 'req-001', requirement: REQUIREMENTS[0], documentId: 'doc-b-1', documentName: 'GST_Bharat_Industrial.pdf', extractedData: 'GSTIN: 07AABCB5678G1Z3 | Valid: 31 Dec 2027', validation: 'Valid certificate present', status: 'PASS', confidence: 97 },
    { id: 'cc-b2', bidderId: 'bidder-b', requirementId: 'req-002', requirement: REQUIREMENTS[1], documentId: 'doc-b-2', documentName: 'MSME_Bharat_Systems.pdf', extractedData: 'UDYAM-DL-07-0023541 | Bharat Industries Systems Private Limited', validation: 'Document present', status: 'PASS', confidence: 96 },
    { id: 'cc-b3', bidderId: 'bidder-b', requirementId: 'req-003', requirement: REQUIREMENTS[2], documentId: 'doc-b-3', documentName: 'OEM_Authorization_Bharat.pdf', extractedData: 'Authorized: Bharat Industrial Systems Pvt Ltd', validation: 'OEM authorization present', status: 'PASS', confidence: 93 },
    { id: 'cc-b4', bidderId: 'bidder-b', requirementId: 'req-004', requirement: REQUIREMENTS[3], documentId: 'doc-b-1', documentName: 'GST_Bharat_Industrial.pdf', extractedData: 'GST Expiry: 31 Dec 2027 | Bid Date: 10 Sep 2026', validation: 'All certificates valid on bid date', status: 'PASS', confidence: 96 },
    { id: 'cc-b5', bidderId: 'bidder-b', requirementId: 'req-005', requirement: REQUIREMENTS[4], documentId: undefined, documentName: undefined, extractedData: 'GST: "Bharat Industrial Systems Pvt Ltd" | MSME: "Bharat Industries Systems Private Limited" | Similarity: 71%', validation: 'Entity name variation detected across GST and MSME certificates', status: 'MISMATCH', confidence: 71, notes: 'Cross-document entity consistency check flagged a name variation. Similarity score: 71%. Review required to confirm same legal entity.' },
  ],
  'bidder-c': [
    { id: 'cc-c1', bidderId: 'bidder-c', requirementId: 'req-001', requirement: REQUIREMENTS[0], documentId: 'doc-c-1', documentName: 'GST_XYZ_Industries.pdf', extractedData: 'GSTIN: 24AABCX9012H1Z8 | Expiry: 01 Jun 2025', validation: 'Certificate EXPIRED — Expiry 01 Jun 2025 < Bid date 10 Sep 2026', status: 'EXPIRED', confidence: 97 },
    { id: 'cc-c2', bidderId: 'bidder-c', requirementId: 'req-002', requirement: REQUIREMENTS[1], documentId: 'doc-c-2', documentName: 'Udyam_XYZ.pdf', extractedData: 'UDYAM-GJ-24-0018294 | XYZ Industries Pvt Ltd', validation: 'Document present', status: 'PASS', confidence: 95 },
    { id: 'cc-c3', bidderId: 'bidder-c', requirementId: 'req-003', requirement: REQUIREMENTS[2], documentId: undefined, documentName: undefined, extractedData: 'No document found', validation: 'Required document not submitted', status: 'MISSING', confidence: 0, notes: 'OEM Authorization Letter not found in submitted documents.' },
    { id: 'cc-c4', bidderId: 'bidder-c', requirementId: 'req-004', requirement: REQUIREMENTS[3], documentId: 'doc-c-1', documentName: 'GST_XYZ_Industries.pdf', extractedData: 'GST Expiry: 01 Jun 2025 | Bid Date: 10 Sep 2026', validation: 'Certificate validity check FAILED — GST expired before bid date', status: 'EXPIRED', confidence: 97 },
    { id: 'cc-c5', bidderId: 'bidder-c', requirementId: 'req-005', requirement: REQUIREMENTS[4], documentId: 'doc-c-4', documentName: 'Declaration_XYZ_Industrial.pdf', extractedData: 'GST: "XYZ Industries Pvt Ltd" | Declaration: "XYZ Industrial Pvt Ltd" | Similarity: 41%', validation: 'Significant entity mismatch between GST certificate and signatory declaration', status: 'MISMATCH', confidence: 41, notes: 'Significant entity name discrepancy. GST registration name does not match declaration signatory entity.' },
  ],
};

// ============================================================
// FINDINGS
// ============================================================
export const FINDINGS: Finding[] = [
  // Bidder A
  {
    id: 'fnd-1040',
    code: 'FND-1040',
    bidderId: 'bidder-a',
    bidderName: 'ABC Engineering Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'LOW_CONFIDENCE',
    severity: 'LOW',
    requirementId: 'req-005',
    requirementName: 'Authorized Signatory Declaration',
    status: 'REVIEWED',
    decision: 'DISMISS',
    detectedAt: '2026-09-09T00:05:12',
    description: 'Declaration PDF extraction confidence is 88%, below the 90% threshold. Manual review of declaration document recommended.',
    reviewedAt: '2026-09-09T00:06:00',
    reviewNote: 'Document is legible. Accepted with manual verification.',
    evidence: [
      { id: 'ev-1040-1', findingId: 'fnd-1040', documentId: 'doc-a-4', documentName: 'Declaration_ABC.pdf', documentType: 'Authorized Signatory Declaration', sourcePage: 1, extractedValue: 'ABC Engineering Pvt Ltd', confidence: 88, fieldName: 'Signatory Entity', highlightText: 'ABC Engineering Pvt Ltd' },
    ],
  },

  // Bidder B — KEY DEMO FINDING
  {
    id: 'fnd-1042',
    code: 'FND-1042',
    bidderId: 'bidder-b',
    bidderName: 'Bharat Industrial Systems Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'ENTITY_INCONSISTENCY',
    severity: 'HIGH',
    requirementId: 'req-005',
    requirementName: 'Entity Consistency Across Documents',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:18',
    description: 'Entity name variation detected between GST Certificate and MSME/Udyam Certificate. GST shows "Bharat Industrial Systems Pvt Ltd" while MSME shows "Bharat Industries Systems Private Limited". Cross-document similarity: 71%. Verification required to confirm these represent the same legal entity.',
    evidence: [
      { id: 'ev-1042-1', findingId: 'fnd-1042', documentId: 'doc-b-1', documentName: 'GST_Bharat_Industrial.pdf', documentType: 'GST Certificate', sourcePage: 1, extractedValue: 'Bharat Industrial Systems Pvt Ltd', confidence: 97, fieldName: 'Company Name', highlightText: 'Bharat Industrial Systems Pvt Ltd' },
      { id: 'ev-1042-2', findingId: 'fnd-1042', documentId: 'doc-b-2', documentName: 'MSME_Bharat_Systems.pdf', documentType: 'MSME / Udyam Certificate', sourcePage: 1, extractedValue: 'Bharat Industries Systems Private Limited', confidence: 96, fieldName: 'Enterprise Name', highlightText: 'Bharat Industries Systems Private Limited' },
    ],
  },
  {
    id: 'fnd-1043',
    code: 'FND-1043',
    bidderId: 'bidder-b',
    bidderName: 'Bharat Industrial Systems Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'LOW_CONFIDENCE',
    severity: 'MEDIUM',
    requirementId: 'req-003',
    requirementName: 'OEM Authorization Letter',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:22',
    description: 'OEM Authorization entity name extracted at 93% confidence. Minor variation in formatting. System recommends manual verification of authorized entity name.',
    evidence: [
      { id: 'ev-1043-1', findingId: 'fnd-1043', documentId: 'doc-b-3', documentName: 'OEM_Authorization_Bharat.pdf', documentType: 'OEM Authorization Letter', sourcePage: 1, extractedValue: 'Bharat Industrial Systems Pvt Ltd', confidence: 93, fieldName: 'Authorized Entity', highlightText: 'Bharat Industrial Systems Pvt Ltd' },
    ],
  },

  // Bidder C
  {
    id: 'fnd-1044',
    code: 'FND-1044',
    bidderId: 'bidder-c',
    bidderName: 'XYZ Industries Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'EXPIRED_CERTIFICATE',
    severity: 'CRITICAL',
    requirementId: 'req-001',
    requirementName: 'GST Registration Certificate',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:30',
    description: 'GST Certificate has expired. Extracted expiry date: 01 Jun 2025. Bid submission date: 10 Sep 2026. Certificate was expired 466 days before bid submission.',
    evidence: [
      { id: 'ev-1044-1', findingId: 'fnd-1044', documentId: 'doc-c-1', documentName: 'GST_XYZ_Industries.pdf', documentType: 'GST Certificate', sourcePage: 2, extractedValue: '01 Jun 2025', confidence: 97, fieldName: 'Certificate Validity', highlightText: 'Valid upto: 01/06/2025' },
    ],
  },
  {
    id: 'fnd-1045',
    code: 'FND-1045',
    bidderId: 'bidder-c',
    bidderName: 'XYZ Industries Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'MISSING_DOCUMENT',
    severity: 'CRITICAL',
    requirementId: 'req-003',
    requirementName: 'OEM Authorization Letter',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:31',
    description: 'OEM Authorization Letter is a mandatory requirement (REQ-003, Page 15 of tender). No document matching this type was found in the submitted document set.',
    evidence: [],
  },
  {
    id: 'fnd-1046',
    code: 'FND-1046',
    bidderId: 'bidder-c',
    bidderName: 'XYZ Industries Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'ENTITY_INCONSISTENCY',
    severity: 'HIGH',
    requirementId: 'req-005',
    requirementName: 'Entity Consistency Across Documents',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:35',
    description: 'Significant entity name mismatch. GST Certificate entity "XYZ Industries Pvt Ltd" does not match Declaration signatory entity "XYZ Industrial Pvt Ltd". Similarity score: 41%.',
    evidence: [
      { id: 'ev-1046-1', findingId: 'fnd-1046', documentId: 'doc-c-1', documentName: 'GST_XYZ_Industries.pdf', documentType: 'GST Certificate', sourcePage: 1, extractedValue: 'XYZ Industries Pvt Ltd', confidence: 96, fieldName: 'Company Name', highlightText: 'XYZ Industries Pvt Ltd' },
      { id: 'ev-1046-2', findingId: 'fnd-1046', documentId: 'doc-c-4', documentName: 'Declaration_XYZ_Industrial.pdf', documentType: 'Authorized Signatory Declaration', sourcePage: 1, extractedValue: 'XYZ Industrial Pvt Ltd', confidence: 92, fieldName: 'Signatory Entity', highlightText: 'XYZ Industrial Pvt Ltd' },
    ],
  },
  {
    id: 'fnd-1047',
    code: 'FND-1047',
    bidderId: 'bidder-c',
    bidderName: 'XYZ Industries Pvt Ltd',
    tenderId: 'tender-001',
    tenderName: 'Supply of Industrial Equipment',
    type: 'EXPIRED_CERTIFICATE',
    severity: 'HIGH',
    requirementId: 'req-004',
    requirementName: 'Certificate Validity at Bid Submission Date',
    status: 'OPEN',
    decision: 'PENDING',
    detectedAt: '2026-09-09T00:05:36',
    description: 'GST Certificate validity check failed against bid submission date. Certificate expired 01 Jun 2025; bid date 10 Sep 2026.',
    evidence: [
      { id: 'ev-1047-1', findingId: 'fnd-1047', documentId: 'doc-c-1', documentName: 'GST_XYZ_Industries.pdf', documentType: 'GST Certificate', sourcePage: 2, extractedValue: '01 Jun 2025', confidence: 97, fieldName: 'Certificate Validity', highlightText: 'Valid upto: 01/06/2025' },
    ],
  },
];

// ============================================================
// CROSS-DOCUMENT COMPARISONS
// ============================================================
export const ENTITY_COMPARISONS: Record<string, EntityComparison[]> = {
  'bidder-a': [
    {
      fieldName: 'Company / Enterprise Name',
      documents: [
        { documentType: 'GST Certificate', documentName: 'GST_Certificate_ABC.pdf', value: 'ABC Engineering Pvt Ltd', sourcePage: 1 },
        { documentType: 'MSME / Udyam Certificate', documentName: 'Udyam_Certificate_ABC.pdf', value: 'ABC Engineering Pvt Ltd', sourcePage: 1 },
        { documentType: 'OEM Authorization Letter', documentName: 'OEM_Auth_ABC.pdf', value: 'ABC Engineering Pvt Ltd', sourcePage: 1 },
      ],
      similarity: 100,
      result: 'MATCH',
      note: 'Entity name is identical across all three documents.',
    },
    {
      fieldName: 'Business Address',
      documents: [
        { documentType: 'GST Certificate', documentName: 'GST_Certificate_ABC.pdf', value: 'Plot 45, MIDC Industrial Area, Pune – 411019', sourcePage: 1 },
        { documentType: 'OEM Authorization Letter', documentName: 'OEM_Auth_ABC.pdf', value: 'Plot 45, MIDC, Pune 411019', sourcePage: 1 },
      ],
      similarity: 94,
      result: 'LIKELY_MATCH',
      note: 'Minor formatting difference in address. Likely the same address.',
    },
  ],
  'bidder-b': [
    {
      fieldName: 'Company / Enterprise Name',
      documents: [
        { documentType: 'GST Certificate', documentName: 'GST_Bharat_Industrial.pdf', value: 'Bharat Industrial Systems Pvt Ltd', sourcePage: 1 },
        { documentType: 'MSME / Udyam Certificate', documentName: 'MSME_Bharat_Systems.pdf', value: 'Bharat Industries Systems Private Limited', sourcePage: 1 },
        { documentType: 'OEM Authorization Letter', documentName: 'OEM_Authorization_Bharat.pdf', value: 'Bharat Industrial Systems Pvt Ltd', sourcePage: 1 },
      ],
      similarity: 71,
      result: 'REVIEW_REQUIRED',
      note: 'GST and OEM documents show "Bharat Industrial Systems Pvt Ltd" but MSME shows "Bharat Industries Systems Private Limited". Possible clerical variation or different legal entity. Officer review required.',
    },
    {
      fieldName: 'Business Address',
      documents: [
        { documentType: 'GST Certificate', documentName: 'GST_Bharat_Industrial.pdf', value: '14-B, Okhla Industrial Phase II, New Delhi – 110020', sourcePage: 1 },
        { documentType: 'MSME / Udyam Certificate', documentName: 'MSME_Bharat_Systems.pdf', value: '14-B, Okhla Industrial Estate Phase-II, New Delhi – 110020', sourcePage: 1 },
      ],
      similarity: 91,
      result: 'LIKELY_MATCH',
      note: 'Address is consistent with minor formatting variation.',
    },
  ],
  'bidder-c': [
    {
      fieldName: 'Company / Enterprise Name',
      documents: [
        { documentType: 'GST Certificate', documentName: 'GST_XYZ_Industries.pdf', value: 'XYZ Industries Pvt Ltd', sourcePage: 1 },
        { documentType: 'MSME / Udyam Certificate', documentName: 'Udyam_XYZ.pdf', value: 'XYZ Industries Pvt Ltd', sourcePage: 1 },
        { documentType: 'Authorized Signatory Declaration', documentName: 'Declaration_XYZ_Industrial.pdf', value: 'XYZ Industrial Pvt Ltd', sourcePage: 1 },
      ],
      similarity: 41,
      result: 'SIGNIFICANT_MISMATCH',
      note: 'GST and MSME show "XYZ Industries Pvt Ltd" but Declaration shows "XYZ Industrial Pvt Ltd". These may represent different legal entities. Significant mismatch — officer investigation required.',
    },
  ],
};

// ============================================================
// COMPLIANCE SCORES
// ============================================================
export const COMPLIANCE_SCORES: Record<string, ComplianceScore> = {
  'bidder-a': {
    bidderId: 'bidder-a',
    total: 95,
    maxTotal: 100,
    riskLevel: 'LOW',
    breakdown: [
      { category: 'Mandatory Documents', earned: 25, total: 25, note: 'All 4 mandatory documents submitted' },
      { category: 'Certificate Validity', earned: 20, total: 20, note: 'All certificates valid on bid date' },
      { category: 'Entity Consistency', earned: 24, total: 25, note: 'Minor address formatting variation across documents' },
      { category: 'Tender Requirements', earned: 18, total: 20, note: 'Declaration extraction confidence below threshold' },
      { category: 'Verification Checks', earned: 8, total: 10, note: 'OEM authorization cross-reference complete' },
    ],
    generatedAt: '2026-09-09T00:05:15',
    disclaimer: 'This score is generated by BidSure AI prototype scoring rules for decision-support purposes only. It does not constitute an official qualification threshold or government procurement determination.',
  },
  'bidder-b': {
    bidderId: 'bidder-b',
    total: 72,
    maxTotal: 100,
    riskLevel: 'MEDIUM',
    breakdown: [
      { category: 'Mandatory Documents', earned: 25, total: 25, note: 'All 4 mandatory documents submitted' },
      { category: 'Certificate Validity', earned: 20, total: 20, note: 'All certificates valid on bid date' },
      { category: 'Entity Consistency', earned: 12, total: 25, note: 'Entity name variation between GST and MSME certificates (71% similarity)' },
      { category: 'Tender Requirements', earned: 10, total: 20, note: 'Entity inconsistency flags REQ-005 as non-compliant pending review' },
      { category: 'Verification Checks', earned: 5, total: 10, note: 'OEM authorization entity confirmation pending' },
    ],
    generatedAt: '2026-09-09T00:05:20',
    disclaimer: 'This score is generated by BidSure AI prototype scoring rules for decision-support purposes only. It does not constitute an official qualification threshold or government procurement determination.',
  },
  'bidder-c': {
    bidderId: 'bidder-c',
    total: 48,
    maxTotal: 100,
    riskLevel: 'HIGH',
    breakdown: [
      { category: 'Mandatory Documents', earned: 15, total: 25, note: 'OEM Authorization Letter missing (-10 pts mandatory document deduction)' },
      { category: 'Certificate Validity', earned: 0, total: 20, note: 'GST Certificate expired 01 Jun 2025 — 466 days before bid date' },
      { category: 'Entity Consistency', earned: 8, total: 25, note: 'Significant mismatch between GST and Declaration (41% similarity)' },
      { category: 'Tender Requirements', earned: 15, total: 20, note: 'MSME present but GST expiry and missing OEM impact requirement compliance' },
      { category: 'Verification Checks', earned: 10, total: 10, note: 'Available documents extractable' },
    ],
    generatedAt: '2026-09-09T00:05:40',
    disclaimer: 'This score is generated by BidSure AI prototype scoring rules for decision-support purposes only. It does not constitute an official qualification threshold or government procurement determination.',
  },
};

// ============================================================
// AUDIT LOG
// ============================================================
export const AUDIT_LOGS: AuditLog[] = [
  { id: 'al-001', timestamp: '2026-09-09T00:05:00', userId: 'user-001', userName: 'Priya Nair (PO-001)', action: 'Compliance Analysis Completed', entityType: 'TENDER', entityId: 'tender-001', entityName: 'TENDER-2026-001', details: 'Automated compliance analysis completed for all 3 bidders. 7 findings generated.', tenderId: 'tender-001' },
  { id: 'al-002', timestamp: '2026-09-09T00:05:12', userId: 'system', userName: 'BidSure AI Engine', action: 'Finding Generated', entityType: 'FINDING', entityId: 'fnd-1040', entityName: 'FND-1040', findingId: 'fnd-1040', findingCode: 'FND-1040', details: 'Low confidence finding detected: Declaration extraction 88% (Bidder A)', bidderId: 'bidder-a', tenderId: 'tender-001' },
  { id: 'al-003', timestamp: '2026-09-09T00:05:18', userId: 'system', userName: 'BidSure AI Engine', action: 'Finding Generated', entityType: 'FINDING', entityId: 'fnd-1042', entityName: 'FND-1042', findingId: 'fnd-1042', findingCode: 'FND-1042', details: 'Entity inconsistency detected: GST vs MSME similarity 71% (Bidder B)', bidderId: 'bidder-b', tenderId: 'tender-001' },
  { id: 'al-004', timestamp: '2026-09-09T00:05:30', userId: 'system', userName: 'BidSure AI Engine', action: 'Finding Generated', entityType: 'FINDING', entityId: 'fnd-1044', entityName: 'FND-1044', findingId: 'fnd-1044', findingCode: 'FND-1044', details: 'Expired certificate: GST expiry 01 Jun 2025 (Bidder C)', bidderId: 'bidder-c', tenderId: 'tender-001' },
  { id: 'al-005', timestamp: '2026-09-09T00:05:31', userId: 'system', userName: 'BidSure AI Engine', action: 'Finding Generated', entityType: 'FINDING', entityId: 'fnd-1045', entityName: 'FND-1045', findingId: 'fnd-1045', findingCode: 'FND-1045', details: 'Missing mandatory document: OEM Authorization Letter (Bidder C)', bidderId: 'bidder-c', tenderId: 'tender-001' },
  { id: 'al-006', timestamp: '2026-09-09T00:06:00', userId: 'user-001', userName: 'Priya Nair (PO-001)', action: 'Finding Dismissed', entityType: 'FINDING', entityId: 'fnd-1040', entityName: 'FND-1040', findingId: 'fnd-1040', findingCode: 'FND-1040', decision: 'DISMISS', details: 'Officer reviewed and dismissed low-confidence finding. Note: Document is legible, manual verification passed.', bidderId: 'bidder-a', tenderId: 'tender-001' },
];

// ============================================================
// VERIFICATION PROVIDERS
// ============================================================
export const VERIFICATION_PROVIDERS: VerificationProvider[] = [
  {
    id: 'vp-gst',
    name: 'GST Verification',
    description: 'GSTIN verification and certificate validity check',
    providerName: 'Demo GST Adapter',
    status: 'AVAILABLE',
    lastChecked: '2026-09-09T00:00:00',
    note: 'Prototype adapter — replace with authorized GSTN production integration.',
    apiEndpoint: '/api/verify/gst',
  },
  {
    id: 'vp-udyam',
    name: 'Udyam / MSME Verification',
    description: 'Udyam registration number and MSME classification verification',
    providerName: 'Demo Udyam Adapter',
    status: 'AVAILABLE',
    lastChecked: '2026-09-09T00:00:00',
    note: 'Prototype adapter — replace with authorized Udyam Portal production integration.',
    apiEndpoint: '/api/verify/udyam',
  },
  {
    id: 'vp-cin',
    name: 'MCA / CIN Verification',
    description: 'Company identification and incorporation verification',
    providerName: 'Architecture Ready',
    status: 'UNAVAILABLE',
    lastChecked: '2026-09-09T00:00:00',
    note: 'Integration adapter architecture designed. Requires MCA21 API access for production.',
  },
  {
    id: 'vp-pan',
    name: 'PAN Verification',
    description: 'PAN card authenticity and entity matching',
    providerName: 'Architecture Ready',
    status: 'UNAVAILABLE',
    lastChecked: '2026-09-09T00:00:00',
    note: 'Integration adapter architecture designed. Requires ITD API access for production.',
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================
export const DASHBOARD_STATS: DashboardStats = {
  activeTenders: 1,
  biddersUnderReview: 2,
  documentsProcessed: 11,
  issuesRequiringReview: 6,
  riskDistribution: {
    low: 1,
    medium: 1,
    high: 1,
    reviewRequired: 2,
  },
};
