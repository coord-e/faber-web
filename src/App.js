import React from 'react';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Button, Columns, Dropdown, Container, Loader } from 'react-bulma-components';

import './App.css';
import { Editor } from './Editor';
import { OutputView } from './OutputView';

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
      isCompiling: false,
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

  onRun = save => async () => {
    const data = {
      code: this.state.code,
      tag: this.state.tag,
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
            <Editor code={this.state.code} onChange={this.onChangeCode} />
        </Columns.Column>
        <Columns.Column size="one-third">
            <Container id="toolbox">
                <Container>
                    <Dropdown onChange={this.onChangeTag} value={this.state.tag}>
                        {this.state.tags.map(e => <Dropdown.Item key={e} value={e}>{e}</Dropdown.Item>)}
                    </Dropdown>
                    <Button onClick={this.onRun(false)} disabled={this.state.isCompiling}>Run</Button>
                    <Button onClick={this.onRun(true)} disabled={this.state.isCompiling}>Share</Button>
                </Container>
                <Container>
                    <Dropdown onChange={this.onChangeExample} value={this.state.example}>
                        {this.state.examples.map(e => <Dropdown.Item key={e.name} value={e.url}>{e.name}</Dropdown.Item>)}
                    </Dropdown>
                    <Button onClick={this.onLoadExample}>Load an example</Button>
                </Container>
                <Container>
                    {this.state.isCompiling && <Loader />}
                </Container>
            </Container>
            <OutputView stdout={this.state.stdout} stderr={this.state.stderr} />
        </Columns.Column>
    </Columns>
    );
  }
}

export default App;
