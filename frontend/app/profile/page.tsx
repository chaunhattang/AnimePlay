"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider";

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, updateProfile } = useAppContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    setUsername(currentUser.username);
    setEmail(currentUser.email);
    setFullName(currentUser.fullName);
    setAvatar(currentUser.avatar);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="space-y-4 rounded-lg border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-gray-300">Please login to update profile.</p>
        <Link href="/login" className="inline-flex rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          Go to Login
        </Link>
      </div>
    );
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const result = updateProfile({
      username,
      email,
      fullName,
      avatar,
      oldPassword,
      newPassword,
      confirmNewPassword
    });

    if (!result.ok) {
      setError(result.error || "Cannot update profile.");
      return;
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMessage("Profile updated.");
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-gray-400">Update fullname, avatar, email, username and password.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/15">
          <img src={avatar || currentUser.avatar} alt={fullName || currentUser.username} className="h-full w-full object-cover" />
        </div>
        <div className="text-sm text-gray-300">
          <p className="font-semibold">{currentUser.role.toUpperCase()}</p>
          <p>Created at: {new Date(currentUser.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Fullname"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm sm:col-span-2"
          required
        />
        <input
          value={avatar}
          onChange={(event) => setAvatar(event.target.value)}
          placeholder="Avatar URL"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="password"
          value={oldPassword}
          onChange={(event) => setOldPassword(event.target.value)}
          placeholder="Old password (required when changing password)"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="New password"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(event) => setConfirmNewPassword(event.target.value)}
          placeholder="Confirm new password"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white sm:col-span-2">
          Save Profile
        </button>
      </form>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-green-300">{message}</p> : null}
    </div>
  );
}
