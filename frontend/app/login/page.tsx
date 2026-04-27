"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider";

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

  return (
    <div className="mx-auto w-full max-w-md space-y-5 rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-gray-400">Login with username or email and password.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={accountName}
          onChange={(event) => setAccountName(event.target.value)}
          placeholder="Username or email"
          className="w-full rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <p className="text-sm text-gray-300">
        No account?{" "}
        <Link href="/register" className="text-brand-500 hover:text-brand-600">
          Register now
        </Link>
      </p>
    </div>
  );
}
