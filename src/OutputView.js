import React from 'react';
import styled from 'styled-components';
import { Heading, Content, Container } from 'react-bulma-components';

const OutputContent = styled(Content)`
  height: 45vh;
`;

const OutputBox = styled.pre`
  height: 70%;
`;

export const OutputView = ({stdout, stderr}) => (
  <Container>
    <OutputContent>
      <Heading subtitle>stdout</Heading>
      <OutputBox>{stdout}</OutputBox>
    </OutputContent>
    <OutputContent>
      <Heading subtitle>stderr</Heading>
      <OutputBox>{stderr}</OutputBox>
    </OutputContent>
  </Container>
)
