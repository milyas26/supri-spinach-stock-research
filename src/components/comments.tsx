'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLoginDialogStore } from '@/stores/login-dialog-store';

interface CommentRow {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  updated_at?: string;
  users: { display_name: string | null; photo_url: string | null } | null;
}

function contentTypeFromPath(pathname: string): string {
  if (pathname.startsWith('/deep-research')) return 'deep-research';
  if (pathname.startsWith('/reports')) return 'reports';
  if (pathname.startsWith('/general')) return 'general';
  if (pathname.startsWith('/market-overview')) return 'market-overview';
  return 'deep-research';
}

function contentSlugFromPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  return parts.slice(1).join('/') || parts[0] || '';
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Comments() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setDialogOpen = useLoginDialogStore((s) => s.setOpen);

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const contentType = contentTypeFromPath(pathname);
  const contentSlug = contentSlugFromPath(pathname);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?contentType=${contentType}&contentSlug=${encodeURIComponent(contentSlug)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setComments(d.comments ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [contentType, contentSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !body.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          contentSlug,
          body: body.trim(),
          firebaseUid: user.uid,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to post comment');
      } else {
        setBody('');
        setComments((prev) => [...prev, data.comment]);
      }
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (c: CommentRow) => {
    setEditingId(c.id);
    setEditBody(c.body);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody('');
    setEditError('');
  };

  const saveEdit = async () => {
    if (!user?.uid || !editingId || !editBody.trim()) return;
    setSaving(true);
    setEditError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId: editingId,
          body: editBody.trim(),
          firebaseUid: user.uid,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error ?? 'Failed to update comment');
      } else {
        setComments((prev) =>
          prev.map((c) => (c.id === editingId ? data.comment : c))
        );
        cancelEdit();
      }
    } catch {
      setEditError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 max-w-[56rem] mx-auto">
      <h2 className="font-mono text-xs text-[#8C857A] mb-4 border-b border-gray-200 pb-2">
        comments ({comments.length})
      </h2>

      {loading ? (
        <p className="font-mono text-[11px] text-[#B0A89A]">loading comments...</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.length === 0 && (
            <p className="font-mono text-[11px] text-[#B0A89A]">no comments yet</p>
          )}
          {comments.map((c) => {
            const name =
              c.users?.display_name ||
              (c.users as unknown as { email?: string })?.email ||
              'anonymous';
            const isOwner = user?.supabaseId && c.user_id === user.supabaseId;
            const isEditing = editingId === c.id;

            return (
              <div key={c.id} className="font-mono text-[11px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[#5C5650] font-semibold">{name}</span>
                  <span className="text-[#B0A89A]">
                    {formatDate(c.created_at)}
                  </span>
                  {c.updated_at && (
                    <span className="text-[#B0A89A] italic">edited</span>
                  )}
                  {isOwner && !isEditing && (
                    <button
                      onClick={() => startEdit(c)}
                      className="text-[#B0A89A] hover:text-[#5C5650] transition-colors ml-auto"
                      title="Edit comment"
                    >
                      edit
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      className="w-full font-mono text-[11px] p-2 bg-[#F7F5F0] border border-gray-300 rounded-sm text-[#3A3630] resize-none focus:outline-none focus:border-[#8C857A]"
                    />
                    {editError && (
                      <p className="font-mono text-[10px] text-red-600">{editError}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        disabled={!editBody.trim() || editBody === c.body || saving}
                        className="font-mono text-[11px] px-3 py-1 border border-[#8C857A] text-[#5C5650] hover:bg-[#E3DDD0] hover:text-[#1E1C19] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-sm"
                      >
                        {saving ? 'saving...' : 'save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="font-mono text-[11px] px-3 py-1 text-[#B0A89A] hover:text-[#5C5650] transition-colors"
                      >
                        cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#3A3630] leading-relaxed whitespace-pre-wrap">
                    {c.body}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            maxLength={2000}
            className="w-full font-mono text-[11px] p-3 bg-[#F7F5F0] border border-gray-300 rounded-sm text-[#3A3630] placeholder-[#B0A89A] resize-none focus:outline-none focus:border-[#8C857A]"
          />
          {error && (
            <p className="font-mono text-[10px] text-red-600">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-[#B0A89A]">
              {user.email}
            </span>
            <button
              type="submit"
              disabled={!body.trim() || submitting}
              className="font-mono text-[11px] px-4 py-1.5 border border-[#8C857A] text-[#5C5650] hover:bg-[#E3DDD0] hover:text-[#1E1C19] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-sm"
            >
              {submitting ? 'posting...' : 'post'}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setDialogOpen(true)}
          className="font-mono text-[11px] text-[#8C857A] hover:text-[#1E1C19] transition-colors"
        >
          $ login to comment
        </button>
      )}
    </section>
  );
}
