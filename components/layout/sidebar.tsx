"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: "🏠", label: "الرئيسية", href: "/" },
  { icon: "🧭", label: "اكتشف الأنشطة", href: "/activities" },
  { icon: "❤️", label: "أنشطتي", href: "/saved" },
  { icon: "📅", label: "الخطة الأسبوعية", href: "/planner" },
  { icon: "👥", label: "المجموعات", href: "/groups" },
  { icon: "📊", label: "تقارير الأطفال", href: "/reports" },
  { icon: "⚙️", label: "الإعدادات", href: "/settings" },
  { icon: "👶", label: "الأطفال", href: "/children" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 min-h-screen bg-white border-l border-gray-100 flex flex-col p-3 fixed right-0 top-0">
      {/* الشعار */}
      <div className="flex items-center gap-2 px-2 pb-3 mb-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#EEEDFE" }}>
          <span style={{ color: "#7F77DD", fontSize: 14 }}>✦</span>
        </div>
        <span className="text-xs font-medium leading-tight" style={{ color: "#3C3489" }}>
          منصة الروضات الذكية
        </span>
      </div>

      {/* روابط القائمة */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-right w-full transition-colors"
              style={{
                background: isActive ? "#EEEDFE" : "transparent",
                color: isActive ? "#3C3489" : "#888780",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* بطاقة الترقية */}
      <div className="rounded-xl p-3 text-center mt-2" style={{ background: "#EEEDFE" }}>
        <p className="text-xs font-medium mb-1" style={{ color: "#3C3489" }}>ترقية للبريميوم</p>
        <p className="text-xs mb-2" style={{ color: "#534AB7" }}>محتوى إضافي حصري</p>
        <button className="w-full text-xs text-white rounded-full py-1" style={{ background: "#7F77DD" }}>
          ترقية الآن
        </button>
      </div>
    </aside>
  );
}