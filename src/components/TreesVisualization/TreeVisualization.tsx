/* eslint-disable max-len */
import React, { useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TreeGardenNode, TreeGardenDataSample } from 'tree-garden';
import { VisualizationHeader } from './VisualizationHeader';
import { Tree } from './TreeSvg';
import { getDataForVisualization } from '../../utils/tree';
import { treeGardenTheme } from '../../theme';

const getVisualizationElementSize = (number = 85) => (window.innerWidth > window.innerHeight ? `${number}vh` : `${number}vw`);

const MainContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
  flex-direction: column;
  align-items: center;
  //background-color: ${({ theme }) => theme.color2};
  width: 100vw;
`;
const MainSvgContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: ${getVisualizationElementSize()};
  height: ${getVisualizationElementSize()};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  //height: 500px;
  overflow: auto;
  
`;

const MainSvg = styled.svg<{ zoom:number }>`
  transform-origin: left top;
  margin:auto;
  // todo investigate possibility of usage dynamic transform-origin according to mouse
  // todo use width, height + make it proportionally shifted with translate + also set scrollbars 
  //transform: scale(${({ zoom }) => zoom}) translate(${({ zoom }) => zoom * 10}%, ${({ zoom }) => zoom * 10}%);
  transform: scale(${({ zoom }) => zoom});
  width: ${getVisualizationElementSize()};
  height: ${getVisualizationElementSize()}
  overflow: auto;
`;

type Props = {
  tree:TreeGardenNode | null,
  label?:string,
  sampleToDisplay?:TreeGardenDataSample | null,
  onNodeClick?:(node:TreeGardenNode)=>void,
  showHeader?:boolean,
  initialZoom?:number
};

const defaultOnNodeClick = (node:TreeGardenNode) => console.log(node);

export const TreeVisualization = (
  {
    tree,
    sampleToDisplay,
    label = 'Trained tree visualization',
    onNodeClick = defaultOnNodeClick,
    showHeader = true,
    initialZoom = 1
  }:Props
) => {
  const [zoom, setZoom] = useState(initialZoom);
  const doWeHaveTree = tree !== null;
  // todo remove 'as' with multiple trees support
  const visualizationData = useMemo(() => (tree ? getDataForVisualization(tree as TreeGardenNode, sampleToDisplay) : null), [tree, sampleToDisplay]);
  return (
    // to be able to use this component stand alone, we will need extra styled provider
    <ThemeProvider theme={treeGardenTheme as any}>
      <MainContainer>
        {showHeader && <VisualizationHeader tree={tree} label={label} zoom={zoom} onZoomChanged={(value) => { setZoom(value); }}/>}
        {doWeHaveTree
        && (
          <MainSvgContainer>
            <MainSvg zoom={zoom} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" >
              <Tree onClick={onNodeClick} visualizationData={visualizationData!} x={0} y={0} width={1000} height={1000}/>
            </MainSvg>
          </MainSvgContainer>
        )}

      </MainContainer>
    </ThemeProvider>
  );
};
