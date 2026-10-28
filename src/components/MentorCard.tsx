"use client";

import Link from "next/link";
import { MentorConfig } from "@/types";

const colorStyles: Record<
  string,
  { bg: string; border: string; text: string; hoverBg: string; chip: string }
> = {
  req: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    hoverBg: "hover:border-blue-400",
    chip: "bg-blue-100 text-blue-700",
  },
  arch: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    hoverBg: "hover:border-purple-400",
    chip: "bg-purple-100 text-purple-700",
  },
  prog: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    hoverBg: "hover:border-green-400",
    chip: "bg-green-100 text-green-700",
  },
  qual: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    hoverBg: "hover:border-orange-400",
    chip: "bg-orange-100 text-orange-700",
  },
};

export default function MentorCard({ mentor }: { mentor: MentorConfig }) {
  const style = colorStyles[mentor.colorKey];

  return (
    <Link
      href={`/mentor/${mentor.id}`}
      className={`group flex flex-col rounded-2xl border-2 ${style.border} ${style.hoverBg} ${style.bg} p-6 transition-all duration-200 hover:shadow-lg`}
    >
      {/* 图标和名称 */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mentor.gradient} text-2xl shadow-md`}
        >
          {mentor.icon}
        </span>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{mentor.name}</h3>
          <p className={`text-xs font-medium ${style.text}`}>
            {mentor.title}
          </p>
        </div>
      </div>

      {/* 描述 */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
        {mentor.description}
      </p>

      {/* 能力标签 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {mentor.capabilities.slice(0, 3).map((cap) => (
          <span
            key={cap}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.chip}`}
          >
            {cap}
          </span>
        ))}
        {mentor.capabilities.length > 3 && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
            +{mentor.capabilities.length - 3}
          </span>
        )}
      </div>

      {/* 进入按钮 */}
      <div
        className={`flex items-center gap-1 text-sm font-semibold ${style.text} transition-transform group-hover:translate-x-1`}
      >
        开始咨询
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}