import React from 'react';
import styled from 'styled-components';
import { Button } from './shared/Button';

const Container = styled.div`
  width: 50vw;
  display: flex;
  justify-content: space-between;
`;

export const TrainedTreeInput = () => (
    <Container>
      <Button >Push me!</Button>
      <Button >Push me!</Button>
      <Button >Push me!</Button>
    </Container>

);
