"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  RotateCw,
  ShieldCheck,
} from "lucide-react";

import { apiFetch } from "@/app/lib/apiFetch";
import { setSession, type UserRole } from "@/app/lib/auth";
import SummaryApi from "@/app/constants/SummaryApi";
import { cldPublic } from "@/app/lib/cloudinary";

type RequestOtpRes = { message?: string };
type VerifyOtpRes = {
  accessToken: string;
  refreshToken: string;
  user: { uid: string; role: UserRole; email: string; name?: string };
};

const OTP_LENGTH = 6;

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong";
}

export default function AdminLogin() {
  const router = useRouter();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<"error" | "success" | null>(null);
  const [resendSeconds, setResendSeconds] = useState(30);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otp = otpValues.join("");

  useEffect(() => {
    if (step !== "OTP" || resendSeconds <= 0) return;
    const timer = setTimeout(() => setResendSeconds((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, resendSeconds]);

  useEffect(() => {
    if (step === "OTP") inputRefs.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    if (step === "OTP" && otp.length === OTP_LENGTH && !loading) {
      const t = setTimeout(() => {
        verifyOtp();
      }, 250);
      return () => clearTimeout(t);
    }
  }, [otp, step]); // eslint-disable-line react-hooks/exhaustive-deps

  async function requestOtp() {
    if (!email.trim()) return;

    setLoading(true);
    setMsg(null);
    setMsgType(null);

    try {
      const res = await apiFetch<RequestOtpRes>(SummaryApi.requestOtp.url, {
        method: SummaryApi.requestOtp.method,
        json: { email: email.trim() },
      });

      setMsg(res.message ?? "OTP sent successfully");
      setMsgType("success");
      setStep("OTP");
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setResendSeconds(30);
    } catch (e: unknown) {
      setMsg(errMsg(e));
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (otp.length !== OTP_LENGTH) return;

    setLoading(true);
    setMsg(null);
    setMsgType(null);

    try {
      const res = await apiFetch<VerifyOtpRes>(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        json: { email: email.trim(), otp },
      });

      setSession(res.accessToken, res.refreshToken, res.user);
      router.replace("/admin/dashboard");
    } catch (e: unknown) {
      setMsg(errMsg(e));
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (resendSeconds > 0) return;

    setLoading(true);
    setMsg(null);
    setMsgType(null);

    try {
      const res = await apiFetch<RequestOtpRes>(SummaryApi.requestOtp.url, {
        method: SummaryApi.requestOtp.method,
        json: { email: email.trim() },
      });

      setMsg(res.message ?? "OTP resent successfully");
      setMsgType("success");
      setOtpValues(Array(OTP_LENGTH).fill(""));
      setResendSeconds(30);
      inputRefs.current[0]?.focus();
    } catch (e: unknown) {
      setMsg(errMsg(e));
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");

    if (!cleaned) {
      const next = [...otpValues];
      next[index] = "";
      setOtpValues(next);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, OTP_LENGTH).split("");
      const next = Array(OTP_LENGTH).fill("");

      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = chars[i] ?? "";
      }

      setOtpValues(next);
      inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
      return;
    }

    const next = [...otpValues];
    next[index] = cleaned;
    setOtpValues(next);

    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      if (otpValues[index]) {
        const next = [...otpValues];
        next[index] = "";
        setOtpValues(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const next = [...otpValues];
        next[index - 1] = "";
        setOtpValues(next);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (e.key === "Enter" && otp.length === OTP_LENGTH && !loading) {
      verifyOtp();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const chars = pasted.split("");
    const next = Array(OTP_LENGTH).fill("");

    for (let i = 0; i < OTP_LENGTH; i++) {
      next[i] = chars[i] ?? "";
    }

    setOtpValues(next);
    inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
  }

  const canSendOtp = email.trim().length > 0 && !loading;
  const canVerify = otp.length === OTP_LENGTH && !loading;

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 13) % 100}%`,
        top: `${(i * 17) % 100}%`,
        delay: `${(i % 6) * 0.8}s`,
        duration: `${8 + (i % 5)}s`,
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617]">
      <style jsx>{`
        @keyframes bgShift {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(40px, -20px, 0) scale(1.06);
          }
          50% {
            transform: translate3d(-30px, 20px, 0) scale(1.12);
          }
          75% {
            transform: translate3d(20px, 30px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes floatY {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.9;
          }
        }

        @keyframes particle {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 0.65;
          }
          50% {
            transform: translate3d(16px, -28px, 0) scale(1);
            opacity: 0.35;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translate3d(-10px, -56px, 0) scale(0.85);
            opacity: 0;
          }
        }

        @keyframes tiltGlow {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(2deg) scale(1.03);
          }
        }

        .bg-shift {
          animation: bgShift 16s ease-in-out infinite;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 0%,
            rgba(255, 255, 255, 0.18) 20%,
            rgba(255, 255, 255, 0.04) 40%,
            rgba(255, 255, 255, 0.04) 100%
          );
          background-size: 220% 100%;
          animation: shimmer 1.2s linear infinite;
        }

        .float-y {
          animation: floatY 5s ease-in-out infinite;
        }

        .pulse-ring {
          animation: pulseRing 5s ease-in-out infinite;
        }

        .particle {
          animation-name: particle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .tilt-glow {
          animation: tiltGlow 8s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#061733_20%,#082a5e_45%,#5a189a_72%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-80">
        <div className="bg-shift absolute -left-32 -top-32 h-112 w-md rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="bg-shift absolute -right-32 top-[8%] h-96 w-[24rem] rounded-full bg-violet-500/20 blur-3xl [animation-delay:2s]" />
        <div className="bg-shift absolute -bottom-40 left-[12%] h-120 w-120 rounded-full bg-sky-500/20 blur-3xl [animation-delay:4s]" />
        <div className="bg-shift absolute bottom-[5%] right-[10%] h-72 w-[18rem] rounded-full bg-purple-400/15 blur-3xl [animation-delay:1.5s]" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(167,36,228,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.11] bg-[linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-size-[62px_62px]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <span
            key={p.id}
            className="particle absolute h-1.5 w-1.5 rounded-full bg-white/35 blur-[1px]"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div className="relative w-full max-w-lg">
          <div className="pulse-ring absolute inset-0 rounded-[36px] bg-[linear-gradient(135deg,rgba(145,22,161,0.32),rgba(129,33,251,0.18),rgba(8,42,94,0.30))] blur-2xl" />
          <div className="tilt-glow absolute -inset-px rounded-[36px] bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06),rgba(255,255,255,0.14))] opacity-70 blur-sm" />

          <div className="relative overflow-hidden rounded-[36px] border border-white/15 bg-white/8 p-6 shadow-[0_24px_120px_rgba(0,0,0,0.50)] backdrop-blur-2xl sm:p-8">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04)_35%,rgba(255,255,255,0.02)_100%)]" />
            <div className="absolute -left-14 top-14 h-36 w-36 rounded-full bg-fuchsia-400/12 blur-3xl" />
            <div className="absolute -right-10 bottom-12 h-36 w-36 rounded-full bg-sky-400/12 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/45 to-transparent" />

            <div className="relative z-10">
              <div className="mb-7 flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(145,22,161,0.40),rgba(129,33,251,0.22),rgba(59,130,246,0.28))] blur-xl" />
                  <div className="float-y relative flex h-24 w-full items-center justify-center rounded-[28px] border border-white/15 bg-white/10 p-4 ">
                    <Image
                      src={cldPublic("Qmatrix/logo.png", "f_auto,q_auto,w_1000")}
                      alt="Qmatrix Technologies logo"
                      width={72}
                      height={72}
                      className="h-auto w-auto object-contain"
                      priority
                    />
                  </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
Admin
                </h1>
              </div>

              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/10 p-2.5 text-fuchsia-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Secure admin authentication portal
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/60">
                      Sign in using your official admin email and verify with a
                      one-time password.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-white/85">
                    Email address
                  </label>

                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                      <Mail className="h-5 w-5 text-white/40 transition group-focus-within:text-fuchsia-300" />
                    </div>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@Qmatrixtechnologies.in"
                      disabled={loading || step === "OTP"}
                      className="h-14 w-full rounded-2xl border border-white/15 bg-white/8 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-fuchsia-400/70 focus:bg-white/11 focus:ring-4 focus:ring-fuchsia-400/15 disabled:cursor-not-allowed disabled:opacity-70"
                    />
                  </div>
                </div>

                {step === "OTP" && (
                  <div>
                    <div className="mb-2.5 flex items-center justify-between">
                      <label className="block text-sm font-semibold text-white/85">
                        Enter OTP
                      </label>
                      <span className="text-xs text-white/50">
                        6-digit verification code
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      {otpValues.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="h-14 w-12 rounded-2xl border border-white/15 bg-white/8 text-center text-xl font-bold tracking-wider text-white outline-none transition focus:border-fuchsia-400/70 focus:bg-white/[0.14] focus:ring-4 focus:ring-fuchsia-400/15 sm:h-16 sm:w-14"
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={resendOtp}
                        disabled={loading || resendSeconds > 0}
                        className="inline-flex items-center gap-2 font-semibold text-fuchsia-200 transition hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
                      >
                        <RotateCw className="h-4 w-4" />
                        {resendSeconds > 0
                          ? `Resend in ${resendSeconds}s`
                          : "Resend OTP"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStep("EMAIL");
                          setOtpValues(Array(OTP_LENGTH).fill(""));
                          setMsg(null);
                          setMsgType(null);
                        }}
                        className="font-medium text-white/60 transition hover:text-white"
                      >
                        Change email
                      </button>
                    </div>
                  </div>
                )}

                {msg && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      msgType === "success"
                        ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                        : "border-red-400/25 bg-red-400/10 text-red-200"
                    }`}
                  >
                    {msg}
                  </div>
                )}

                {step === "EMAIL" ? (
                  <button
                    type="button"
                    onClick={requestOtp}
                    disabled={!canSendOtp}
                    className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(90deg,#082a5e_0%,#9116a1_45%,#8121fb_100%)] px-4 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(145,22,161,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(145,22,161,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && <span className="shimmer absolute inset-0" />}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {loading ? "Sending OTP..." : "Send OTP"}
                      {!loading && (
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={!canVerify}
                    className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(90deg,#9116a1_0%,#a724e4_50%,#8121fb_100%)] px-4 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(145,22,161,0.25)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(145,22,161,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading && <span className="shimmer absolute inset-0" />}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {loading ? "Verifying..." : "Verify & Login"}
                      {!loading && (
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                      )}
                    </span>
                  </button>
                )}

                <div className="flex items-center justify-center gap-2 pt-1 text-center text-xs leading-5 text-white/45">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Protected admin portal • QMTechnologies secure authentication
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}