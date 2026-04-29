"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import clsx from "clsx";

type Props = {
  visible: boolean;
  onClose: () => void;
};

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function ForgotPasswordModal({ visible, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!visible) {
      // reset internal state when modal hides
      setEmail("");
      setOtp("");
      setResetToken("");
      setNewPassword("");
      setConfirmPassword("");
      setStep(1);
      setLoading(false);
      setError("");
      setSuccess("");
    }
  }, [visible]);

  const sendOtp = async () => {
    setError("");
    setSuccess("");
    if (!isValidEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }
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
    if (!/^[0-9]{4,6}$/.test(otp)) {
      setError("Mã PIN không hợp lệ");
      return;
    }
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
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    setLoading(true);
    try {
      await apiClient.changePassword(resetToken, newPassword);
      setSuccess("Mật khẩu đã được thay đổi. Bạn có thể đăng nhập bằng mật khẩu mới.");
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      setError(err?.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 shadow-lg ">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Quên mật khẩu</h3>
            <p className="mt-1 text-sm text-gray-400">Nhập email để nhận mã PIN thay đổi mật khẩu.</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            ✕
          </button>
        </div>

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
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Xác nhận mật khẩu" type="password" className="w-full rounded-xl border bg-transparent px-4 py-2 text-sm text-white" />
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
        </div>
      </div>
    </div>
  );
}
