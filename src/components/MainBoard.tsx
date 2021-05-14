import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { treeGardenTheme } from '../theme';
import { TrainedTreeInput } from './TrainedTreeInput';

const MainContainer = styled.div`
  background-color: ${({ theme }) => theme.secondaryBackground};
  color: ${({ theme }) => theme.texts};
  padding: 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

export const TreeGardenVisualization = () => (
  <ThemeProvider theme={treeGardenTheme as any}>
    <MainContainer>
      <h2>{'Welcome  too the hell!!'}</h2>
      <TrainedTreeInput />
    </MainContainer>
  </ThemeProvider>

);


