"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { createClient } from "@/lib/supabase/client";

async function fetchGroups(teacherId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("groups").select("*").eq("teacher_id", teacherId).is("deleted_at", null);
  return data || [];
}

async function fetchChildren(groupId: string) {
  const res = await fetch(`/api/children?groupId=${groupId}`);
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

export default function ChildrenPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: teacher } = await supabase.from("teachers").select("id").eq("user_id", user.id).single();
      if (teacher) {
        setTeacherId(teacher.id);
        const groups = await fetchGroups(teacher.id);
        if (groups.length > 0) {
          setSelectedGroupId(groups[0].id);
        }
      }
    };
    init();
  }, []);

  const { data: groups = [] } = useQuery({
    queryKey: ["groups", teacherId],
    queryFn: () => (teacherId ? fetchGroups(teacherId) : Promise.resolve([])),
    enabled: !!teacherId,
  });

  const { data: children = [], refetch } = useQuery({
    queryKey: ["children", selectedGroupId],
    queryFn: () => (selectedGroupId ? fetchChildren(selectedGroupId) : Promise.resolve([])),
    enabled: !!selectedGroupId,
  });

  async function handleAddChild() {
    if (!name || !age || !selectedGroupId) return;
    setLoading(true);

    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_id: selectedGroupId,
          name,
          age: parseInt(age),
          gender,
        }),
      });

      if (res.ok) {
        setName("");
        setAge("");
        setGender("");
        setShowForm(false);
        refetch();
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }

  async function handleDeleteChild(id: string) {
    if (!confirm("هل أنت متأكد؟")) return;
    try {
      await fetch(`/api/children?id=${id}`, { method: "DELETE" });
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!teacherId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />
      <main className="flex-1 mr-52 p-4 flex flex-col gap-4">
        <TopBar />
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>الأطفال</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm text-white rounded-lg px-4 py-2"
              style={{ background: "#7F77DD" }}
            >
              + طفل جديد
            </button>
          </div>

          {/* اختيار المجموعة */}
          {groups.length > 0 && (
            <div className="mb-6">
              <label className="text-sm mb-2 block" style={{ color: "#1a1a1a" }}>اختر المجموعة:</label>
              <select
                value={selectedGroupId || ""}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                style={{ color: "#1a1a1a" }}
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* نموذج إضافة طفل */}
          {showForm && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="الاسم"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style={{ color: "#1a1a1a" }}
                />
                <input
                  type="number"
                  placeholder="العمر"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style={{ color: "#1a1a1a" }}
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  style={{ color: "#1a1a1a" }}
                >
                  <option value="">الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddChild}
                    disabled={loading}
                    className="flex-1 text-sm text-white rounded-lg py-2"
                    style={{ background: "#7F77DD" }}
                  >
                    {loading ? "جاري..." : "إضافة"}
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

          {/* قائمة الأطفال */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.length === 0 ? (
              <p className="text-gray-400 text-sm">لا يوجد أطفال</p>
            ) : (
              children.map((child) => (
                <div key={child.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{child.name}</p>
                      <p className="text-xs mt-1" style={{ color: "#888780" }}>العمر: {child.age} سنة</p>
                      <p className="text-xs" style={{ color: "#888780" }}>النوع: {child.gender === "male" ? "ذكر" : "أنثى"}</p>
                    </div>
                    <button onClick={() => handleDeleteChild(child.id)} className="text-xs text-red-600">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}