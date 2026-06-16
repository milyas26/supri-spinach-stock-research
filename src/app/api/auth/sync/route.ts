import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const { firebaseUid, email, displayName } = await request.json();

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const { data: existing, error: findError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle();

    if (findError) {
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (existing) {
      const { error: updateError } = await supabaseAdmin
        .from("users")
        .update({ email, display_name: displayName, updated_at: new Date().toISOString() })
        .eq("firebase_uid", firebaseUid);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ userId: existing.id, created: false });
    }

    const { data: created, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({ firebase_uid: firebaseUid, email, display_name: displayName })
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ userId: created.id, created: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
