import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import LoginPage from './pages/Login.jsx';
import AdminPage from './pages/Admin.jsx';
import BidderPortal from './pages/BidderPortal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { TendersPage, TenderDetailPage, RequirementsPage } from './pages/Tenders.jsx';
import { BiddersPage, BidderDetailPage, DocumentDetailPage, AllDocumentsPage } from './pages/Bidders.jsx';
import {
  ComplianceMatrixPage, CrossDocVerificationPage,
  ComplianceScorePage, AllCompliancePage
} from './pages/Compliance.jsx';
import { FindingsPage, EvidenceViewerPage } from './pages/Findings.jsx';
import {
  AuditTrailPage, VerificationGatewayPage,
  SettingsPage, BidderComparisonPage
} from './pages/Misc.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'Admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/portal" element={<ProtectedRoute><BidderPortal /></ProtectedRoute>} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Tenders */}
        <Route path="/tenders" element={<ProtectedRoute><TendersPage /></ProtectedRoute>} />
        <Route path="/tenders/new" element={<ProtectedRoute><TendersPage /></ProtectedRoute>} />
        <Route path="/tenders/:id" element={<ProtectedRoute><TenderDetailPage /></ProtectedRoute>} />
        <Route path="/tenders/:id/requirements" element={<ProtectedRoute><RequirementsPage /></ProtectedRoute>} />
        <Route path="/tenders/:tenderId/bidders" element={<ProtectedRoute><BiddersPage /></ProtectedRoute>} />
        <Route path="/tenders/:tenderId/compare" element={<ProtectedRoute><BidderComparisonPage /></ProtectedRoute>} />

        {/* Bidders */}
        <Route path="/bidders" element={<ProtectedRoute><BiddersPage /></ProtectedRoute>} />
        <Route path="/bidders/:id" element={<ProtectedRoute><BidderDetailPage /></ProtectedRoute>} />
        <Route path="/bidders/:id/compliance" element={<ProtectedRoute><ComplianceMatrixPage /></ProtectedRoute>} />
        <Route path="/bidders/:id/verification" element={<ProtectedRoute><CrossDocVerificationPage /></ProtectedRoute>} />
        <Route path="/bidders/:id/score" element={<ProtectedRoute><ComplianceScorePage /></ProtectedRoute>} />

        {/* Documents */}
        <Route path="/documents" element={<ProtectedRoute><AllDocumentsPage /></ProtectedRoute>} />
        <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetailPage /></ProtectedRoute>} />

        {/* Compliance overview */}
        <Route path="/compliance" element={<ProtectedRoute><AllCompliancePage /></ProtectedRoute>} />

        {/* Findings */}
        <Route path="/findings" element={<ProtectedRoute><FindingsPage /></ProtectedRoute>} />
        <Route path="/findings/:id" element={<ProtectedRoute><EvidenceViewerPage /></ProtectedRoute>} />

        {/* System */}
        <Route path="/verification" element={<ProtectedRoute><VerificationGatewayPage /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditTrailPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
