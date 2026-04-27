"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppContext } from "@/components/AppProvider";

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAppContext();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    setUsername(currentUser.username);
    setEmail(currentUser.email);
    setFullName(currentUser.fullName || "");
    setAvatarUrl(currentUser.avatarUrl || "");
    setAvatarFile(null);
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

  const onAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    const result = await updateProfile({
      username,
      email,
      fullName,
      avatarUrl,
      avatarFile,
      oldPassword,
      newPassword,
      confirmNewPassword
    });

    if (!result.ok) {
      setError(result.error || "Cannot update profile.");
      setSubmitting(false);
      return;
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setAvatarFile(null);
    setMessage("Profile updated.");
    setSubmitting(false);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 rounded-lg border border-white/10 bg-white/5 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-gray-400">Update account information and password.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/15">
          <img
            src={avatarUrl || currentUser.avatarUrl || "https://api.dicebear.com/9.x/initials/svg?seed=AnimePlay"}
            alt={fullName || currentUser.username}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="text-sm text-gray-300">
          <p className="font-semibold">{currentUser.role}</p>
          <p>User id: {currentUser.id}</p>
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
          value={avatarUrl}
          onChange={(event) => setAvatarUrl(event.target.value)}
          placeholder="Avatar URL"
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onAvatarFileChange}
          className="rounded-md border border-white/15 bg-black px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          type="password"
          value={oldPassword}
          onChange={(event) => setOldPassword(event.target.value)}
          placeholder="Old password"
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
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70 sm:col-span-2"
        >
          {submitting ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {message ? <p className="text-sm text-green-300">{message}</p> : null}
    </div>
  );
}
