"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

async function fetchActivities() {
  const res = await fetch(`/api/activities`);
  return res.json();
}

async function fetchWeeklyPlans(groupId: string) {
  const res = await fetch(`/api/weekly-plans?groupId=${groupId}`);
  return res.json();
}

async function getTeacherId() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("teachers").select("id").eq("user_id", user.id).single();
  if (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
  return data?.id;
}

async function getGroupId(teacherId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("groups").select("id").eq("teacher_id", teacherId).limit(1).single();
  if (error) {
    console.error("Error fetching group:", error);
    return null;
  }
  return data?.id;
}

export default function PlannerPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [draggedActivity, setDraggedActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // الحصول على teacher_id و group_id
  useEffect(() => {
    const init = async () => {
      try {
        const tid = await getTeacherId();
        if (tid) {
          setTeacherId(tid);
          const gid = await getGroupId(tid);
          if (gid) {
            setGroupId(gid);
          } else {
            console.warn("No group found for teacher");
          }
        }
      } catch (error) {
        console.error("Error initializing:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
  });

  const { data: plans = [], refetch } = useQuery({
    queryKey: ["weekly-plans", groupId],
    queryFn: () => fetchWeeklyPlans(groupId || ""),
    enabled: !!groupId,
  });

  const handleDragStart = (activity: any) => {
    setDraggedActivity(activity);
  };

  const handleDropOnDay = async (dayOfWeek: number) => {
    if (!draggedActivity || !teacherId || !groupId) return;

    try {
      const res = await fetch("/api/weekly-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacher_id: teacherId,
          group_id: groupId,
          activity_id: draggedActivity.id,
          day_of_week: dayOfWeek,
          week_number: 1,
        }),
      });
      
      if (res.ok) {
        setDraggedActivity(null);
        refetch();
      }
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">جاري التحميل...</p>
      </div>
    );
  }

  if (!teacherId || !groupId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">لم يتم العثور على البيانات</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sidebar />
      
      <main className="flex-1 mr-52 p-4 flex flex-col gap-4">
        <TopBar />

        <div>
          <h1 className="text-2xl font-bold mb-6" style={{ color: "#1a1a1a" }}>
            خطتي الأسبوعية
          </h1>

          <div className="flex gap-6">
            {/* قائمة الأنشطة */}
            <div className="w-52 bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-medium mb-3" style={{ color: "#1a1a1a" }}>
                الأنشطة المتاحة
              </p>
              <div className="space-y-2">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    draggable
                    onDragStart={() => handleDragStart(activity)}
                    className="p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 text-xs"
                    style={{ color: "#1a1a1a" }}
                  >
                    {activity.name}
                  </div>
                ))}
              </div>
            </div>

            {/* جدول الأسبوع */}
            <div className="flex-1 grid grid-cols-5 gap-2">
              {DAYS.map((day, index) => (
                <div
                  key={day}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropOnDay(index)}
                  className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-4 min-h-96 hover:bg-gray-50 transition"
                >
                  <p className="font-medium text-center mb-4" style={{ color: "#1a1a1a" }}>
                    {day}
                  </p>
                  <div className="space-y-2">
                    {plans
                      .filter((plan) => plan.day_of_week === index)
                      .map((plan) => {
                        const activity = activities.find((a) => a.id === plan.activity_id);
                        return (
                          <div
                            key={plan.id}
                            className="p-2 bg-purple-100 rounded-lg text-xs"
                            style={{ color: "#3C3489" }}
                          >
                            {activity?.name}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}