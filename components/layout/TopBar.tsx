"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="bg-white rounded-xl border border-gray-100 px-4 py-2 flex items-center gap-3">
      <div className="flex items-center gap-2 mr-auto">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
          style={{ background: "#EEEDFE", color: "#3C3489" }}>
          ف
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "#1a1a1a" }}>
            مرحباً، فاطمة
          </p>
          <p className="text-xs" style={{ color: "#888780" }}>
            معلمة — روضة الإبداع
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-1 max-w-xs bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
        <span className="text-gray-400 text-xs">🔍</span>
        <span className="text-xs" style={{ color: "#B4B2A9" }}>ابحث عن نشاط...</span>
      </div>
      <button
        onClick={handleLogout}
        className="text-xs px-3 py-1.5 rounded-lg border"
        style={{ color: "#888780", borderColor: "#e5e7eb" }}>
        خروج
      </button>
    </header>
  );
}