"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { User } from "@/lib/types";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function UserRow({ user, onUpdate, onDelete, canDelete }: { user: User; onUpdate: (userId: string, event: FormEvent<HTMLFormElement>) => Promise<void>; onDelete: (userId: string) => Promise<void>; canDelete: boolean }) {
  return (
    <form onSubmit={(event) => void onUpdate(user.id, event)} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <input name="fullName" defaultValue={user.fullName} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
        <input name="username" defaultValue={user.username} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
        <input name="email" type="email" defaultValue={user.email} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
        <input name="password" type="password" placeholder="New password (optional)" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" />
        <input name="avatarFile" type="file" accept="image/*" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-2" />
        <select name="role" defaultValue={user.role} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-400">id: {user.id}</p>
        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold">
            Update
          </button>
          <button type="button" onClick={() => void onDelete(user.id)} disabled={!canDelete} className="rounded-md border border-red-400/50 px-3 py-1.5 text-sm text-red-300 disabled:opacity-40">
            Delete
          </button>
        </div>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const { currentUser, isAdmin, users, createUser, updateUser, deleteUser } = useAppContext();
  const [message, setMessage] = useState<MessageState>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Admin Users</h1>
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
        <p className="mt-2 text-sm text-gray-300">Only admin can manage users.</p>
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
    setMessage({ type: "success", text: "User created." });
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

    setMessage({ type: "success", text: "User updated." });
  };

  const onDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot delete user." });
      return;
    }
    setMessage({ type: "success", text: "User deleted." });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Admin - User Management</h1>
        <p className="text-sm text-gray-400">Create, update and delete users from backend API.</p>
      </div>

      <form onSubmit={(event) => void onCreateUser(event)} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Create User</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="fullName" placeholder="Fullname" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="username" placeholder="Username" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="password" type="password" placeholder="Password" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="avatarFile" type="file" accept="image/*" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-2" />
          <select name="role" defaultValue="USER" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit" disabled={submitting} className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold disabled:opacity-70">
          {submitting ? "Adding..." : "Add User"}
        </button>
      </form>

      {message ? <p className={message.type === "error" ? "text-sm text-red-300" : "text-sm text-green-300"}>{message.text}</p> : null}

      <div className="space-y-3">
        {users.map((user) => (
          <UserRow key={user.id} user={user} onUpdate={onUpdateUser} onDelete={onDeleteUser} canDelete={currentUser.id !== user.id} />
        ))}
      </div>
    </div>
  );
}
