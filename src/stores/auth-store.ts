import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase-auth";

interface UserProfile {
  uid: string;
  email: string;
  initials: string;
  supabaseId?: string;
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  init: () => () => void;
}

function buildProfile(fbUser: User): UserProfile {
  const email = fbUser.email ?? "";
  const initials = email
    .split("@")[0]
    .split(/[.\-_]/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return { uid: fbUser.uid, email, initials };
}

async function syncUserToSupabase(fbUser: User): Promise<string | undefined> {
  try {
    const res = await fetch("/api/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseUid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.userId as string;
    }
  } catch {
    // silent fail — user still logged in via Firebase
  }
  return undefined;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      firebaseUser: null,
      loading: true,

      loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        const fbUser = cred.user;
        const supabaseId = await syncUserToSupabase(fbUser);
        set({
          user: { ...buildProfile(fbUser), supabaseId },
          firebaseUser: fbUser as unknown as User,
          loading: false,
        });
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, firebaseUser: null, loading: false });
      },

      init: () => {
        set({ loading: true });
        const unsub = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            const profile = buildProfile(fbUser);
            set({
              user: profile,
              firebaseUser: fbUser as unknown as User,
              loading: false,
            });
            syncUserToSupabase(fbUser).then((supabaseId) => {
              if (supabaseId) {
                set((s) => ({
                  user: s.user ? { ...s.user, supabaseId } : null,
                }));
              }
            });
          } else {
            set({ user: null, firebaseUser: null, loading: false });
          }
        });
        return unsub;
      },
    }),
    {
      name: "supri-auth",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
