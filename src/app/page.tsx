import Link from "next/link";
import { mentors } from "@/lib/mentors";
import MentorCard from "@/components/MentorCard";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero 区域 */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -top-16 right-1/4 h-48 w-48 rounded-full bg-purple-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            AI 驱动的软件工程实践教学平台
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            智导工坊
          </h1>
          <p className="mb-2 text-lg font-medium text-slate-600">
            面向软件工程实践教学的 AI 项目导师
          </p>
          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-500">
            从需求分析到质量验收，四位专业 AI 导师全程陪伴你的软件项目实践。
            覆盖软件工程完整生命周期，让每一个项目都有专业指导。
          </p>

          {/* 生命周期流程 */}
          <div className="mx-auto mb-12 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-400">
            {["需求分析", "架构设计", "开发管理", "质量检查"].map(
              (stage, i) => (
                <span key={stage} className="flex items-center gap-2">
                  <span className="rounded-lg bg-white px-3 py-1.5 text-slate-600 shadow-sm ring-1 ring-slate-200">
                    {stage}
                  </span>
                  {i < 3 && (
                    <svg
                      className="h-4 w-4 text-slate-300"
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
                  )}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* 四大导师 */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-800">
            四大专业导师
          </h2>
          <p className="text-sm text-slate-500">
            每位导师都拥有专属知识库和教学策略，点击卡片开始对话
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>
      </section>

      {/* 使用指南 */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">
            如何使用
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "选择导师",
                desc: "根据你当前所处的项目阶段，选择对应的 AI 导师",
                icon: "🎯",
              },
              {
                step: "2",
                title: "开始对话",
                desc: "描述你的项目情况或点击快捷操作，导师会给出专业指导",
                icon: "💬",
              },
              {
                step: "3",
                title: "落地实践",
                desc: "根据导师建议完成工作，随时回来获取下一步指导",
                icon: "🚀",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center"
              >
                <span className="mb-3 block text-3xl">{item.icon}</span>
                <span className="absolute right-4 top-4 text-4xl font-bold text-slate-200">
                  {item.step}
                </span>
                <h3 className="mb-2 text-base font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-slate-200 bg-slate-900 py-8 text-center">
        <p className="text-sm text-slate-400">
          智导工坊 — 面向软件工程实践教学的 AI 项目导师
        </p>
        <p className="mt-1 text-xs text-slate-500">
          支持配置 AI API 获得更深入的个性化指导 · 未配置时使用内置知识库
        </p>
      </footer>
    </main>
  );
}