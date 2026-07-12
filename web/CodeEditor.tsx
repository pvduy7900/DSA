import Editor, { type OnMount } from "@monaco-editor/react";
import { useCallback, useRef } from "react";
import type { editor } from "monaco-editor";

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: '"SF Mono", "Fira Code", Consolas, monospace',
  tabSize: 2,
  insertSpaces: true,
  detectIndentation: false,
  formatOnPaste: true,
  formatOnType: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: "on",
  lineNumbers: "on",
  renderWhitespace: "selection",
  bracketPairColorization: { enabled: true },
  padding: { top: 12, bottom: 12 },
  scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
};

export function CodeEditor({
  value,
  onChange,
  fileName,
  onFormatRef,
}: {
  value: string;
  onChange: (value: string) => void;
  fileName: string;
  onFormatRef?: (format: () => void) => void;
}) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const formatRef = useRef<() => void>(() => {});

  const formatCode = useCallback(() => {
    void editorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  formatRef.current = formatCode;

  const handleMount: OnMount = (editorInstance, monaco) => {
    editorRef.current = editorInstance;
    onFormatRef?.(() => formatRef.current());

    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      void formatRef.current();
    });
  };

  return (
    <div className="code-editor-wrap">
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        path={fileName}
        value={value}
        onChange={(next) => onChange(next ?? "")}
        onMount={handleMount}
        options={EDITOR_OPTIONS}
      />
    </div>
  );
}
