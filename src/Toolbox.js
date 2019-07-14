import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Container, Loader } from 'react-bulma-components';

export const Toolbox = ({tags, examples, onLoadExample, isCompiling, onRun}) => {
  const [example, setExample] = useState('');
  const [tag, setTag] = useState('');

  useEffect(() => {
    setExample(examples[0] && examples[0].url);
    setTag(tags[0]);
  }, [tags, examples]);

  return (
    <Container id="toolbox">
        <Container>
            <Dropdown onChange={setTag} value={tag}>
                {tags.map(e => <Dropdown.Item key={e} value={e}>{e}</Dropdown.Item>)}
            </Dropdown>
            <Button onClick={onRun(tag, false)} disabled={isCompiling}>Run</Button>
            <Button onClick={onRun(tag, true)} disabled={isCompiling}>Share</Button>
        </Container>
        <Container>
            <Dropdown onChange={setExample} value={example}>
                {examples.map(e => <Dropdown.Item key={e.name} value={e.url}>{e.name}</Dropdown.Item>)}
            </Dropdown>
            <Button onClick={onLoadExample(example)}>Load an example</Button>
        </Container>
        <Container>
            {isCompiling && <Loader />}
        </Container>
    </Container>
  );
}
