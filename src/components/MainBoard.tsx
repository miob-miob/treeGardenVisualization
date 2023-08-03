import React, { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TreeGardenNode } from 'tree-garden';
import { treeGardenTheme } from '../theme';
import { TrainedTreeInput } from './TrainedTreeInput';
import { GlobalStyle } from '../globalStyle';
import { Header } from './Header';
import { Errors } from './Errors';
import { AppDataContextProvider, AppDataContext } from '../state';
import { DataSampleInput } from './DataSampleInput';
import { TreeVisualization } from './TreesVisualization/TreeVisualization';
import { OpenedNodePopup } from './OpenedNodePopup';

const MainContainer = styled.div`
  // TODO: background is not properly applied for tree view
  // background-color: red;
  // background-color: ${({ theme }) => theme.color1};
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


// todo

// type BoardProps = {
//   tree?: TreeGardenNode | string,
//   dataSample?: TreeGardenDataSample | string
// };

const DataAndTree = () => {
  const { currentTree, currentSample, setOpenedNode } = useContext(AppDataContext);
  // arrays are not supported yet
  return <TreeVisualization
    tree={currentTree as TreeGardenNode | null}
    sampleToDisplay={currentSample}
    onNodeClick={(node) => {
      setOpenedNode(node);
    }
  }/>;
};


// todo place data here propagate it to:             <TrainedTreeInput />
//             <DataSampleInput/>
export const Board = () => (
    <ThemeProvider theme={treeGardenTheme as any}>
      <AppDataContextProvider>
        <GlobalStyle/>
        <MainContainer>
          <OpenedNodePopup/>
          <Errors/>
          <Header/>
          <InputsContainer>
            <TrainedTreeInput />
            <DataSampleInput/>
          </InputsContainer>
          <DataAndTree/>
        </MainContainer>
      </AppDataContextProvider>
    </ThemeProvider>
);


