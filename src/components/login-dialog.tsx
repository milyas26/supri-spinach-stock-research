"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LoginDialog({ open, onClose }: LoginDialogProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Authentication failed";
      if (msg.includes("auth/popup-closed-by-user")) {
        setError("Sign-in cancelled");
      } else if (msg.includes("auth/popup-blocked")) {
        setError("Popup blocked. Allow popups for this site.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#1E1C19]/50 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-[320px] border-2 border-[#2D2A26] bg-[#EDE9E0]"
      >
        <div className="flex items-center justify-between border-b-2 border-[#2D2A26] px-4 py-2.5">
          <span className="text-[10px] font-bold text-[#8C857A] uppercase tracking-[0.2em]">
            supri-spinach — auth
          </span>
          <button
            onClick={onClose}
            className="flex h-5 w-5 items-center justify-center text-[#8C857A] hover:text-[#1E1C19]"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-5 space-y-4">
          <div className="font-mono text-sm text-[#5C5650]">
            <span>$ </span>
            <span>login</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border-2 border-[#2D2A26] bg-[#F5F2EB] px-4 py-3 font-mono text-[13px] font-bold text-[#1E1C19] hover:bg-[#E3DDD0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? "$ signing in..." : "$ sign in with google"}
          </button>

          {error && (
            <div className="font-mono text-[11px] text-[#C11F2A] border border-[#C11F2A]/20 bg-[#C11F2A]/5 px-2 py-1.5">
              $ {error}
            </div>
          )}
        </div>

        <div className="border-t-2 border-[#2D2A26] px-4 py-2">
          <span className="text-[9px] text-[#8C857A] uppercase tracking-[0.15em]">
            [esc] cancel
          </span>
        </div>
      </div>
    </div>
  );
}
