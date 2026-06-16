"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useLoginDialogStore } from "@/stores/login-dialog-store";

interface BookmarkButtonProps {
  contentType: string;
  contentSlug: string;
  label: string;
}

export function BookmarkButton({ contentType, contentSlug, label }: BookmarkButtonProps) {
  const user = useAuthStore((s) => s.user);
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
  const checkBookmarkStatus = useBookmarkStore((s) => s.checkBookmarkStatus);
  const bookmarked = useBookmarkStore(
    (s) => s.bookmarks.some((b) => b.content_type === contentType && b.content_slug === contentSlug)
  );
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (user) {
      checkBookmarkStatus(user.uid, contentType, contentSlug);
    }
  }, [user, contentType, contentSlug, checkBookmarkStatus]);

  const setDialogOpen = useLoginDialogStore((s) => s.setOpen);

  const handleToggle = async () => {
    if (!user) {
      setDialogOpen(true);
      return;
    }
    if (toggling) return;
    setToggling(true);
    await toggleBookmark({
      contentType,
      contentSlug,
      label,
      firebaseUid: user.uid,
    });
    setToggling(false);
  };

  return (
    <button
      onClick={handleToggle}
      title={bookmarked ? "Remove bookmark" : "Bookmark"}
      className="inline-flex items-center gap-1.5 font-mono text-[11px] transition-colors"
      style={{ color: bookmarked ? "#C11F2A" : "#8C857A" }}
    >
      <Bookmark
        className="h-3.5 w-3.5"
        strokeWidth={2.5}
        fill={bookmarked ? "currentColor" : "none"}
      />
      {bookmarked ? "$ unbookmark" : "$ bookmark"}
    </button>
  );
}
