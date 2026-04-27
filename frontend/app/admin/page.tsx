"use client";

import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { ShieldCheck, Users, Film, BarChart3 } from "lucide-react";
import clsx from "clsx";

export default function AdminPage() {
  const { currentUser, isAdmin, users, movies } = useAppContext();

  if (!currentUser) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20">
          <ShieldCheck className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
        <p className="text-sm text-gray-400">Please login with an administrator account to access the dashboard.</p>
        <Link href="/login" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">
          Go to Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
          <ShieldCheck className="h-7 w-7 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-sm text-gray-400">Only administrators are authorized to access this dashboard.</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      href: "/admin/users",
      color: "from-blue-600/20 to-blue-500/5",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Movies",
      value: movies.length,
      icon: Film,
      href: "/admin/movies",
      color: "from-brand-600/20 to-brand-500/5",
      borderColor: "border-brand-500/20",
      iconColor: "text-brand-400",
    },
  ];

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-brand-500" />
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-gray-400">Manage your platform users and anime catalog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className={clsx("group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-card transition-all duration-300", "hover:-translate-y-1 hover:shadow-card-hover", stat.borderColor, stat.color)}>
              {/* Hover glow effect */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-4xl font-bold text-white transition-transform duration-300 group-hover:scale-105">{stat.value}</p>
                  <p className="text-xs text-gray-500">Click to manage</p>
                </div>
                <div className={clsx("rounded-xl bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110", stat.iconColor)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-card">
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/users" className="btn-lift inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-brand-500/30 hover:bg-brand-600/10 hover:text-brand-400">
            <Users className="h-4 w-4" />
            Manage Users
          </Link>
          <Link href="/admin/movies" className="btn-lift inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition hover:border-brand-500/30 hover:bg-brand-600/10 hover:text-brand-400">
            <Film className="h-4 w-4" />
            Manage Movies
          </Link>
        </div>
      </div>
    </div>
  );
}
