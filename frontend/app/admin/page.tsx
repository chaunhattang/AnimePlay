"use client";

import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";

export default function AdminPage() {
  const { currentUser, isAdmin, users, movies } = useAppContext();

  if (!currentUser) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-gray-300">Please login with admin account.</p>
        <Link href="/login" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-sm text-gray-300">Only admin can open this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-400">Manage users and movies.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/users" className="rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p className="text-lg font-semibold">User Management</p>
          <p className="mt-2 text-sm text-gray-300">{users.length} users in system</p>
        </Link>
        <Link href="/admin/movies" className="rounded-lg border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <p className="text-lg font-semibold">Movie Management</p>
          <p className="mt-2 text-sm text-gray-300">{movies.length} movies in catalog</p>
        </Link>
      </div>
    </div>
  );
}
