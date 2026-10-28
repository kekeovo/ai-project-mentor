// 聊天消息
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// 快捷操作
export interface QuickAction {
  label: string;
  prompt: string;
}

// 导师配色键
export type MentorColorKey = "req" | "arch" | "prog" | "qual";

// 导师配置
export interface MentorConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  colorKey: MentorColorKey;
  gradient: string;
  systemPrompt: string;
  capabilities: string[];
  quickActions: QuickAction[];
  stages: { name: string; description: string }[];
  welcomeMessage: string;
}

// API 请求
export interface ChatRequest {
  mentorId: string;
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

// API 响应
export interface ChatResponse {
  reply: string;
  mentorId: string;
}