import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import ActivityCard from "@/components/activities/ActivityCard";
import WeeklyPlanner from "@/components/planner/WeeklyPlanner";

const ACTIVITIES = [
  { name: "سباق القوارب",      cat: "حركي",          bg: "#E6F1FB", color: "#0C447C", icon: "🏃", dur: "20", age: "4–5" },
  { name: "زراعة البذور",      cat: "علوم",           bg: "#E1F5EE", color: "#085041", icon: "🌱", dur: "30", age: "5–6" },
  { name: "فراشة من الورق",    cat: "فن وإبداع",      bg: "#FBEAF0", color: "#72243E", icon: "🦋", dur: "25", age: "3–5", ai: true },
  { name: "قصة الأسد الشجاع", cat: "قصة تفاعلية",    bg: "#FAECE7", color: "#712B13", icon: "🦁", dur: "15", age: "4–5" },
];

const FILTERS = ["الكل", "فن وإبداع", "علوم", "حركي", "لغة", "رياضيات"];

const QUICK_TOOLS = [
  { icon: "🏃", label: "نشاط حركي", bg: "#E6F1FB" },
  { icon: "📖", label: "قصة",        bg: "#FAECE7" },
  { icon: "📄", label: "ورقة عمل",  bg: "#EAF3DE" },
  { icon: "🎮", label: "ألعاب",      bg: "#EEEDFE" },
];

const STATS = [
  { label: "أنشطة هذا الأسبوع", val: "4" },
  { label: "أنشطة محفوظة",      val: "12" },
  { label: "أطفال في المجموعة", val: "18" },
];

export default function Dashboard() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />

      <main className="flex-1 mr-52 p-4 flex flex-col gap-4">
        <TopBar />

        <div className="flex gap-4">
          {/* العمود الرئيسي */}
          <div className="flex-1 flex flex-col gap-4">

            {/* بانر AI */}
            <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: "#EEEDFE" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "#7F77DD" }}>
                🤖
              </div>
              <div className="flex-1">
                <h2 className="font-medium mb-1" style={{ fontSize: 15, color: "#3C3489" }}>
                  أنشئ نشاطاً في ثوانٍ!
                </h2>
                <p className="text-xs mb-3" style={{ color: "#534AB7" }}>
                  أخبر الذكاء الاصطناعي بالموضوع والعمر وسنبني النشاط لك
                </p>
                <button className="text-xs text-white rounded-full px-4 py-1.5"
                  style={{ background: "#7F77DD" }}>
                  ✨ إنشاء نشاط جديد
                </button>
              </div>
            </div>

            {/* مكتبة الأنشطة */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="text-sm font-medium mb-3" style={{ color: "#1a1a1a" }}>اكتشف الأنشطة</h3>
              <div className="flex gap-2 mb-4 flex-wrap">
                {FILTERS.map((f, i) => (
                  <span key={f} className="text-xs px-3 py-1 rounded-full border cursor-pointer"
                    style={{
                      background: i === 0 ? "#7F77DD" : "white",
                      color: i === 0 ? "white" : "#888780",
                      borderColor: i === 0 ? "#7F77DD" : "#e5e7eb",
                    }}>
                    {f}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {ACTIVITIES.map((act) => (
                  <ActivityCard key={act.name} activity={act} />
                ))}
              </div>
            </div>

            <WeeklyPlanner />
          </div>

          {/* العمود الجانبي */}
          <div className="w-52 flex flex-col gap-3">

            {/* أدوات سريعة */}
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-medium mb-2" style={{ color: "#888780" }}>أدوات سريعة</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_TOOLS.map((t) => (
                  <button key={t.label}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg border border-gray-100">
                    <div className="w-7 h-7 rounded-md flex items-center justify-center text-base"
                      style={{ background: t.bg }}>
                      {t.icon}
                    </div>
                    <span style={{ fontSize: 10, color: "#444441" }}>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* نصيحة اليوم */}
            <div className="rounded-xl p-3" style={{ background: "#FAEEDA" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#633806" }}>💡 نصيحة اليوم</p>
              <p className="text-xs leading-relaxed" style={{ color: "#854F0B" }}>
                التعلم باللعب هو أفضل طريقة لتنمية مهارات الأطفال في هذه المرحلة.
              </p>
            </div>

            {/* إحصائيات */}
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs font-medium mb-2" style={{ color: "#888780" }}>إحصائيات سريعة</p>
              {STATS.map((s) => (
                <div key={s.label}
                  className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs" style={{ color: "#888780" }}>{s.label}</span>
                  <span className="text-xs font-medium" style={{ color: "#1a1a1a" }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}