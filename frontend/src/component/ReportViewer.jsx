// src/components/ReportViewer.jsx
import React, { useMemo } from "react";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";

/**
 * LLM이 반환한 문자열(html 또는 md)을 보기 좋게 렌더링하는 뷰어
 * - HTML: DOMPurify로 sanitize 후 dangerouslySetInnerHTML
 * - Markdown: react-markdown으로 렌더
 * - 공통 타이포그래피/인쇄 스타일 포함
 */
const baseStyles = {
  shell: {
    background: "#fff",
    border: "1px solid #e6e8ef",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
  },
  body: { padding: 20 },
};

/** 간단한 HTML 판별 */
const looksLikeHtml = (s) => typeof s === "string" && /<\s*(h1|html|body|p|ul|ol|div|section|article)/i.test(s);

/** LLM이 전체 문서(<!DOCTYPE…>, <html>…)를 준 경우 바디만 추출 */
const stripOuterDocument = (html) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // head/body가 있으면 body.innerHTML만 사용
    if (doc && doc.body && doc.body.innerHTML) return doc.body.innerHTML;
  } catch {}
  return html;
};

export default function ReportViewer({ content }) {
  const isHtml = useMemo(() => looksLikeHtml(content), [content]);

  const html = useMemo(() => {
    if (!isHtml) return null;
    const clean = stripOuterDocument(content || "");
    return DOMPurify.sanitize(clean, {
      ALLOWED_TAGS: [
        "h1","h2","h3","h4","p","strong","em","u","small","br",
        "ul","ol","li","blockquote","hr","span","div","section","article","sup","sub","code","pre"
      ],
      ALLOWED_ATTR: ["class","style"],
      // 필요 시 스타일 화이트리스트를 좁혀도 됨
    });
  }, [content, isHtml]);

  return (
    <div className="report-viewer" style={baseStyles.shell}>
      {/* 인라인 스타일 + 프린트 스타일 */}
      <style>{`
        .report-viewer * { box-sizing: border-box; }
        .report-viewer .rv-container {
          line-height: 1.68;
          color: #0f172a;
          font-size: 14.5px;
        }
        .report-viewer .rv-container h1 {
          font-size: 22px; margin: 0 0 12px; font-weight: 800; color: #111827;
          padding-bottom: 6px; border-bottom: 1px solid #eef1f6;
        }
        .report-viewer .rv-container h2 {
          font-size: 16px; margin: 18px 0 8px; font-weight: 800; color: #111827;
        }
        .report-viewer .rv-container p { margin: 8px 0; }
        .report-viewer .rv-container ul, .report-viewer .rv-container ol {
          padding-left: 20px; margin: 8px 0;
        }
        .report-viewer .rv-container li { margin: 4px 0; }
        .report-viewer .rv-container blockquote {
          margin: 10px 0; padding: 10px 12px; border-left: 3px solid #c7d2fe;
          background: #f8faff; color:#334155; border-radius: 6px;
        }
        .report-viewer .rv-container hr { border: 0; border-top: 1px solid #edf0f6; margin: 16px 0; }
        .report-viewer .rv-container code, .report-viewer .rv-container pre {
          background:#f6f7fb; border:1px solid #e6e8ef; border-radius:6px; padding:2px 6px;
        }

        /* 인쇄 친화 */
        @media print {
          .report-viewer {
            border: none; box-shadow: none;
          }
        }
      `}</style>

      <div className="rv-container" style={baseStyles.body}>
        {isHtml ? (
          // HTML 경로
          <div dangerouslySetInnerHTML={{ __html: html || "" }} />
        ) : (
          // Markdown 경로
          <ReactMarkdown
            // 필요 시 components로 h1~li까지 커스텀 가능
            components={{
              h1: ({node, ...props}) => <h1 {...props} />,
              h2: ({node, ...props}) => <h2 {...props} />,
            }}
          >
            {content || ""}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
