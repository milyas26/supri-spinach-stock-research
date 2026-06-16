import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

async function getUserId(firebaseUid: string): Promise<string | null> {
  const supabaseAdmin = getSupabaseAdmin();
  const { data } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("firebase_uid", firebaseUid)
    .maybeSingle();
  return data?.id ?? null;
}

export async function GET(request: NextRequest) {
  const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");
  if (!firebaseUid) {
    return NextResponse.json({ error: "Missing firebaseUid" }, { status: 400 });
  }

  const userId = await getUserId(firebaseUid);
  if (!userId) {
    return NextResponse.json({ bookmarks: [] });
  }

  const contentType = request.nextUrl.searchParams.get("contentType");
  const contentSlug = request.nextUrl.searchParams.get("contentSlug");

  const supabaseAdmin = getSupabaseAdmin();
  let query = supabaseAdmin
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId);

  if (contentType && contentSlug) {
    query = query.eq("content_type", contentType).eq("content_slug", contentSlug);
    const { data, error } = await query.maybeSingle();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ bookmarks: data ? [data] : [] });
  }

  query = query.order("created_at", { ascending: false });
  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmarks: data });
}

export async function POST(request: Request) {
  const { contentType, contentSlug, label, firebaseUid } = await request.json();

  if (!contentType || !contentSlug || !firebaseUid) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userId = await getUserId(firebaseUid);
  if (!userId) {
    return NextResponse.json({ error: "User not found. Sync first." }, { status: 404 });
  }

  const validTypes = ["market-overview", "deep-research", "reports", "general"];
  if (!validTypes.includes(contentType)) {
    return NextResponse.json({ error: "Invalid content_type" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("bookmarks")
    .insert({
      user_id: userId,
      content_type: contentType,
      content_slug: contentSlug,
      label,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already bookmarked" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookmark: data }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const firebaseUid = request.nextUrl.searchParams.get("firebaseUid");

  if (!id || !firebaseUid) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const userId = await getUserId(firebaseUid);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { error } = await supabaseAdmin
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
