import React from 'react';
import MonacoEditor from 'react-monaco-editor';

export const Editor = ({code, onChange}) => (
    <MonacoEditor
      width="98%"
      height="100vh"
      theme="vs-dark"
      language="none"
      value={code}
      options={{}}
      editorDidMount={(editor, _) => editor.focus()}
      onChange={onChange}
    />
)
