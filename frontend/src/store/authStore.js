import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = 'http://localhost:5000/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // ── Login ─────────────────────────────────────────────────────────────
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
          });
          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.error || 'Login failed.', pending: data.pending };
          }

          set({ user: data.user, token: data.token, isAuthenticated: true });
          return { success: true, user: data.user };
        } catch {
          return { success: false, error: 'Cannot reach the BidSure API server. Please check your connection.' };
        }
      },

      // ── Signup ────────────────────────────────────────────────────────────
      signup: async ({ name, email, password, role, department, requestNote, companyName, gstin, udyamNo, cin }) => {
        try {
          const res = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim().toLowerCase(),
              password,
              role,
              department: department || (role === 'Bidder' ? companyName : department),
              requestNote,
              companyName,
              gstin,
              udyamNo,
              cin,
            }),
          });
          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.error || 'Signup failed.' };
          }

          // Immediately activated (Bidder or Compliance Auditor)
          if (data.token) {
            set({ user: data.user, token: data.token, isAuthenticated: true });
            return { success: true, autoLogin: true, user: data.user };
          }

          // Procurement Officer → awaiting admin approval
          return { success: true, pending: true, message: data.message };
        } catch {
          return { success: false, error: 'Cannot reach the BidSure API server. Please check your connection.' };
        }
      },

      // ── Logout ────────────────────────────────────────────────────────────
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // ── Verify token is still valid ───────────────────────────────────────
      verifySession: async () => {
        const { token } = get();
        if (!token) return false;
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) {
            set({ user: null, token: null, isAuthenticated: false });
            return false;
          }
          const user = await res.json();
          set({ user, isAuthenticated: true });
          return true;
        } catch {
          return false;
        }
      },

      // ── Auth header helper ────────────────────────────────────────────────
      authHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // ── Role helpers ──────────────────────────────────────────────────────
      isAdmin: () => get().user?.role === 'Admin',
      isBidder: () => get().user?.role === 'Bidder',
      isOfficer: () => get().user?.role === 'Procurement Officer',
      isAuditor: () => get().user?.role === 'Compliance Auditor',

      // ── Redirect path after login ─────────────────────────────────────────
      getHomeRoute: () => {
        const role = get().user?.role;
        if (role === 'Admin') return '/admin';
        if (role === 'Bidder') return '/portal';
        return '/';
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
        try {
          const res = await fetch(`${API_BASE}/auth/officer-requests/${userId}/approve`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.json();
        } catch {
          return { error: 'Network error' };
        }
      },

      // ── Admin: reject officer ─────────────────────────────────────────────
      rejectOfficer: async (userId) => {
        const { token } = get();
        try {
          const res = await fetch(`${API_BASE}/auth/officer-requests/${userId}/reject`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.json();
        } catch {
          return { error: 'Network error' };
        }
      },

      // ── Admin: manually add officer ───────────────────────────────────────
      addOfficer: async ({ name, email, password, department }) => {
        const { token } = get();
        try {
          const res = await fetch(`${API_BASE}/auth/admin/add-officer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email, password, department }),
          });
          return res.json();
        } catch {
          return { error: 'Network error' };
        }
      },
    }),
    {
      name: 'bidsure-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
