"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Child {
  id: string;
  name: string;
  age_months: number;
}

interface DailyMoment {
  id: string;
  caption: string;
  photo_url: string;
  moment_date: string;
}

interface ActivityLog {
  id: string;
  activity_name: string;
  duration_minutes: number;
  notes: string;
  date: string;
}

export default function ParentDashboard() {
  const [child, setChild] = useState<Child | null>(null);
  const [moments, setMoments] = useState<DailyMoment[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"home" | "activities" | "messages">("home");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/parent/login"); return; }

      const { data: access } = await supabase
        .from("parent_access")
        .select("*, child:children(*)")
        .eq("parent_email", user.email)
        .is("deleted_at", null)
        .single();

      if (access?.child) {
        setChild(access.child);

        const { data: m } = await supabase
          .from("daily_moments")
          .select("*")
          .eq("child_id", access.child.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(5);
        setMoments(m || []);

        const { data: l } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("child_id", access.child.id)
          .is("deleted_at", null)
          .order("date", { ascending: false })
          .limit(10);
        setLogs(l || []);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p style={{ color: "#888780" }}>جاري التحميل...</p>
    </div>
  );

  if (!child) return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-4xl mb-3">😕</div>
        <p className="text-sm" style={{ color: "#888780" }}>لم يتم العثور على بيانات طفلك</p>
        <p className="text-xs mt-1" style={{ color: "#B4B2A9" }}>تواصل مع معلمة الروضة لتفعيل حسابك</p>
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen pb-20" style={{ background: "#F8F7FF", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div className="px-4 pt-8 pb-4" style={{ background: "linear-gradient(135deg, #7F77DD 0%, #534AB7 100%)" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-purple-200 mb-1">مرحباً بك 👋</p>
            <h1 className="text-lg font-bold text-white">طفلك اليوم</h1>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
            style={{ background: "rgba(255,255,255,0.2)" }}>
            👨‍👩‍👧
          </div>
        </div>

        {/* بطاقة الطفل */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ background: "#EEEDFE" }}>
              🧒
            </div>
            <div>
              <h2 className="font-bold" style={{ color: "#1a1a1a" }}>{child.name}</h2>
              <p className="text-xs" style={{ color: "#888780" }}>
                {Math.floor(child.age_months / 12)} سنوات و {child.age_months % 12} أشهر
              </p>
            </div>
            <div className="mr-auto">
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "#E1F5EE", color: "#085041" }}>
                ✓ حاضر اليوم
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">

        {activeTab === "home" && (
          <div className="space-y-4">

            {/* لحظات اليوم */}
            {moments.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#1a1a1a" }}>
                  ✨ لحظات اليوم
                </h3>
                <div className="space-y-3">
                  {moments.map(m => (
                    <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <div className="flex gap-3 items-start">
                        <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-purple-50 flex items-center justify-center">
                          {m.photo_url
                            ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" />
                            : <span className="text-2xl">📸</span>
                          }
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{m.caption}</p>
                          <p className="text-xs mt-1" style={{ color: "#B4B2A9" }}>{m.moment_date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* آخر نشاط */}
            {logs.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3" style={{ color: "#1a1a1a" }}>
                  📚 آخر الأنشطة
                </h3>
                <div className="space-y-2">
                  {logs.slice(0, 3).map(log => (
                    <div key={log.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: "#EEEDFE" }}>
                        🎨
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{log.activity_name}</p>
                        {log.notes && <p className="text-xs" style={{ color: "#888780" }}>{log.notes}</p>}
                      </div>
                      <span className="text-xs" style={{ color: "#B4B2A9" }}>{log.duration_minutes} د</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {moments.length === 0 && logs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🌟</div>
                <p className="text-sm" style={{ color: "#888780" }}>لا توجد تحديثات بعد اليوم</p>
                <p className="text-xs mt-1" style={{ color: "#B4B2A9" }}>ستصلك اللحظات والأنشطة قريباً</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activities" && (
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#1a1a1a" }}>سجل الأنشطة</h3>
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{ background: "#EEEDFE" }}>🎨</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{log.activity_name}</p>
                      <p className="text-xs" style={{ color: "#B4B2A9" }}>{log.date}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "#E1F5EE", color: "#085041" }}>
                      ✓ منجز
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-xs mt-2 pr-11" style={{ color: "#888780" }}>{log.notes}</p>
                  )}
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: "#888780" }}>لا توجد أنشطة مسجلة بعد</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm" style={{ color: "#888780" }}>الرسائل قادمة قريباً</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-100 flex">
        {[
          { id: "home", icon: "🏠", label: "الرئيسية" },
          { id: "activities", icon: "📚", label: "الأنشطة" },
          { id: "messages", icon: "💬", label: "الرسائل" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-1"
            style={{ color: activeTab === tab.id ? "#7F77DD" : "#B4B2A9" }}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}