import Editor from "@monaco-editor/react";

export default function CodeEditor({ value, onChange, readOnly }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
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

