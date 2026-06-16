"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { LogOut, ArrowLeft, Bookmark } from "lucide-react";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="font-mono text-sm text-[#8C857A]">$ redirecting...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8C857A] hover:text-[#1E1C19] transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={2.5} />
        $ cd ..
      </Link>

      <div className="border-2 border-[#2D2A26] bg-[#EDE9E0]">
        <div className="border-b-2 border-[#2D2A26] px-5 py-3">
          <h1 className="font-mono text-xs font-bold text-[#8C857A] uppercase tracking-[0.2em]">
            profile
          </h1>
        </div>

        <div className="px-5 py-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#2D2A26] bg-[#F5F2EB] font-mono text-lg font-bold text-[#1E1C19]">
              {user.initials}
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[#1E1C19]">
                {user.email}
              </div>
              <div className="font-mono text-[10px] text-[#8C857A] mt-0.5">
                logged in
              </div>
            </div>
          </div>

          <div className="border-t border-[#D1CCC0] pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#8C857A]">$ whoami</span>
              <span className="font-mono text-[11px] text-[#1E1C19]">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#8C857A]">$ id</span>
              <span className="font-mono text-[11px] text-[#5C5650]">{user.uid.slice(0, 12)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#8C857A]">$ hostname</span>
              <span className="font-mono text-[11px] text-[#5C5650]">supri-spinach</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#2D2A26] px-5 py-3 flex items-center justify-between">
          <Link
            href="/profile/bookmarks"
            className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#8C857A] hover:text-[#1E1C19] transition-colors uppercase tracking-[0.15em]"
          >
            <Bookmark className="h-3 w-3" strokeWidth={2.5} />
            $ bookmarks
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#C11F2A] hover:text-[#1E1C19] transition-colors uppercase tracking-[0.15em]"
          >
            <LogOut className="h-3 w-3" strokeWidth={2.5} />
            $ logout
          </button>
        </div>
      </div>
    </div>
  );
}
