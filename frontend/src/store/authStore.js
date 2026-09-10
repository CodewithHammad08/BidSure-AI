import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = 'http://localhost:5000/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Login with real email + password ──────────────────────────────────
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.error || 'Login failed.', pending: data.pending };
          }

          set({ user: data.user, token: data.token, isAuthenticated: true });
          return { success: true };
        } catch {
          return { success: false, error: 'Cannot reach the BidSure API server. Make sure the backend is running.' };
        }
      },

      // ── Signup (new user registration) ────────────────────────────────────
      signup: async ({ name, email, password, role, department, requestNote, companyName, gstin, udyamNo, cin }) => {
        try {
          const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, department, requestNote, companyName, gstin, udyamNo, cin }),
          });
          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.error || 'Signup failed.' };
          }

          // If immediately activated (Compliance Auditor or Bidder), log them in
          if (data.token) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { success: true, autoLogin: true };
          }

          // Procurement Officer → pending approval
          return { success: true, pending: true, message: data.message };
        } catch {
          return { success: false, error: 'Cannot reach the BidSure API server. Make sure the backend is running.' };
        }
      },

      // ── Logout ────────────────────────────────────────────────────────────
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // ── Helper: get auth header ───────────────────────────────────────────
      authHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // ── Admin: fetch all pending officer requests ─────────────────────────
      getOfficerRequests: async () => {
        const { token } = get();
        try {
          const res = await fetch(`${API_BASE}/auth/officer-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return [];
          return await res.json();
        } catch {
          return [];
        }
      },

      // ── Admin: fetch all users ────────────────────────────────────────────
      getAllUsers: async () => {
        const { token } = get();
        try {
          const res = await fetch(`${API_BASE}/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) return [];
          return await res.json();
        } catch {
          return [];
        }
      },

      // ── Admin: approve officer ────────────────────────────────────────────
      approveOfficer: async (userId) => {
        const { token } = get();
        const res = await fetch(`${API_BASE}/auth/officer-requests/${userId}/approve`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

      // ── Admin: reject officer ─────────────────────────────────────────────
      rejectOfficer: async (userId) => {
        const { token } = get();
        const res = await fetch(`${API_BASE}/auth/officer-requests/${userId}/reject`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.json();
      },

      // ── Admin: manually add officer ───────────────────────────────────────
      addOfficer: async ({ name, email, password, department }) => {
        const { token } = get();
        const res = await fetch(`${API_BASE}/auth/admin/add-officer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password, department }),
        });
        return res.json();
      },
    }),
    {
      name: 'bidsure-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
