"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider";
import { LogIn, User, Lock, ArrowRight, Film } from "lucide-react";
import clsx from "clsx";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useAppContext();
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const result = await login({ accountName, password });
    if (!result.ok) {
      setError(result.error || "Login failed.");
      setSubmitting(false);
      return;
    }

    router.push("/");
  };

  const inputClasses = "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 pl-11 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25";

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Animated card container */}
      <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card backdrop-blur">
        {/* Header with gradient */}
        <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-brand-600/20 via-purple-600/10 to-transparent px-6 py-8 text-center">
          <div className="absolute -right-4 -top-4 h-24 w-24 animate-spin-slow rounded-full border-2 border-brand-500/20" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 animate-spin-slow rounded-full border-2 border-purple-500/20 [animation-direction:reverse]" />

          <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-glow">
            <Film className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-400">Sign in to continue your anime journey</p>
        </div>

        <div className="space-y-5 p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Account Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="accountName" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <User className="h-4 w-4 text-brand-500" />
                Username or Email
                <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <input id="accountName" value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Enter your username or email" className={clsx(inputClasses, error && "border-red-500/50")} required autoComplete="username" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Lock className="h-4 w-4 text-brand-500" />
                Password
                <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className={clsx(inputClasses, error && "border-red-500/50")} required autoComplete="current-password" />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="animate-shake rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={clsx("btn-lift flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200", "hover:bg-brand-500 focus:ring-2 focus:ring-brand-500/30", submitting && "cursor-not-allowed opacity-70")}
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-sm">
            <span className="text-gray-400">Don&apos;t have an account?</span>
            <Link href="/register" className="group inline-flex items-center gap-1 font-medium text-brand-500 transition hover:text-brand-400">
              Create one
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
