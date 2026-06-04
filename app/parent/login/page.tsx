"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ParentLoginPage() {
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      // البحث عن الطفل والتحقق من الولي الأمر
      const { data: parentAccess, error: err } = await supabase
        .from("parent_access")
        .select("*, child:children(name)")
        .eq("parent_email", email)
        .is("deleted_at", null)
        .single();

      if (err || !parentAccess) {
        setError("البريد الإلكتروني غير مسجل");
        setLoading(false);
        return;
      }

      // Magic Link عبر Supabase Auth
      const { error: signError } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (signError) {
        setError("خطأ في إرسال الرابط");
      } else {
        router.push("/parent/verify-email");
      }
    } catch (err) {
      setError("حدث خطأ ما");
    }
    setLoading(false);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#FF6B35" }}>
            <span className="text-3xl">👨‍👩‍👧</span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
            بوابة الأهل
          </h1>
          <p className="text-sm" style={{ color: "#888780" }}>
            تابع أنشطة طفلك يومياً
          </p>
        </div>

        {/* النموذج */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "#1a1a1a" }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="أم_احمد@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                style={{ color: "#1a1a1a" }}
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-sm font-medium text-white rounded-lg py-3 transition-all"
              style={{
                background: loading ? "#B4B2A9" : "#FF6B35",
              }}
            >
              {loading ? "جاري الإرسال..." : "📧 أرسل رابط الدخول"}
            </button>
          </div>
        </div>

        {/* النص السفلي */}
        <p className="text-center text-xs mt-4" style={{ color: "#888780" }}>
          سيتم إرسال رابط تسجيل دخول آمن إلى بريدك
        </p>
      </div>
    </div>
  );
}