import { notFound } from "next/navigation";
import { getMentorById } from "@/lib/mentors";
import ChatInterface from "@/components/ChatInterface";

// 预生成所有导师页面
export function generateStaticParams() {
  return [
    { id: "requirements" },
    { id: "architecture" },
    { id: "progress" },
    { id: "quality" },
  ];
}

const stageColors: Record<string, string> = {
  req: "bg-blue-500",
  arch: "bg-purple-500",
  prog: "bg-green-500",
  qual: "bg-orange-500",
};

const stageTextColors: Record<string, string> = {
  req: "text-blue-600",
  arch: "text-purple-600",
  prog: "text-green-600",
  qual: "text-orange-600",
};

export default function MentorPage({
  params,
}: {
  params: { id: string };
}) {
  const mentor = getMentorById(params.id);

  if (!mentor) {
    notFound();
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* 导师信息栏 */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mentor.gradient} text-xl shadow-md`}
              >
                {mentor.icon}
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-800">
                  {mentor.name}
                </h1>
                <p className={`text-xs ${stageTextColors[mentor.colorKey]}`}>
                  {mentor.title}
                </p>
              </div>
            </div>

            {/* 指导阶段 */}
            <div className="hidden items-center gap-1 sm:flex">
              {mentor.stages.map((stage, i) => (
                <div key={stage.name} className="flex items-center gap-1">
                  <div className="group relative">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${stageColors[mentor.colorKey]} text-[10px] font-bold text-white`}
                    >
                      {i + 1}
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white group-hover:block">
                      {stage.name}
                    </span>
                  </div>
                  {i < mentor.stages.length - 1 && (
                    <span className="h-px w-3 bg-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 聊天界面 */}
      <ChatInterface mentor={mentor} />
    </div>
  );
}