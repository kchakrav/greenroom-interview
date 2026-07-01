"use client";
import { Suspense } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [adminPassword, setAdminPassword] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("admin-password", {
      password: adminPassword,
      callbackUrl,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      window.location.href = callbackUrl;
    } else {
      setError("Incorrect admin password.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl btn-accent grid place-items-center text-xl font-bold">GR</div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to <span className="accent-text">GreenRoom</span></h1>
          <p className="text-sm text-ink-secondary text-center">Your AI-powered interview coach. Sign in to get started.</p>
        </div>

        {/* Google sign-in */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="glass flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium transition hover:bg-white/10"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Admin bypass */}
        <div className="mt-6">
          {!showAdmin ? (
            <button
              onClick={() => setShowAdmin(true)}
              className="w-full text-xs text-ink-muted hover:text-ink-secondary transition text-center"
            >
              Admin access
            </button>
          ) : (
            <form onSubmit={handleAdminLogin} className="glass rounded-2xl p-4 space-y-3">
              <p className="text-xs text-ink-secondary font-medium">Admin password</p>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30"
                autoFocus
              />
              {error && <p className="text-xs text-signal-bad">{error}</p>}
              <button
                type="submit"
                disabled={loading || !adminPassword}
                className="btn-accent w-full rounded-xl py-2 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Sign in as Admin
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function LoginShell() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl btn-accent grid place-items-center text-xl font-bold">GR</div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to <span className="accent-text">GreenRoom</span></h1>
          <p className="text-sm text-ink-secondary text-center">Loading sign in…</p>
        </div>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
