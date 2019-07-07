import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns } from 'react-bulma-components';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '// type your code...',
      stdout: '',
      stderr: '',
    }
    this.onChange = this.onChange.bind(this)
    this.editorDidMount = this.editorDidMount.bind(this)
  }
  editorDidMount(editor, monaco) {
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }
  render() {
    const code = this.state.code;
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <Columns>
        <Columns.Column>
        <MonacoEditor
            width="100%"
            height="100vh"
            language="javascript"
            theme="vs-dark"
            value={code}
            options={options}
            onChange={this.onChange}
            editorDidMount={this.editorDidMount}
        />
        </Columns.Column>
        <Columns.Column>
            <div id="toolbox">
                <Button>Run</Button>
            </div>
            <div id="stdout">{this.state.stdout}</div>
            <div id="stderr">{this.state.stderr}</div>
        </Columns.Column>
    </Columns>
    );
  }
}

export default App;
