"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/components/AppProvider";
import { User } from "@/lib/types";

type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function UserRow({
  user,
  onUpdate,
  onDelete,
  canDelete
}: {
  user: User;
  onUpdate: (userId: string, event: FormEvent<HTMLFormElement>) => void;
  onDelete: (userId: string) => void;
  canDelete: boolean;
}) {
  return (
    <form onSubmit={(event) => onUpdate(user.id, event)} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <input
          name="fullName"
          defaultValue={user.fullName}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          name="username"
          defaultValue={user.username}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          name="email"
          type="email"
          defaultValue={user.email}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          name="password"
          defaultValue={user.password}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          name="avatar"
          defaultValue={user.avatar}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-2"
        />
        <select name="role" defaultValue={user.role} className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-gray-400">
          id: {user.id} | created: {new Date(user.createdAt).toLocaleString()}
        </p>
        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-semibold">
            Update
          </button>
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            disabled={!canDelete}
            className="rounded-md border border-red-400/50 px-3 py-1.5 text-sm text-red-300 disabled:opacity-40"
          >
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

  const onCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = createUser({
      fullName: String(formData.get("fullName") || ""),
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      avatar: String(formData.get("avatar") || ""),
      role: String(formData.get("role") || "user") as "admin" | "user"
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot create user." });
      return;
    }

    event.currentTarget.reset();
    setMessage({ type: "success", text: "User created." });
  };

  const onUpdateUser = (userId: string, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = updateUser(userId, {
      fullName: String(formData.get("fullName") || ""),
      username: String(formData.get("username") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      avatar: String(formData.get("avatar") || ""),
      role: String(formData.get("role") || "user") as "admin" | "user"
    });

    if (!result.ok) {
      setMessage({ type: "error", text: result.error || "Cannot update user." });
      return;
    }

    setMessage({ type: "success", text: "User updated." });
  };

  const onDeleteUser = (userId: string) => {
    const result = deleteUser(userId);
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
        <p className="text-sm text-gray-400">Create, update and delete user records.</p>
      </div>

      <form onSubmit={onCreateUser} className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">
        <h2 className="text-lg font-semibold">Create User</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <input name="fullName" placeholder="Fullname" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="username" placeholder="Username" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="email" type="email" placeholder="Email" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="password" placeholder="Password" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm" required />
          <input name="avatar" placeholder="Avatar URL" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm lg:col-span-2" />
          <select name="role" defaultValue="user" className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <button type="submit" className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold">
          Add User
        </button>
      </form>

      {message ? (
        <p className={message.type === "error" ? "text-sm text-red-300" : "text-sm text-green-300"}>{message.text}</p>
      ) : null}

      <div className="space-y-3">
        {users.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onUpdate={onUpdateUser}
            onDelete={onDeleteUser}
            canDelete={currentUser.id !== user.id}
          />
        ))}
      </div>
    </div>
  );
}
