import React from 'react';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns, Dropdown, Container, Loader } from 'react-bulma-components';

import './App.css';
import { Editor } from './Editor';
import { OutputView } from './OutputView';
import { Toolbox } from './Toolbox';
import { endpoint } from './util';

class App extends React.Component {
  constructor(props) {
    super(props);
    const id = window.location.pathname.substr(1);

    this.state = {
      code: "// loading an example...\nname main = 0\n",
      stdout: '// press "Run" to compile',
      stderr: '',
      isCompiling: false,
    };

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

  onRun = (tag, save) => async () => {
    const data = {
      code: this.state.code,
      tag: tag,
      save,
    };

    this.setState({
      stdout: "compiling...",
      stderr: "compiling...",
      isCompiling: true,
    });

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
      isCompiling: false,
    });

    if(save) {
      const url = window.location.protocol + "//" + window.location.host + "/" + content.id
      window.history.pushState('', '', url)
    }
  }

  onChangeCode = (code, e) => this.setState({code})

  render() {
    return (
      <Columns>
        <Columns.Column>
            <Editor code={this.state.code} onChange={this.onChangeCode} />
        </Columns.Column>
        <Columns.Column size="one-third">
            <Toolbox onLoadExample={this.onChangeCode} isCompiling={this.state.isCompiling} onRun={this.onRun} />
            <OutputView stdout={this.state.stdout} stderr={this.state.stderr} />
        </Columns.Column>
    </Columns>
    );
  }
}

export default App;
