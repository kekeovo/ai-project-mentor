import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "智导工坊 - 面向软件工程实践教学的AI项目导师",
  description:
    "智导工坊为软件工程实践教学提供四大AI导师：需求分析导师、软件架构设计导师、开发任务与项目进度导师、项目成果质量检查导师。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}