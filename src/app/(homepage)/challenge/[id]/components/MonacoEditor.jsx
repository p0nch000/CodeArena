'use client';

import Editor from '@monaco-editor/react';

export default function MonacoEditor({ language, value, onChange }) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
      }}
    />
  );
}
