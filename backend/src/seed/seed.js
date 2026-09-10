import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Tender from '../models/Tender.js';
import Bidder from '../models/Bidder.js';
import Finding from '../models/Finding.js';
import AuditLog from '../models/AuditLog.js';
import AdapterStatus from '../models/AdapterStatus.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bidsure_ai';

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }
    console.log('[Seed]: Populating BidSure-AI SIH Procurement Database (JavaScript)...');

    await Promise.all([
      User.deleteMany({}),
      Tender.deleteMany({}),
      Bidder.deleteMany({}),
      Finding.deleteMany({}),
      AuditLog.deleteMany({}),
      AdapterStatus.deleteMany({})
    ]);

    const adminHash    = await bcrypt.hash('Admin@2026',   12);
    const officerHash  = await bcrypt.hash('Officer@2026', 12);
    const auditorHash  = await bcrypt.hash('Auditor@2026', 12);
    const bidderHash   = await bcrypt.hash('Bidder@2026',  12);

    const users = await User.insertMany([
      {
        id: 'user-000',
        name: 'System Admin',
        role: 'Admin',
        department: 'BidSure AI Platform Administration',
        avatarInitials: 'SA',
        email: 'admin@gem.gov.in',
        passwordHash: adminHash,
        status: 'ACTIVE',
      },
      {
        id: 'user-001',
        name: 'Priya Nair',
        role: 'Procurement Officer',
        department: 'Directorate of Public Works & Automation',
        avatarInitials: 'PN',
        email: 'priya.nair@gem.gov.in',
        passwordHash: officerHash,
        status: 'ACTIVE',
      },
      {
        id: 'user-002',
        name: 'Rajesh Kumar',
        role: 'Compliance Auditor',
        department: 'National Audit & Oversight Cell',
        avatarInitials: 'RK',
        email: 'rajesh.kumar@audit.gov.in',
        passwordHash: auditorHash,
        status: 'ACTIVE',
      },
      {
        id: 'user-003',
        name: 'Vikram Mehta',
        role: 'Bidder',
        department: 'Apex Tech Solutions Pvt Ltd',
        avatarInitials: 'VM',
        email: 'bidder@apextech.in',
        passwordHash: bidderHash,
        status: 'ACTIVE',
        companyName: 'Apex Tech Solutions Pvt Ltd',
        gstin: '27AAACA0000A1Z5',
        udyamNo: 'UDYAM-MH-03-0012345',
        cin: 'U72900MH2018PTC312456',
      },
    ]);

    const tenders = await Tender.insertMany([
      {
        id: 'tender-001',
        title: 'Supply, Installation & Maintenance of Industrial Equipment and Automation Systems',
        referenceNumber: 'GEM/2026/B/7482910',
        department: 'Ministry of Heavy Industries & Public Enterprises',
        estimatedValue: '₹ 14,50,00,000',
        publishDate: '2026-08-15',
        submissionDeadline: '2026-09-10',
        status: 'ACTIVE',
        biddersCount: 3,
        requirements: [
          { id: 'req-001', code: 'REQ-001', title: 'GST Registration Certificate', category: 'LEGAL', description: 'Mandatory GSTIN verification with active status.', mandatory: true, pageRef: 12 },
          { id: 'req-002', code: 'REQ-002', title: 'MSME / Udyam Registration', category: 'LEGAL', description: 'Udyam certificate matching firm classification.', mandatory: true, pageRef: 14 },
          { id: 'req-003', code: 'REQ-003', title: 'OEM Authorization Letter', category: 'TECHNICAL', description: 'Manufacturer authorization for equipment items.', mandatory: true, pageRef: 15 },
          { id: 'req-004', code: 'REQ-004', title: 'Certificate Validity Verification', category: 'LEGAL', description: 'Certificates must be valid on bid deadline date.', mandatory: true, pageRef: 13 },
          { id: 'req-005', code: 'REQ-005', title: 'Authorized Signatory Declaration', category: 'DECLARATION', description: 'Board resolution or POA for signatory authorization.', mandatory: true, pageRef: 16 }
        ]
      },
      {
        id: 'tender-002',
        title: 'Procurement of High-Performance Computing Workstations & Server Infrastructure',
        referenceNumber: 'GEM/2026/B/8912341',
        department: 'Centre for Development of Advanced Computing (C-DAC)',
        estimatedValue: '₹ 8,20,00,000',
        publishDate: '2026-08-20',
        submissionDeadline: '2026-09-25',
        status: 'ACTIVE',
        biddersCount: 4,
        requirements: [
          { id: 'req-201', code: 'REQ-201', title: 'Valid GST Registration', category: 'LEGAL', description: 'Active GST registration in state of delivery.', mandatory: true, pageRef: 8 },
          { id: 'req-202', code: 'REQ-202', title: 'ISO 9001 Quality Certification', category: 'TECHNICAL', description: 'Valid ISO certification for manufacturing process.', mandatory: true, pageRef: 19 }
        ]
      }
    ]);

    const bidders = await Bidder.insertMany([
      {
        id: 'bidder-001',
        tenderId: 'tender-001',
        companyName: 'ABC Engineering Pvt Ltd',
        gstin: '07AAAAA0000A1Z5',
        udyamNo: 'UDYAM-DL-03-0012345',
        cin: 'U74999DL2018PTC334567',
        score: 95,
        riskLevel: 'LOW',
        submittedAt: '2026-09-02T14:30:00Z',
        documents: [
          { id: 'doc-001', name: 'GST_Registration_Certificate.pdf', type: 'GST Certificate', pageCount: 4, extractedFields: 12, confidenceScore: 99.2, sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
          { id: 'doc-002', name: 'MSME_Udyam_Registration.pdf', type: 'MSME Certificate', pageCount: 3, extractedFields: 8, confidenceScore: 98.5, sha256: '8f4e3c2b1a0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4' },
          { id: 'doc-003', name: 'OEM_Authorization_Letter.pdf', type: 'OEM Authorization', pageCount: 2, extractedFields: 6, confidenceScore: 97.8, sha256: '7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a' }
        ],
        crossDocVerification: [
          { doc1: 'GST Certificate', doc2: 'MSME Udyam', field: 'Company Name', val1: 'ABC Engineering Pvt Ltd', val2: 'ABC Engineering Pvt Ltd', similarityPercentage: 100, flagged: false },
          { doc1: 'GST Certificate', doc2: 'Signatory Declaration', field: 'Authorized Signatory', val1: 'Vikram Seth', val2: 'Vikram Seth', similarityPercentage: 100, flagged: false }
        ],
        categoryScores: { mandatoryDocs: 25, validity: 20, entityConsistency: 25, technicalRequirements: 15, verificationChecks: 10 }
      },
      {
        id: 'bidder-002',
        tenderId: 'tender-001',
        companyName: 'Bharat Industrial Systems Pvt Ltd',
        gstin: '27AABCB1234C1Z9',
        udyamNo: 'UDYAM-MH-12-0098765',
        cin: 'U29100MH2015PTC267890',
        score: 72,
        riskLevel: 'MEDIUM',
        submittedAt: '2026-09-04T10:15:00Z',
        documents: [
          { id: 'doc-101', name: 'GST_Certificate_2026.pdf', type: 'GST Certificate', pageCount: 5, extractedFields: 14, confidenceScore: 94.1, sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2' },
          { id: 'doc-102', name: 'Udyam_MSME_Registration_MH.pdf', type: 'MSME Certificate', pageCount: 3, extractedFields: 9, confidenceScore: 89.4, sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8' }
        ],
        crossDocVerification: [
          { doc1: 'GST Certificate', doc2: 'MSME Udyam', field: 'Legal Entity Name', val1: 'Bharat Industrial Systems Pvt Ltd', val2: 'Bharat Industries Systems Private Limited', similarityPercentage: 71, flagged: true },
          { doc1: 'GST Certificate', doc2: 'OEM Letter', field: 'Authorized Signatory', val1: 'Rajesh Shah', val2: 'R. K. Shah', similarityPercentage: 82, flagged: true }
        ],
        categoryScores: { mandatoryDocs: 25, validity: 20, entityConsistency: 12, technicalRequirements: 10, verificationChecks: 5 }
      },
      {
        id: 'bidder-003',
        tenderId: 'tender-001',
        companyName: 'XYZ Industries Pvt Ltd',
        gstin: '09AAACX9999X1Z2',
        udyamNo: 'UDYAM-UP-08-0054321',
        cin: 'U31900UP2020PTC123987',
        score: 48,
        riskLevel: 'HIGH',
        submittedAt: '2026-09-05T17:45:00Z',
        documents: [
          { id: 'doc-201', name: 'GST_Registration.pdf', type: 'GST Certificate', pageCount: 2, extractedFields: 7, confidenceScore: 82.0, sha256: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4' }
        ],
        crossDocVerification: [
          { doc1: 'GST Certificate', doc2: 'Udyam Certificate', field: 'Entity Name', val1: 'XYZ Industries Pvt Ltd', val2: 'XYZ Heavy Equipments', similarityPercentage: 54, flagged: true }
        ],
        categoryScores: { mandatoryDocs: 15, validity: 0, entityConsistency: 8, technicalRequirements: 15, verificationChecks: 10 }
      }
    ]);

    const findings = await Finding.insertMany([
      {
        id: 'finding-001',
        tenderId: 'tender-001',
        bidderId: 'bidder-002',
        bidderName: 'Bharat Industrial Systems Pvt Ltd',
        ruleId: 'REQ-002',
        requirementTitle: 'MSME / Udyam Entity Consistency Check',
        category: 'MISMATCH',
        severity: 'WARNING',
        status: 'OPEN',
        title: 'Entity Name Variation Between GST and Udyam Certificate',
        description: 'RapidFuzz cross-document similarity score returned 71% match. GST Certificate lists "Bharat Industrial Systems Pvt Ltd" while Udyam Certificate lists "Bharat Industries Systems Private Limited".',
        aiRecommendation: 'Officer review required: Check MCA21 CIN registry to verify if "Bharat Industries Systems Private Limited" is a former registered name or trade alias.',
        evidenceQuote: 'Udyam Registration Certificate: Legal Name of Enterprise - Bharat Industries Systems Private Limited [Page 14, Sec 3.2]',
        documentName: 'Udyam_MSME_Registration_MH.pdf',
        pageNumber: 14,
        boundingBox: { x: 120, y: 340, width: 450, height: 60 }
      },
      {
        id: 'finding-002',
        tenderId: 'tender-001',
        bidderId: 'bidder-003',
        bidderName: 'XYZ Industries Pvt Ltd',
        ruleId: 'REQ-004',
        requirementTitle: 'Certificate Expiry Verification',
        category: 'EXPIRY',
        severity: 'CRITICAL',
        status: 'OPEN',
        title: 'Expired OEM Authorization Certificate Prior to Bid Submission',
        description: 'The OEM Authorization Letter submitted by XYZ Industries Pvt Ltd expired on 2026-07-31, prior to the bid submission deadline of 2026-09-10.',
        aiRecommendation: 'Verify whether bidder provided a valid renewal extension letter or request clarification before final scoring.',
        evidenceQuote: 'Validity Period: Valid until 31st July 2026 only. [Page 13, Para 2]',
        documentName: 'OEM_Auth_Letter_Expired.pdf',
        pageNumber: 13,
        boundingBox: { x: 100, y: 280, width: 480, height: 75 }
      },
      {
        id: 'finding-003',
        tenderId: 'tender-001',
        bidderId: 'bidder-003',
        bidderName: 'XYZ Industries Pvt Ltd',
        ruleId: 'REQ-005',
        requirementTitle: 'Mandatory Signatory Declaration',
        category: 'DECLARATION',
        severity: 'CRITICAL',
        status: 'OPEN',
        title: 'Missing Board Resolution for Authorized Signatory',
        description: 'No authorized signatory declaration or power of attorney document was detected in the submitted bid package.',
        aiRecommendation: 'Flag for Procurement Officer review. Missing mandatory statutory declaration.',
        evidenceQuote: 'Mandatory Annexure V: Authorized Signatory Declaration — NOT FOUND',
        documentName: 'Bid_Package_XYZ.pdf',
        pageNumber: 1,
        boundingBox: { x: 50, y: 50, width: 500, height: 100 }
      }
    ]);

    const auditLogs = await AuditLog.insertMany([
      {
        id: 'audit-001',
        timestamp: '2026-09-09T18:00:00Z',
        userId: 'user-001',
        userName: 'Priya Nair',
        userRole: 'Procurement Officer',
        actionType: 'TENDER_INGESTION',
        entityType: 'TENDER',
        entityId: 'tender-001',
        detail: 'Tender TENDER-2026-001 requirement extraction completed successfully (5 rules extracted).'
      },
      {
        id: 'audit-002',
        timestamp: '2026-09-09T18:15:00Z',
        userId: 'user-001',
        userName: 'Priya Nair',
        userRole: 'Procurement Officer',
        actionType: 'COMPLIANCE_EVALUATION',
        entityType: 'BIDDER',
        entityId: 'bidder-002',
        detail: 'RapidFuzz entity check generated 1 review finding (71% name match flag).'
      }
    ]);

    const adapters = await AdapterStatus.insertMany([
      { id: 'adapt-001', name: 'GSTN Gateway Adapter', service: 'GST Portal Verification API', endpoint: 'https://api.gst.gov.in/v1.2/verify', status: 'HEALTHY', latencyMs: 142, lastChecked: '2026-09-10T00:10:00Z', checkCount: 1420 },
      { id: 'adapt-002', name: 'Udyam Verification Adapter', service: 'MSME Ministry Portal', endpoint: 'https://udyamregistration.gov.in/api/verify', status: 'HEALTHY', latencyMs: 210, lastChecked: '2026-09-10T00:10:00Z', checkCount: 980 },
      { id: 'adapt-003', name: 'MCA21 Corporate Registry', service: 'Ministry of Corporate Affairs', endpoint: 'https://mca.gov.in/mcafast/cinVerify', status: 'HEALTHY', latencyMs: 185, lastChecked: '2026-09-10T00:10:00Z', checkCount: 1120 },
      { id: 'adapt-004', name: 'ITD PAN Verification Adapter', service: 'Income Tax Department API', endpoint: 'https://incometax.gov.in/pan/v2/check', status: 'MOCK_ACTIVE', latencyMs: 95, lastChecked: '2026-09-10T00:10:00Z', checkCount: 310 }
    ]);

    console.log(`[Seed]: Populated ${users.length} Users, ${tenders.length} Tenders, ${bidders.length} Bidders, ${findings.length} Findings.`);
    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

if (process.argv[1]?.includes('seed')) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
