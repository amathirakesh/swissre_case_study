import { create } from 'zustand';
import { demoPoliciesByRole } from '../mocks/rbac';
import { DemoPolicySet, DemoRole } from '../types/rbac';

interface UiState {
  selectedClaimId: string | null;
  activeWorkspaceTab: 'comments' | 'annotations';
  activeDemoRole: DemoRole;
  setSelectedClaimId: (claimId: string | null) => void;
  setActiveWorkspaceTab: (tab: 'comments' | 'annotations') => void;
  setActiveDemoRole: (role: DemoRole) => void;
  getActivePolicies: () => DemoPolicySet;
}

export const useUiStore = create<UiState>((set) => ({
  selectedClaimId: null,
  activeWorkspaceTab: 'comments',
  activeDemoRole: 'supervisor',
  setSelectedClaimId: (selectedClaimId) => set({ selectedClaimId }),
  setActiveWorkspaceTab: (activeWorkspaceTab) => set({ activeWorkspaceTab }),
  setActiveDemoRole: (activeDemoRole) => set({ activeDemoRole }),
  getActivePolicies: () => demoPoliciesByRole[useUiStore.getState().activeDemoRole],
}));
