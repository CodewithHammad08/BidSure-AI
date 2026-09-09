import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const MOCK_USER: User = {
  id: 'user-001',
  name: 'Priya Nair',
  email: 'priya.nair@gem.gov.in',
  role: 'Senior Procurement Officer',
  department: 'Ministry of Heavy Industries',
  avatarInitials: 'PN',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string): Promise<boolean> => {
        // Mock authentication — replace with real API in production
        await new Promise((r) => setTimeout(r, 800));

        const validCredentials =
          (email === 'officer@gem.gov.in' && password === 'BidSure@2026') ||
          (email === 'priya.nair@gem.gov.in' && password === 'BidSure@2026') ||
          (email === 'demo@bidsure.ai' && password === 'demo123');

        if (validCredentials) {
          set({ user: MOCK_USER, isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'bidsure-auth',
    }
  )
);
