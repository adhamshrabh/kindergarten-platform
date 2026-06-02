"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("البريد أو كلمة المرور غير صحيحة");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50"
      style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="bg-white rounded-2xl border border-gray-100 p-8 w-full max-w-sm">
        
        {/* الشعار */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "#EEEDFE" }}>
            <span style={{ color: "#7F77DD", fontSize: 16 }}>✦</span>
          </div>
          <span className="text-sm font-medium" style={{ color: "#3C3489" }}>
            منصة الروضات الذكية
          </span>
        </div>

        <h1 className="text-lg font-medium text-center mb-6" style={{ color: "#1a1a1a" }}>
          تسجيل الدخول
        </h1>

        {/* البريد */}
        <div className="mb-3">
          <label className="text-xs mb-1 block" style={{ color: "#888780" }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ color: "#1a1a1a" }}
            placeholder="example@email.com"
          />
        </div>

        {/* كلمة المرور */}
        <div className="mb-4">
          <label className="text-xs mb-1 block" style={{ color: "#888780" }}>
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
            style={{ color: "#1a1a1a" }}
            placeholder="••••••••"
          />
        </div>

        {/* خطأ */}
        {error && (
          <p className="text-xs mb-3 text-center" style={{ color: "#E24B4A" }}>
            {error}
          </p>
        )}

        {/* زر الدخول */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full text-sm text-white rounded-xl py-2.5"
          style={{ background: loading ? "#B4B2A9" : "#7F77DD" }}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </div>
    </div>
  );
}