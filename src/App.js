import React, { useState, useEffect } from 'react';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import { Columns } from 'react-bulma-components';

import { Editor } from './Editor';
import { OutputView } from './OutputView';
import { Toolbox } from './Toolbox';
import { endpoint } from './util';

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
  window.history.pushstate('', '', url);
}

export const App = () => {
  const [code, setCode] = useState("init");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");

  useEffect(() => {
    async function load() {
      const id = window.location.pathname.substr(1);
      if(id) {
        const resp = await fetch(endpoint(`restore/${id}`));
        const data = await resp.json();
        // TODO: use data.options.tag
        setStdout(data.result.stdout);
        setStderr(data.result.stderr);
        setCode(data.options.code);
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
            <Editor code={code} onChange={setCode} />
        </Columns.Column>
        <Columns.Column size="one-third">
            <Toolbox onLoadExample={setCode} onRun={onRun} />
            <OutputView stdout={stdout} stderr={stderr} />
        </Columns.Column>
      </Columns>
  );
};
