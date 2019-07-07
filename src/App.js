import React from 'react';
import MonacoEditor from 'react-monaco-editor';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns, Dropdown } from 'react-bulma-components';

const ENDPOINT_BASE = "https://api.faber.coord-e.com/";

const endpoint = (name) => ENDPOINT_BASE + name;

class App extends React.Component {
  constructor(props) {
    super(props);
    const id = window.location.pathname.substr(1);

    this.state = {
      code: "// loading an example...\nname main = 0\n",
      tags: [],
      tag: '',
      examples: [],
      example: '',
      stdout: '// press "Run" to compile',
      stderr: '',
    };

    fetch(endpoint("tags"))
      .then(resp => resp.json())
      .then(data => this.setState({tags: data, tag: data[0]}));

    fetch(endpoint("examples"))
      .then(resp => resp.json())
      .then(data => this.setState({examples: data, example: data[0].url}))
      .then(id ? null : this.onLoadExample)

    if(id) {
      this.state.code = "// loading an saved code"
      fetch(endpoint("restore/"+id))
        .then(resp => resp.json())
        .then(data => this.setState({
          code: data.options.code,
          tag: data.options.tag,
          stdout: data.result.stdout,
          stderr: data.result.stderr,
        }))
    }
  }

  editorDidMount = (editor, monaco) => {
    editor.focus();
  }

  onRun = save => async () => {
    const model = this.refs.monaco.editor.getModel();
    const value = model.getValue();

    const data = {
      code: value,
      tag: this.state.tag,
      save,
    };

    const resp = await fetch(
      endpoint("compile"), {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        body: JSON.stringify(data),
    });
    const content = await resp.json();

    this.setState({
      stdout: content.stdout,
      stderr: content.stderr,
    });

    if(save) {
      const url = window.location.protocol + "//" + window.location.host + "/" + content.id
      window.history.pushState('', '', url)
    }
  }

  onLoadExample = async () => {
    const resp = await fetch(this.state.example)
    const data = await resp.text()

    this.setState({
        code: data
    })
  }

  onChangeCode = (code, e) => this.setState({code})
  onChangeTag = (tag) => this.setState({tag})
  onChangeExample = (example) => this.setState({example})

  render() {
    return (
      <Columns>
        <Columns.Column>
        <MonacoEditor
            width="100%"
            height="100vh"
            theme="vs-dark"
            value={this.state.code}
            options={{}}
            editorDidMount={this.editorDidMount}
            onChange={this.onChangeCode}
            ref="monaco"
        />
        </Columns.Column>
        <Columns.Column>
            <div id="toolbox">
                <Button onClick={this.onRun(false)}>Run</Button>
                <Button onClick={this.onRun(true)}>Share</Button>
                <Dropdown onChange={this.onChangeTag} value={this.state.tag}>
                    {this.state.tags.map(e => <Dropdown.Item key={e} value={e}>{e}</Dropdown.Item>)}
                </Dropdown>
                <Dropdown onChange={this.onChangeExample} value={this.state.example}>
                    {this.state.examples.map(e => <Dropdown.Item key={e.name} value={e.url}>{e.name}</Dropdown.Item>)}
                </Dropdown>
                <Button onClick={this.onLoadExample}>Load an example</Button>
            </div>
            <pre id="stdout">{this.state.stdout}</pre>
            <pre id="stderr">{this.state.stderr}</pre>
        </Columns.Column>
    </Columns>
    );
  }
}

export default App;
