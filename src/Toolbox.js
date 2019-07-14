import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Container, Loader } from 'react-bulma-components';

import { endpoint } from './util';

async function fetchData(name) {
  const resp = await fetch(endpoint(name));
  return await resp.json();
}

async function fetchExample(example) {
  const resp = await fetch(example)
  return await resp.text();
}

export const Toolbox = ({onLoadExample, onRun}) => {
  const [examples, setExamples] = useState([]);
  const [tags, setTags] = useState([]);

  const [example, setExample] = useState('');
  const [tag, setTag] = useState('');

  const [running, setRunning] = useState(false);

  useEffect(() => {
    async function load() {
      const tags = await fetchData("tags");
      setTags(tags);
      setTag(tags[0]);

      const examples = await fetchData("examples");
      setExamples(examples);
      setExample(examples[0].url);
    }
    load();
  }, []);

  const runHandle = (shouldSave) => async () => {
    console.log(tag);
    setRunning(true);
    await onRun(tag, shouldSave);
    setRunning(false);
  };

  return (
    <Container id="toolbox">
        <Container>
            <Dropdown onChange={setTag} value={tag}>
                {tags.map(e => <Dropdown.Item key={e} value={e}>{e}</Dropdown.Item>)}
            </Dropdown>
            <Button onClick={runHandle(false)} disabled={running}>Run</Button>
            <Button onClick={runHandle(true)} disabled={running}>Share</Button>
        </Container>
        <Container>
            <Dropdown onChange={setExample} value={example}>
                {examples.map(e => <Dropdown.Item key={e.name} value={e.url}>{e.name}</Dropdown.Item>)}
            </Dropdown>
            <Button onClick={async () => onLoadExample(await fetchExample(example))}>
              Load an example
            </Button>
        </Container>
        <Container>
            {running && <Loader />}
        </Container>
    </Container>
  );
}
