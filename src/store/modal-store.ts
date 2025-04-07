import { create } from "zustand";

export type Modal = {
  id: string;
  children: React.ReactNode;
};

export type ModalStoreInitialState = {
  modals: Modal[];
  addModal: (modal: Modal) => void;
  removeModal: (modal: Modal) => void;
};

const useModalStore = create<ModalStoreInitialState>((set) => ({
  modals: [],
  addModal: (modal) => set((state) => ({ modals: [...state.modals, modal] })),
  removeModal: (modal) =>
    set((state) => ({
      modals: state.modals.filter((m) => m.id !== modal.id),
    })),
}));

export default useModalStore;
