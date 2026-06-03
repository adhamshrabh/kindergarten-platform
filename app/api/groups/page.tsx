"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

async function fetchGroups() {
  const res = await fetch("/api/groups");
  return res.json();
}

export default function GroupsPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: groups = [], refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  async function handleCreateGroup() {
    if (!name || !ageMin || !ageMax) return;
    setLoading(true);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age_min: parseInt(ageMin),
          age_max: parseInt(ageMax),
        }),
      });

      if (res.ok) {
        setName("");
        setAgeMin("");
        setAgeMax("");
        setShowForm(false);
        refetch();
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
    setLoading(false);
  }

  async function handleDeleteGroup(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه المجموعة؟")) return;

    try {
      await fetch(`/api/groups?id=${id}`, { method: "DELETE" });
      refetch();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />

      <main className="flex-1 mr-52 p-4 flex flex-col gap-4">
        <TopBar />

        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>
              مجموعاتي
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm text-white rounded-lg px-4 py-2"
              style={{ background: "#7F77DD" }}
            >
              + مجموعة جديدة
            </button>
          </div>

          {/* نموذج إنشاء مجموعة */}
          {showForm && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
              <p className="text-sm font-medium mb-4" style={{ color: "#1a1a1a" }}>
                إنشاء مجموعة جديدة
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="اسم المجموعة"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style={{ color: "#1a1a1a" }}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="العمر الأدنى"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    style={{ color: "#1a1a1a" }}
                  />
                  <input
                    type="number"
                    placeholder="العمر الأقصى"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    style={{ color: "#1a1a1a" }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateGroup}
                    disabled={loading}
                    className="flex-1 text-sm text-white rounded-lg py-2"
                    style={{ background: "#7F77DD" }}
                  >
                    {loading ? "جاري..." : "إنشاء"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 text-sm border border-gray-200 rounded-lg py-2"
                    style={{ color: "#888780" }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* قائمة المجموعات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.length === 0 ? (
              <p className="text-gray-400 text-sm">لا توجد مجموعات حتى الآن</p>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>
                        {group.name}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#888780" }}>
                        {group.age_min}–{group.age_max} سنة
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      حذف
                    </button>
                  </div>
                  <p className="text-xs" style={{ color: "#B4B2A9" }}>
                    أنشئت: {new Date(group.created_at).toLocaleDateString("ar-SA")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
