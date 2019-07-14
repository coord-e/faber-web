import React from 'react';
import { Heading, Content, Container } from 'react-bulma-components';

import './OutputView.css';

export const OutputView = ({stdout, stderr}) => (
  <Container>
    <Content className="output">
      <Heading subtitle>stdout</Heading>
      <pre className="output-box">{stdout}</pre>
    </Content>
    <Content className="output">
      <Heading subtitle>stderr</Heading>
      <pre className="output-box">{stderr}</pre>
    </Content>
  </Container>
)
