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
  const contentType = request.nextUrl.searchParams.get("contentType");
  const contentSlug = request.nextUrl.searchParams.get("contentSlug");

  if (!contentType || !contentSlug) {
    return NextResponse.json({ error: "Missing contentType or contentSlug" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("id, body, created_at, users(display_name, photo_url)")
    .eq("content_type", contentType)
    .eq("content_slug", contentSlug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments: data });
}

export async function POST(request: Request) {
  const { contentType, contentSlug, body, firebaseUid } = await request.json();

  if (!contentType || !contentSlug || !body || !firebaseUid) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    return NextResponse.json({ error: "Comment body cannot be empty" }, { status: 400 });
  }

  if (body.length > 2000) {
    return NextResponse.json({ error: "Comment too long (max 2000 chars)" }, { status: 400 });
  }

  const validTypes = ["market-overview", "deep-research", "reports", "general"];
  if (!validTypes.includes(contentType)) {
    return NextResponse.json({ error: "Invalid content_type" }, { status: 400 });
  }

  const userId = await getUserId(firebaseUid);
  if (!userId) {
    return NextResponse.json({ error: "User not found. Login first." }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      user_id: userId,
      content_type: contentType,
      content_slug: contentSlug,
      body: body.trim(),
    })
    .select("id, body, created_at, users(display_name, photo_url)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comment: data }, { status: 201 });
}
