"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MentorConfig, ChatMessage } from "@/types";
import MarkdownRenderer from "./MarkdownRenderer";

const colorStyles: Record<
  string,
  { userBubble: string; userText: string; quickBtn: string; quickBtnHover: string; sendBtn: string }
> = {
  req: {
    userBubble: "bg-blue-500",
    userText: "text-white",
    quickBtn: "border-blue-200 text-blue-600 bg-blue-50",
    quickBtnHover: "hover:border-blue-400 hover:bg-blue-100",
    sendBtn: "bg-blue-500 hover:bg-blue-600",
  },
  arch: {
    userBubble: "bg-purple-500",
    userText: "text-white",
    quickBtn: "border-purple-200 text-purple-600 bg-purple-50",
    quickBtnHover: "hover:border-purple-400 hover:bg-purple-100",
    sendBtn: "bg-purple-500 hover:bg-purple-600",
  },
  prog: {
    userBubble: "bg-green-500",
    userText: "text-white",
    quickBtn: "border-green-200 text-green-600 bg-green-50",
    quickBtnHover: "hover:border-green-400 hover:bg-green-100",
    sendBtn: "bg-green-500 hover:bg-green-600",
  },
  qual: {
    userBubble: "bg-orange-500",
    userText: "text-white",
    quickBtn: "border-orange-200 text-orange-600 bg-orange-50",
    quickBtnHover: "hover:border-orange-400 hover:bg-orange-100",
    sendBtn: "bg-orange-500 hover:bg-orange-600",
  },
};

export default function ChatInterface({ mentor }: { mentor: MentorConfig }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: mentor.welcomeMessage, timestamp: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const style = colorStyles[mentor.colorKey];

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // 自适应文本框高度
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [input]);

  // 发送消息
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // 添加用户消息
      const userMsg: ChatMessage = {
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        // 构建历史记录（最近 10 条）
        const history = messages
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mentorId: mentor.id,
            message: trimmed,
            history,
          }),
        });

        if (!res.ok) throw new Error("请求失败");

        const data = await res.json();
        const assistantMsg: ChatMessage = {
          role: "assistant",
          content: data.reply,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          role: "assistant",
          content:
            "抱歉，处理你的请求时出现了问题。请检查网络连接后重试。",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, mentor.id]
  );

  // 处理回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // 快捷操作
  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* 消息区域 */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex animate-fade-in-up ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <span
                  className={`mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${mentor.gradient} text-base shadow-sm`}
                >
                  {mentor.icon}
                </span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? `${style.userBubble} ${style.userText} rounded-tr-sm`
                    : "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant" ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {/* 加载动画 */}
          {isLoading && (
            <div className="mb-4 flex justify-start">
              <span
                className={`mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${mentor.gradient} text-base shadow-sm`}
              >
                {mentor.icon}
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200">
                <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
                <span className="typing-dot h-2 w-2 rounded-full bg-slate-400" />
              </div>
            </div>
          )}

          {/* 快捷操作（仅前几条消息时显示） */}
          {messages.length <= 1 && !isLoading && (
            <div className="mt-2 flex flex-wrap gap-2">
              {mentor.quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${style.quickBtn} ${style.quickBtnHover}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`向${mentor.name}提问...（Enter 发送，Shift+Enter 换行）`}
              rows={1}
              className="custom-scrollbar flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${style.sendBtn}`}
              aria-label="发送"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}