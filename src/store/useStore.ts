import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '../types';

interface AppState {
  user: UserProfile | null;
  isHydrated: boolean; // To know if persist has loaded
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setHydrated: (state: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      setUser: (user) => set({ user }),
      
      setHydrated: (state) => set({ isHydrated: state }),
    }),
    {
      name: 'carscube-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({ 
        user: state.user 
      }), // Persist user
    }
  )
);
