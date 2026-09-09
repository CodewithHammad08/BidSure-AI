import { create } from 'zustand';

export const MOCK_USERS = [
  {
    id: 'user-001',
    name: 'Priya Nair',
    role: 'Procurement Officer',
    department: 'Directorate of Public Works & Automation',
    avatarInitials: 'PN',
    email: 'officer@gem.gov.in',
  },
  {
    id: 'user-002',
    name: 'Rajesh Kumar',
    role: 'Compliance Auditor',
    department: 'National Audit & Oversight Cell',
    avatarInitials: 'RK',
    email: 'auditor@gem.gov.in',
  },
];

export const useAuthStore = create((set) => ({
  user: MOCK_USERS[0],
  isAuthenticated: true,
  login: async (email, password) => {
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found && password === 'BidSure@2026') {
      set({ user: found, isAuthenticated: true });
      return true;
    }
    if (email === 'officer@gem.gov.in' || password === 'BidSure@2026') {
      set({ user: MOCK_USERS[0], isAuthenticated: true });
      return true;
    }
    return false;
  },
  switchUser: (role) => {
    const found = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
    set({ user: found });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
