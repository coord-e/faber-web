import React, { useState, useEffect } from 'react';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Columns } from 'react-bulma-components';

import { Editor } from './Editor';
import { OutputView } from './OutputView';
import { Toolbox } from './Toolbox';
import { endpoint } from './util';

const INITIAL_CODE = `// welcome to faber online compiler
// click "Load an example" to try out faber with some examples
// click "Run" to compile and run your code

name id :: forall a. a -> a
name id x = x

name main :: Int
name main = id 42

// source code: https://github.com/faber-lang
`;

async function run (code, tag, shouldSave) {
  const data = {
    code,
    tag,
    save: shouldSave,
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

  return await resp.json();
}

function changeURLToSave (id) {
  const url = `${window.location.protocol}//${window.location.host}/${id}`;
  window.history.pushState('', '', url);
}

export const App = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [stdout, setStdout] = useState("// standard output will appear here");
  const [stderr, setStderr] = useState("// standard error will appear here");
  const [tag, setTag] = useState("");

  useEffect(() => {
    async function load() {
      const id = window.location.pathname.substr(1);
      if(id) {
        setCode("// restoring...")
        const resp = await fetch(endpoint(`restore/${id}`));
        const data = await resp.json();
        setStdout(data.result.stdout);
        setStderr(data.result.stderr);
        setCode(data.options.code);
        setTag(data.options.tag);
      }
    };
    load();
  }, []);

  const onRun = async (tag, shouldSave) => {
    const {stdout, stderr, id} = await run(code, tag, shouldSave);
    setStdout(stdout);
    setStderr(stderr);

    if(shouldSave) {
      changeURLToSave(id);
    }
  };

  return (
      <Columns>
        <Columns.Column>
            <Editor code={code} onChange={(code, _) => setCode(code)} />
        </Columns.Column>
        <Columns.Column size="one-third">
        <Toolbox initialTag={tag} onLoadExample={setCode} onRun={onRun} />
            <OutputView stdout={stdout} stderr={stderr} />
        </Columns.Column>
      </Columns>
  );
};
