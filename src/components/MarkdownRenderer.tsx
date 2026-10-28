"use client";

import { useMemo } from "react";

// 简易 Markdown 渲染器
const htmlEscapes: Record<string, string> = {
  "&": "&#38;",
  "<": "&#60;",
  ">": "&#62;",
  '"': "&#34;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"]/g, (ch) => htmlEscapes[ch]);
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  // 行内代码
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
  // 加粗
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // 删除线
  result = result.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  return result;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inCodeBlock = false;
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let inTable = false;
  let tableHeaderDone = false;

  const closeList = () => {
    if (inList) {
      html.push(`</${listType}>`);
      inList = false;
    }
  };

  const closeTable = () => {
    if (inTable) {
      html.push("</tbody></table>");
      inTable = false;
      tableHeaderDone = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 代码块
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        html.push("</code></pre>");
        inCodeBlock = false;
      } else {
        closeList();
        closeTable();
        html.push("<pre><code>");
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      html.push(escapeHtml(line) + "\n");
      continue;
    }

    // 空行
    if (line.trim() === "") {
      closeList();
      closeTable();
      continue;
    }

    // 表格
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      closeList();
      const cells = line.trim().slice(1, -1).split("|").map((c) => c.trim());
      // 分隔行
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        tableHeaderDone = true;
        continue;
      }
      if (!inTable) {
        html.push("<table><thead><tr>");
        cells.forEach((c) => html.push(`<th>${renderInline(c)}</th>`));
        html.push("</tr></thead><tbody>");
        inTable = true;
        continue;
      }
      html.push("<tr>");
      cells.forEach((c) => html.push(`<td>${renderInline(c)}</td>`));
      html.push("</tr>");
      continue;
    } else {
      closeTable();
    }

    // 标题
    const h2Match = line.match(/^##\s+(.+)/);
    const h3Match = line.match(/^###\s+(.+)/);
    const h4Match = line.match(/^####\s+(.+)/);
    if (h2Match) {
      closeList();
      html.push(`<h2>${renderInline(h2Match[1])}</h2>`);
      continue;
    }
    if (h3Match) {
      closeList();
      html.push(`<h3>${renderInline(h3Match[1])}</h3>`);
      continue;
    }
    if (h4Match) {
      closeList();
      html.push(`<h4>${renderInline(h4Match[1])}</h4>`);
      continue;
    }

    // 引用
    if (line.trim().startsWith(">")) {
      closeList();
      const content = line.trim().slice(1).trim();
      html.push(`<blockquote>${renderInline(content)}</blockquote>`);
      continue;
    }

    // 无序列表
    const ulMatch = line.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (!inList || listType !== "ul") {
        closeList();
        html.push("<ul>");
        inList = true;
        listType = "ul";
      }
      html.push(`<li>${renderInline(ulMatch[1])}</li>`);
      continue;
    }

    // 有序列表
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== "ol") {
        closeList();
        html.push("<ol>");
        inList = true;
        listType = "ol";
      }
      html.push(`<li>${renderInline(olMatch[1])}</li>`);
      continue;
    }

    // 分隔线
    if (/^[-*_]{3,}$/.test(line.trim())) {
      closeList();
      html.push("<hr />");
      continue;
    }

    // 普通段落
    closeList();
    html.push(`<p>${renderInline(line)}</p>`);
  }

  closeList();
  closeTable();
  if (inCodeBlock) html.push("</code></pre>");

  return html.join("");
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);
  return (
    <div
      className="chat-markdown"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}