"use client";
export default function VerifyEmailPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-xl font-bold mb-2" style={{ color: "#1a1a1a" }}>تفقد بريدك الإلكتروني</h1>
        <p className="text-sm" style={{ color: "#888780" }}>أرسلنا لك رابط دخول آمن — اضغط عليه للدخول</p>
      </div>
    </div>
  );
}