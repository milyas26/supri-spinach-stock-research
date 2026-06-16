import { create } from "zustand";

interface Bookmark {
  id: string;
  content_type: string;
  content_slug: string;
  label: string | null;
}

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (contentType: string, slug: string) => boolean;
  getBookmarkId: (contentType: string, slug: string) => string | undefined;
  fetchBookmarks: (firebaseUid: string) => Promise<void>;
  checkBookmarkStatus: (firebaseUid: string, contentType: string, slug: string) => Promise<void>;
  toggleBookmark: (opts: {
    contentType: string;
    contentSlug: string;
    label: string;
    firebaseUid: string;
  }) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks: [],
  loading: false,

  setBookmarks: (bookmarks) => set({ bookmarks }),

  addBookmark: (bookmark) =>
    set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),

  removeBookmark: (id) =>
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),

  isBookmarked: (contentType, slug) =>
    get().bookmarks.some(
      (b) => b.content_type === contentType && b.content_slug === slug
    ),

  getBookmarkId: (contentType, slug) =>
    get().bookmarks.find(
      (b) => b.content_type === contentType && b.content_slug === slug
    )?.id,

  fetchBookmarks: async (firebaseUid) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/bookmarks?firebaseUid=${encodeURIComponent(firebaseUid)}`);
      if (res.ok) {
        const data = await res.json();
        set({ bookmarks: data.bookmarks ?? [], loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  checkBookmarkStatus: async (firebaseUid, contentType, slug) => {
    try {
      const res = await fetch(
        `/api/bookmarks?firebaseUid=${encodeURIComponent(firebaseUid)}&contentType=${encodeURIComponent(contentType)}&contentSlug=${encodeURIComponent(slug)}`
      );
      if (res.ok) {
        const data = await res.json();
        const matched = data.bookmarks?.[0];
        const existing = get().bookmarks.find(
          (b) => b.content_type === contentType && b.content_slug === slug
        );
        if (matched && !existing) {
          get().addBookmark(matched);
        } else if (!matched && existing) {
          get().removeBookmark(existing.id);
        }
      }
    } catch {
      // silently ignore
    }
  },

  toggleBookmark: async ({ contentType, contentSlug, label, firebaseUid }) => {
    const existingId = get().getBookmarkId(contentType, contentSlug);
    if (existingId) {
      const res = await fetch(`/api/bookmarks?id=${existingId}&firebaseUid=${encodeURIComponent(firebaseUid)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        get().removeBookmark(existingId);
      }
    } else {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentSlug, label, firebaseUid }),
      });
      if (res.ok) {
        const data = await res.json();
        get().addBookmark(data.bookmark);
      }
    }
  },
}));
