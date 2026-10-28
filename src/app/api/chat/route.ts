import { NextRequest, NextResponse } from "next/server";
import { getMentorById } from "@/lib/mentors";
import { getSimulatedResponse } from "@/lib/knowledge";
import { ChatRequest } from "@/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { mentorId, message, history } = body;

    // 参数校验
    if (!mentorId || !message) {
      return NextResponse.json(
        { error: "缺少必要参数：mentorId 或 message" },
        { status: 400 }
      );
    }

    // 获取导师配置
    const mentor = getMentorById(mentorId);
    if (!mentor) {
      return NextResponse.json(
        { error: `未找到导师：${mentorId}` },
        { status: 404 }
      );
    }

    // 检查是否配置了 AI API
    const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    const baseUrl =
      process.env.AI_API_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-3.5-turbo";

    if (apiKey) {
      // 调用 AI API
      try {
        const messages = [
          { role: "system", content: mentor.systemPrompt },
          ...(history || []).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: message },
        ];

        const aiRes = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        if (!aiRes.ok) {
          throw new Error(`AI API 返回错误: ${aiRes.status}`);
        }

        const aiData = await aiRes.json();
        const reply =
          aiData.choices?.[0]?.message?.content ||
          "抱歉，我暂时无法生成回复。";

        return NextResponse.json({ reply, mentorId });
      } catch (aiError) {
        console.error("AI API 调用失败，降级到知识库:", aiError);
        // 降级到知识库回复
        const reply = getSimulatedResponse(mentorId, message);
        return NextResponse.json({ reply, mentorId });
      }
    }

    // 无 API 密钥，使用内置知识库模拟回复
    // 添加短暂延迟模拟思考过程
    await new Promise((resolve) => setTimeout(resolve, 600));

    const reply = getSimulatedResponse(mentorId, message);
    return NextResponse.json({ reply, mentorId });
  } catch (error) {
    console.error("Chat API 错误:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}