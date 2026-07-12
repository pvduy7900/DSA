import type { ExerciseGuide } from "./types";

const SECTIONS: { key: keyof ExerciseGuide; label: string }[] = [
  { key: "meaning", label: "Ý nghĩa" },
  { key: "definition", label: "Định nghĩa dễ hiểu" },
  { key: "whyLearn", label: "Tại sao cần học?" },
  { key: "analogy", label: "Hình ảnh thực tế" },
  { key: "algorithmSteps", label: "Thuật toán từng bước" },
  { key: "howItWorks", label: "Cách hoạt động sâu hơn" },
  { key: "visualization", label: "Minh họa" },
  { key: "dryRun", label: "Dry-run chi tiết" },
  { key: "codePattern", label: "Code pattern" },
  { key: "bigO", label: "Big O" },
  { key: "bigOWhy", label: "Tại sao Big O như vậy?" },
  { key: "compareApproaches", label: "So sánh cách khác" },
  { key: "commonMistakes", label: "Lỗi thường gặp" },
  { key: "interviewTips", label: "Mẹo phỏng vấn" },
  { key: "notes", label: "Lưu ý khi code" },
];

function GuideSection({ label, content }: { label: string; content: string }) {
  if (!content?.trim()) return null;
  const isCode = content.trimStart().startsWith("export") || content.trimStart().startsWith("class ");

  return (
    <div className="guide-section">
      <h5>{label}</h5>
      {isCode ? (
        <pre className="guide-code">{content}</pre>
      ) : (
        <pre className="guide-text trace">{content.replace(/```/g, "")}</pre>
      )}
    </div>
  );
}

export function GuidePanel({ guide, extras }: { guide: ExerciseGuide; extras: ExerciseGuide[] }) {
  return (
    <div className="guide-panel">
      <div className="guide-header">
        <h3>Giải thích chi tiết</h3>
        <span className="guide-subtitle">{guide.title}</span>
      </div>

      {SECTIONS.map(({ key, label }) => (
        <GuideSection key={key} label={label} content={guide[key] ?? ""} />
      ))}

      {extras.map((extra) => (
        <div key={extra.title} className="guide-extra">
          <h4>📚 {extra.title}</h4>
          {SECTIONS.slice(0, 8).map(({ key, label }) => (
            <GuideSection key={key} label={label} content={extra[key] ?? ""} />
          ))}
        </div>
      ))}
    </div>
  );
}
