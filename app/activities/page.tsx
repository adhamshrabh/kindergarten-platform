"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ActivityCard from "@/components/activities/ActivityCard";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const FILTERS = ["الكل", "فن وإبداع", "علوم", "حركي", "لغة", "رياضيات", "موسيقى", "قصة"];

async function fetchActivities(category: string, search: string) {
  const params = new URLSearchParams();
  if (category !== "الكل") params.append("category", category);
  if (search) params.append("search", search);

  const res = await fetch(`/api/activities?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [search, setSearch] = useState("");

  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ["activities", selectedCategory, search],
    queryFn: () => fetchActivities(selectedCategory, search),
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />
      
      <main className="flex-1 mr-52 p-4 flex flex-col gap-4">
        <TopBar />

        <div>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#1a1a1a" }}>
            اكتشف الأنشطة
          </h1>

          {/* البحث */}
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="ابحث عن نشاط..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              style={{ color: "#1a1a1a" }}
            />
          </div>

          {/* الفلاتر */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedCategory(f)}
                className="text-xs px-3 py-1 rounded-full border cursor-pointer transition"
                style={{
                  background: selectedCategory === f ? "#7F77DD" : "white",
                  color: selectedCategory === f ? "white" : "#888780",
                  borderColor: selectedCategory === f ? "#7F77DD" : "#e5e7eb",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* الأنشطة */}
          {isLoading ? (
            <p className="text-center text-gray-400">جاري التحميل...</p>
          ) : error ? (
            <p className="text-center text-red-500">حدث خطأ في التحميل</p>
          ) : activities.length === 0 ? (
            <p className="text-center text-gray-400">لا توجد أنشطة</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}