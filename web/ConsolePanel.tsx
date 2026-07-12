import type { ConsoleLine } from "./types";

function lineClass(type: ConsoleLine["type"]) {
  if (type === "error") return "console-error";
  if (type === "warn") return "console-warn";
  if (type === "info") return "console-info";
  if (type === "debug") return "console-debug";
  return "console-log";
}

export function ConsolePanel({
  lines,
  onClear,
  hasRun,
}: {
  lines: ConsoleLine[];
  onClear?: () => void;
  hasRun?: boolean;
}) {
  if (!lines.length) {
    return (
      <section className="panel console-panel">
        <div className="console-header">
          <h3>Console</h3>
          <span className="console-hint">Dùng nút Run để xem console.log()</span>
        </div>
        <pre className="console-body empty">
          {hasRun
            ? "// Không có output — thử thêm console.log() vào function"
            : `// Viết console.log(...) trong solution\n// Nhập input và click "Run" để xem output`}
        </pre>
      </section>
    );
  }

  return (
    <section className="panel console-panel">
      <div className="console-header">
        <h3>Console</h3>
        {onClear && (
          <button className="btn ghost console-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <pre className="console-body">
        {lines.map((line, index) => (
          <div key={`${index}-${line.text}`} className={`console-line ${lineClass(line.type)}`}>
            {line.text || "\u00A0"}
          </div>
        ))}
      </pre>
    </section>
  );
}
