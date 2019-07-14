import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import { registerFaber } from './registerLanguage';

export const Editor = ({code, onChange}) => (
  <MonacoEditor
    width="98%"
    height="100vh"
    theme="vs-dark"
    language="faber"
    value={code}
    options={{}}
    editorDidMount={(editor, _) => editor.focus()}
    editorWillMount={registerFaber}
    onChange={onChange}
  />
);
