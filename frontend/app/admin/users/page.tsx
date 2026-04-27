"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { User } from "@/lib/types";
import { Users, ShieldCheck, Plus, Save, Trash2, UserCircle, Mail, Lock, Image as ImageIcon, Shield, AlertCircle, AtSign } from "lucide-react";
import clsx from "clsx";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function UserRow({ user, onUpdate, onDelete, canDelete }: { user: User; onUpdate: (userId: string, event: FormEvent<HTMLFormElement>) => Promise<void>; onDelete: (userId: string) => Promise<void>; canDelete: boolean }) {
  const inputClasses = "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25";
  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-card transition-all duration-300 hover:border-white/20">
      <form onSubmit={(event) => void onUpdate(user.id, event)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Full Name */}
          <div>
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <UserCircle className="h-3 w-3 text-brand-500" />
                Full Name <span className="text-brand-500">*</span>
              </span>
            </label>
            <input name="fullName" defaultValue={user.fullName} className={inputClasses} required />
          </div>

          {/* Username */}
          <div>
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <AtSign className="h-3 w-3 text-brand-500" />
                Username <span className="text-brand-500">*</span>
              </span>
            </label>
            <input name="username" defaultValue={user.username} className={inputClasses} required />
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3 w-3 text-brand-500" />
                Email <span className="text-brand-500">*</span>
              </span>
            </label>
            <input name="email" type="email" defaultValue={user.email} className={inputClasses} required />
          </div>

          {/* Password */}
          <div>
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-brand-500" />
                New Password
              </span>
            </label>
            <input name="password" type="password" placeholder="Leave blank to keep current" className={inputClasses} />
          </div>

          {/* Avatar File */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3 text-brand-500" />
                Avatar
              </span>
            </label>
            <input name="avatarFile" type="file" accept="image/*" className={clsx(inputClasses, "py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-500")} />
          </div>

          {/* Role */}
          <div>
            <label className={labelClasses}>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3 w-3 text-brand-500" />
                Role <span className="text-brand-500">*</span>
              </span>
            </label>
            <select name="role" defaultValue={user.role} className={clsx(inputClasses, "cursor-pointer")}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-xs text-gray-500">ID: {user.id}</p>
          <div className="flex items-center gap-2">
            <button type="submit" className="btn-lift inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-500">
              <Save className="h-4 w-4" />
              Update
            </button>
            <button
              type="button"
              onClick={() => void onDelete(user.id)}
              disabled={!canDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:border-red-400/50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminUsersPage() {
  const { currentUser, isAdmin, users, createUser, updateUser, deleteUser } = useAppContext();
  const [message, setMessage] = useState<MessageState>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-lg space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-card backdrop-blur">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20">
          <ShieldCheck className="h-7 w-7 text-brand-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Users</h1>
        <p className="text-sm text-gray-400">Please login with an admin account.</p>
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
        <p className="text-sm text-gray-400">Only admin can manage users.</p>
      </div>
    );
  }

  const onCreateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const result = await createUser({
      fullName: String(formData.get("fullName") || ""),
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      avatarFile: (formData.get("avatarFile") as File) || null,
      role: String(formData.get("role") || "USER").toUpperCase() as "ADMIN" | "USER",
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot create user." });
      setSubmitting(false);
      return;
    }

    event.currentTarget.reset();
    setMessage({ type: "success", text: "User created successfully!" });
    setSubmitting(false);
  };

  const onUpdateUser = async (userId: string, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await updateUser(userId, {
      fullName: String(formData.get("fullName") || ""),
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      avatarFile: (formData.get("avatarFile") as File) || null,
      role: String(formData.get("role") || "USER").toUpperCase() as "ADMIN" | "USER",
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot update user." });
      return;
    }
    setMessage({ type: "success", text: "User updated successfully!" });
  };

  const onDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot delete user." });
      return;
    }
    setMessage({ type: "success", text: "User deleted successfully!" });
  };

  const inputClasses = "w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 hover:border-white/25";
  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-brand-500" />
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>
        <p className="text-sm text-gray-400">Create, update and delete users from the system.</p>
      </div>

      {/* Create User Form */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card">
        <div className="border-b border-white/10 bg-gradient-to-r from-brand-600/10 to-transparent px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Plus className="h-5 w-5 text-brand-500" />
            Create New User
          </h2>
        </div>

        <form onSubmit={(event) => void onCreateUser(event)} className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Full Name */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <UserCircle className="h-3 w-3 text-brand-500" />
                  Full Name <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="fullName" placeholder="John Doe" className={inputClasses} required />
            </div>

            {/* Username */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <AtSign className="h-3 w-3 text-brand-500" />
                  Username <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="username" placeholder="johndoe" className={inputClasses} required />
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-brand-500" />
                  Email <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="email" type="email" placeholder="john@example.com" className={inputClasses} required />
            </div>

            {/* Password */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-brand-500" />
                  Password <span className="text-brand-500">*</span>
                </span>
              </label>
              <input name="password" type="password" placeholder="Min 6 characters" className={inputClasses} required />
            </div>

            {/* Avatar File */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon className="h-3 w-3 text-brand-500" />
                  Avatar
                </span>
              </label>
              <input name="avatarFile" type="file" accept="image/*" className={clsx(inputClasses, "py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-brand-500")} />
            </div>

            {/* Role */}
            <div>
              <label className={labelClasses}>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-brand-500" />
                  Role <span className="text-brand-500">*</span>
                </span>
              </label>
              <select name="role" defaultValue="USER" className={clsx(inputClasses, "cursor-pointer")}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={clsx("btn-lift mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition", "hover:bg-brand-500 focus:ring-2 focus:ring-brand-500/30", submitting && "cursor-not-allowed opacity-70")}
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add User
              </>
            )}
          </button>
        </form>
      </div>

      {/* Message */}
      {message && (
        <div className={clsx("animate-fade-in flex items-center gap-2 rounded-xl border px-4 py-3 text-sm", message.type === "error" ? "border-red-500/20 bg-red-500/10 text-red-300" : "border-green-500/20 bg-green-500/10 text-green-300")}>
          <AlertCircle className="h-4 w-4" />
          {message.text}
        </div>
      )}

      {/* User List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">All Users ({users.length})</h2>
        {users.map((user) => (
          <UserRow key={user.id} user={user} onUpdate={onUpdateUser} onDelete={onDeleteUser} canDelete={currentUser.id !== user.id} />
        ))}
      </div>
    </div>
  );
}
