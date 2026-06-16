"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useLoginDialogStore } from "@/stores/login-dialog-store";

export function LoginButton() {
  const user = useAuthStore((s) => s.user);
  const setDialogOpen = useLoginDialogStore((s) => s.setOpen);

  if (!user) {
    return (
      <button
        onClick={() => setDialogOpen(true)}
        className="font-mono text-[11px] text-[#8C857A] hover:text-[#1E1C19] transition-colors"
      >
        $ login
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8C857A] bg-[#E3DDD0] font-mono text-[10px] font-bold text-[#5C5650] hover:border-[#1E1C19] hover:text-[#1E1C19] transition-colors"
      title={user.email}
    >
      {user.initials}
    </Link>
  );
}
