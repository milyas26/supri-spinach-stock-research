"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { ArrowLeft, Bookmark, ExternalLink } from "lucide-react";

export default function BookmarksPage() {
  const user = useAuthStore((s) => s.user);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const loading = useBookmarkStore((s) => s.loading);
  const fetchBookmarks = useBookmarkStore((s) => s.fetchBookmarks);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/");
      return;
    }
    fetchBookmarks(user.uid);
  }, [user, fetchBookmarks, router]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="font-mono text-sm text-[#8C857A]">$ redirecting...</div>
      </div>
    );
  }

  const getHref = (type: string, slug: string) => {
    switch (type) {
      case "market-overview":
        return `/market-overview/${slug}`;
      case "deep-research":
        return `/deep-research/${slug}`;
      case "reports":
        return `/reports/${slug}`;
      case "general":
        return `/general/${slug}`;
      default:
        return "/";
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8C857A] hover:text-[#1E1C19] transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={2.5} />
        $ cd ../profile
      </Link>

      <div className="border-2 border-[#2D2A26] bg-[#EDE9E0]">
        <div className="border-b-2 border-[#2D2A26] px-5 py-3 flex items-center gap-2">
          <Bookmark className="h-3.5 w-3.5 text-[#C11F2A]" strokeWidth={2.5} />
          <h1 className="font-mono text-xs font-bold text-[#8C857A] uppercase tracking-[0.2em]">
            bookmarks
          </h1>
        </div>

        <div className="px-5 py-4">
          {loading ? (
            <div className="font-mono text-[11px] text-[#8C857A]">$ loading...</div>
          ) : bookmarks.length === 0 ? (
            <div className="font-mono text-[11px] text-[#8C857A]">
              $ no bookmarks yet
            </div>
          ) : (
            <div className="space-y-0.5">
              {bookmarks.map((b) => (
                <Link
                  key={b.id}
                  href={getHref(b.content_type, b.content_slug)}
                  className="flex items-center justify-between py-2 px-2 -mx-2 hover:bg-[#F5F2EB] transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-[#8C857A] uppercase w-28 shrink-0">
                      [{b.content_type}]
                    </span>
                    <span className="font-mono text-[12px] text-[#1E1C19] truncate group-hover:text-[#C11F2A] transition-colors">
                      {b.label || b.content_slug}
                    </span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-[#B8B0A4] shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border-t-2 border-[#2D2A26] px-5 py-2">
          <span className="font-mono text-[9px] text-[#8C857A]">
            {bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
