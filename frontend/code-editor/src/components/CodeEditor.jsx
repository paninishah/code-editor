import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, readOnly }) {
  return (
    <Editor
      height="100%"
      language="c"
      theme="notebook-dark"
      value={value}
      onChange={(val) => onChange(val)}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        fontFamily: "IBM Plex Mono, monospace",
        padding: { top: 16, bottom: 16 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        cursorStyle: "line",
        cursorBlinking: "smooth",
      }}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("notebook-dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "6A9955" },
            { token: "string", foreground: "CE9178" },
            { token: "keyword", foreground: "C586C0" },
            { token: "number", foreground: "B5CEA8" },
          ],
          colors: {
            "editor.background": "#0b0b0b",
            "editorLineNumber.foreground": "#3a3a3a",
            "editorCursor.foreground": "#4CAF50",
            "editor.selectionBackground": "#264f78",
            "editor.lineHighlightBackground": "#111111",
          },
        });
      }}
    />
  );
}
