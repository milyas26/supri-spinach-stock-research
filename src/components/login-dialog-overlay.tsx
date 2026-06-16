"use client";

import { useLoginDialogStore } from "@/stores/login-dialog-store";
import { LoginDialog } from "@/components/login-dialog";

export function LoginDialogOverlay() {
  const open = useLoginDialogStore((s) => s.open);
  const setOpen = useLoginDialogStore((s) => s.setOpen);

  if (!open) return null;

  return <LoginDialog open={open} onClose={() => setOpen(false)} />;
}
