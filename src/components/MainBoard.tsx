import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { treeGardenTheme } from '../theme';
import { TrainedTreeInput } from './TrainedTreeInput';
import { GlobalStyle } from '../globalStyle';

const MainContainer = styled.div`
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.color4};
  //padding: 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%
`;

export const TreeGardenVisualization = () => (
    <ThemeProvider theme={treeGardenTheme as any}>
      <GlobalStyle/>
      <MainContainer>
        <h2>{'Welcome  too the hell!!'}</h2>
        <TrainedTreeInput />
      </MainContainer>
    </ThemeProvider>
);


