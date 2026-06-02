"use client";

const DAYS = [
  { day: "الأحد",    act: "قصة الأسد",    bg: "#FAECE7", color: "#712B13" },
  { day: "الاثنين",  act: "زراعة البذور",  bg: "#E1F5EE", color: "#085041" },
  { day: "الثلاثاء", act: "فراشة ورق",    bg: "#FBEAF0", color: "#72243E" },
  { day: "الأربعاء", act: "سباق القوارب", bg: "#E6F1FB", color: "#0C447C" },
  { day: "الخميس",   act: null,           bg: "",        color: "" },
];

export default function WeeklyPlanner() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-medium mb-3" style={{ color: "#1a1a1a" }}>
        خطتي الأسبوعية
      </h3>
      <div className="flex gap-2">
        {DAYS.map((d) => (
          <div key={d.day} className="flex-1 flex flex-col gap-1">
            <p className="text-center font-medium" style={{ fontSize: 10, color: "#888780" }}>
              {d.day}
            </p>
            {d.act && (
              <div
                className="rounded-md px-1.5 py-1 text-center"
                style={{ background: d.bg, color: d.color, fontSize: 10, fontWeight: 500 }}
              >
                {d.act}
              </div>
            )}
            <button
              className="w-full h-6 rounded-md border text-gray-300 text-sm"
              style={{ borderStyle: "dashed", borderColor: "#e5e7eb" }}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}