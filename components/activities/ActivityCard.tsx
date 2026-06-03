"use client";

import { useState } from "react";

interface Activity {
  id: string;
  name: string;
  category: string;
  duration: number;
  age_min: number;
  age_max: number;
  description?: string;
  is_system?: boolean;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    try {
      if (saved) {
        await fetch(`/api/saved-activities?activityId=${activity.id}`, { 
          method: "DELETE" 
        });
        setSaved(false);
      } else {
        await fetch(`/api/saved-activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityId: activity.id }),
        });
        setSaved(true);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
    setLoading(false);
  }

  // اختر لون عشوائي بناءً على الفئة
  const categoryColors: Record<string, { bg: string; color: string }> = {
    "حركي": { bg: "#E6F1FB", color: "#0C447C" },
    "علوم": { bg: "#E1F5EE", color: "#085041" },
    "فن وإبداع": { bg: "#FBEAF0", color: "#72243E" },
    "قصة تفاعلية": { bg: "#FAECE7", color: "#712B13" },
    "موسيقى": { bg: "#F3E5F5", color: "#6A1B9A" },
    "منطق": { bg: "#E8F5E9", color: "#2E7D32" },
    "لغة": { bg: "#FCE4EC", color: "#C2185B" },
    "رياضيات": { bg: "#E0F2F1", color: "#00695C" },
  };

  const colors = categoryColors[activity.category] || { bg: "#F5F5F5", color: "#666" };

  return (
    <div
      className="rounded-xl overflow-hidden border cursor-pointer hover:shadow-md transition"
      style={{
        borderColor: activity.is_system ? "#7F77DD" : "#f0f0f0",
        borderWidth: activity.is_system ? 1.5 : 1,
      }}
    >
      {/* رأس البطاقة */}
      <div
        className="h-20 flex items-center justify-center relative text-center p-2"
        style={{ background: colors.bg }}
      >
        <p className="text-xs font-medium" style={{ color: colors.color }}>
          {activity.name}
        </p>
        <span
          className="absolute bottom-1 left-1 text-white text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", fontSize: 10 }}
        >
          {activity.duration} د
        </span>
      </div>

      {/* تفاصيل البطاقة */}
      <div className="p-2 bg-white">
        <p className="text-xs font-medium mb-1" style={{ color: "#1a1a1a" }}>
          {activity.name}
        </p>
        
        {/* الفئة والـ AI Badge */}
        <div className="flex gap-1 mb-2 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.color, fontSize: 10 }}
          >
            {activity.category}
          </span>
          {activity.is_system && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 10 }}
            >
              نظام
            </span>
          )}
        </div>

        {/* العمر والزر */}
        <div className="flex justify-between items-center">
          <p className="text-xs" style={{ color: "#B4B2A9", fontSize: 10 }}>
            {activity.age_min}–{activity.age_max} سنة
          </p>
          <button
            onClick={handleSave}
            disabled={loading}
            className="text-lg px-2 py-1 rounded transition hover:scale-110"
            style={{
              background: saved ? "#7F77DD" : "white",
              color: saved ? "white" : "#E24B4A",
              border: `1px solid ${saved ? "#7F77DD" : "#e5e7eb"}`,
              cursor: loading ? "wait" : "pointer",
            }}
            title={saved ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          >
            {saved ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  );
}