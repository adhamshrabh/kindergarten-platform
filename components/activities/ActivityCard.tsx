"use client";

interface Activity {
  name: string;
  cat: string;
  bg: string;
  color: string;
  icon: string;
  dur: string;
  age: string;
  ai?: boolean;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div
      className="rounded-xl overflow-hidden border cursor-pointer"
      style={{
        borderColor: activity.ai ? "#7F77DD" : "#f0f0f0",
        borderWidth: activity.ai ? 1.5 : 1,
      }}
    >
      <div
        className="h-14 flex items-center justify-center relative text-3xl"
        style={{ background: activity.bg }}
      >
        {activity.icon}
        <span
          className="absolute bottom-1 left-1 text-white text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.4)", fontSize: 10 }}
        >
          {activity.dur} د
        </span>
      </div>
      <div className="p-2 bg-white">
        <p className="text-xs font-medium mb-1" style={{ color: "#1a1a1a" }}>
          {activity.name}
        </p>
        <div className="flex gap-1 mb-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: activity.bg, color: activity.color, fontSize: 10 }}
          >
            {activity.cat}
          </span>
          {activity.ai && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#EEEDFE", color: "#3C3489", fontSize: 10 }}
            >
              AI
            </span>
          )}
        </div>
        <p className="text-xs" style={{ color: "#B4B2A9", fontSize: 10 }}>
          {activity.age} سنوات
        </p>
      </div>
    </div>
  );
}