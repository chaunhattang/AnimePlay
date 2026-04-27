"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { currentUser, register } = useAppContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

    const result = await register({ username, email, password });
    if (!result.ok) {
      setError(result.error || "Register failed.");
      setSubmitting(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-5 rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Register</h1>
        <p className="text-sm text-gray-400">Create account with username, email and password.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="w-full rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
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
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <p className="text-sm text-gray-300">
        Already have account?{" "}
        <Link href="/login" className="text-brand-500 hover:text-brand-600">
          Login
        </Link>
      </p>
    </div>
  );
}
