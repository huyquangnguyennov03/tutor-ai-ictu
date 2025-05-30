import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Roles } from '@/common/constants/roles';

interface User {
  fullName: string;
  email: string;
  role: Roles | null;
  sub: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      hasHydrated: false,
      setUser: (user) => set({ user, isLoggedIn: true }),
      clearUser: () => set({ user: null, isLoggedIn: false }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);