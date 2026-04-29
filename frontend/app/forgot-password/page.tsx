"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import clsx from "clsx";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await apiClient.requestPasswordReset(email);
      setStep(2);
      setSuccess("PIN đã được gửi đến email. Vui lòng kiểm tra hộp thư.");
    } catch (err: any) {
      setError(err?.message || "Không thể gửi PIN.");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const token = await apiClient.verifyOtp(email, Number(otp));
      setResetToken(token as string);
      setStep(3);
      setSuccess("Mã xác nhận hợp lệ. Vui lòng nhập mật khẩu mới.");
    } catch (err: any) {
      setError(err?.message || "Xác thực PIN thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await apiClient.changePassword(resetToken, newPassword);
      setSuccess("Mật khẩu đã được thay đổi. Bạn có thể đăng nhập bằng mật khẩu mới.");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(err?.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="animate-scale-in overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-card backdrop-blur p-6">
        <h1 className="text-xl font-semibold text-white">Quên mật khẩu</h1>
        <p className="text-sm text-gray-400">Nhập email để nhận mã PIN thay đổi mật khẩu.</p>

        <div className="mt-4 space-y-4">
          {error && <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}
          {success && <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-300">{success}</div>}

          {step === 1 && (
            <>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border bg-transparent px-4 py-2 text-sm text-white" />
              <div className="flex justify-end">
                <button onClick={sendOtp} disabled={loading} className={clsx("btn-lift rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white", loading && "opacity-60 cursor-not-allowed")}>
                  Gửi PIN
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Mã PIN" className="w-full rounded-xl border bg-transparent px-4 py-2 text-sm text-white" />
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-gray-400">
                  Quay lại
                </button>
                <button onClick={verify} disabled={loading} className={clsx("btn-lift rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white", loading && "opacity-60 cursor-not-allowed")}>
                  Xác nhận
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" type="password" className="w-full rounded-xl border bg-transparent px-4 py-2 text-sm text-white" />
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-gray-400">
                  Quay lại
                </button>
                <button onClick={changePassword} disabled={loading} className={clsx("btn-lift rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white", loading && "opacity-60 cursor-not-allowed")}>
                  Đổi mật khẩu
                </button>
              </div>
            </>
          )}

          <div className="pt-3 text-sm text-gray-400">
            <Link href="/login" className="text-brand-500">
              Quay về đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
