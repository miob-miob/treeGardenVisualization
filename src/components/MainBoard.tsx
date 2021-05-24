import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { treeGardenTheme } from '../theme';
import { TrainedTreeInput } from './TrainedTreeInput';
import { GlobalStyle } from '../globalStyle';
import { Header } from './Header';
import { Errors } from './Errors';
import { AppDataContextProvider } from '../state';
import { DataSampleInput } from './DataSampleInput';

const MainContainer = styled.div`
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.color4};
  //padding: 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: sans-serif;
`;


const InputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100vw;
  margin-top: 4em;
  justify-content: center;
  gap: 2em;
`;


export const TreeGardenVisualization = () => (
    <ThemeProvider theme={treeGardenTheme as any}>
      <AppDataContextProvider>
        <GlobalStyle/>
        <MainContainer>
          <Errors/>
          <Header/>
          <InputsContainer>
            <TrainedTreeInput />
            <DataSampleInput/>
          </InputsContainer>

        </MainContainer>
      </AppDataContextProvider>
    </ThemeProvider>
);


