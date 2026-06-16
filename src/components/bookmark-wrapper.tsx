"use client";

import { BookmarkButton } from "@/components/bookmark-button";

interface BookmarkWrapperProps {
  contentType: string;
  contentSlug: string;
  label: string;
}

export function BookmarkWrapper({ contentType, contentSlug, label }: BookmarkWrapperProps) {
  return (
    <div className="mb-4">
      <BookmarkButton contentType={contentType} contentSlug={contentSlug} label={label} />
    </div>
  );
}
