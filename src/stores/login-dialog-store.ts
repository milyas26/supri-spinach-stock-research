import { create } from 'zustand';

interface DialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useLoginDialogStore = create<DialogState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));
