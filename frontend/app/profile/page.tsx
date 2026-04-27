"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useAppContext } from "@/components/AppProvider";
import { getMediaUrl } from "@/lib/api-client";
import { Eye, EyeOff } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!currentUser) return;
    setFullName(currentUser.fullName || "");
    setAvatarUrl(currentUser.avatarUrl || "");
    setAvatarFile(null);
  }, [currentUser]);

  console.log("Current User:", currentUser);
  if (!currentUser) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="mt-2 text-sm text-gray-400">Please login to manage your profile.</p>

        <Link href="/login" className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
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
    setError("");
    setMessage("");

    const result = await updateProfile({
      fullName,
      avatarUrl,
      avatarFile,
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!result.ok) {
      setError(result.error || "Cannot update profile.");
      setSubmitting(false);
      return;
    }

    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    // setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("Profile updated successfully.");
    setSubmitting(false);
  };

  const inputStyle = "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

  const labelStyle = "text-sm font-medium text-gray-300";

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
        {/* Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-brand-600/20 to-purple-600/20 px-4 py-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/10 shadow-lg">
              <img src={getMediaUrl(currentUser.avatarUrl)} alt={fullName || currentUser.username} className="h-full w-full object-cover" />
            </div>

            <div className="flex-1">
              <div className="flex">
                <h1 className="text-2xl font-bold text-white">{fullName || currentUser.username}</h1>
                <div className="ml-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-300">{currentUser.role}</div>
              </div>

              <p className="mt-1 text-sm text-gray-300">Manage your account information and security settings.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={onSubmit} className="space-y-3 px-8 py-4">
          {/* Account Info */}
          <div>
            <h2 className="mb-5 text-lg font-semibold text-white">Account Information</h2>

            <div className="space-y-2">
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Full Name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputStyle} placeholder="Enter your full name" required />
              </div>

              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Username</label>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">{currentUser.username}</div>
              </div>

              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Email Address</label>
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">{currentUser.email}</div>
              </div>

              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Profile Avatar</label>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={onAvatarFileChange} className={inputStyle} />
              </div>
            </div>
          </div>

          {/* Security */}
          {/* <div className="border-t border-white/10 pt-3">
            <h2 className="mb-5 text-lg font-semibold text-white">Change Password</h2>

            <div className="space-y-2">
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-start">
                <label className={`${labelStyle} pt-3`}>Old Password</label>

                <div>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={inputStyle} placeholder="Enter current password only if you want to change it" />

                  <p className="mt-2 text-xs text-gray-500">Leave this blank if you do not want to update your password.</p>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputStyle} placeholder="Enter new password" />
              </div>

              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Confirm Password</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputStyle} placeholder="Re-enter new password" />
              </div>
            </div>
          </div> */}
          {/* Security */}
          <div className="border-t border-white/10 pt-3">
            <h2 className="mb-5 text-lg font-semibold text-white">Change Password</h2>

            <div className="space-y-4">
              {/* Old Password */}
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-start">
                <label className={labelStyle + " pt-3"}>Old Password</label>
                <div className="relative group">
                  <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className={`${inputStyle} pr-12`} placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 pb-7 text-gray-400 hover:text-white transition-colors">
                    {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <p className="mt-2 text-xs text-gray-500">Leave blank if not changing.</p>
                </div>
              </div>

              {/* New Password */}
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputStyle} pr-12`} placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:items-center">
                <label className={labelStyle}>Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={`${inputStyle} pr-12`} placeholder="Re-enter new password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors">
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Messages */}
          {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

          {message && <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">{message}</div>}

          {/* Submit */}
          <div className="border-t border-white/10 pt-6">
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
