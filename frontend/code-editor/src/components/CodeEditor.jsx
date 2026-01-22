import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, readOnly }) {
  const language = "javascript"; // safe default

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
      }}
    />
  );
}



