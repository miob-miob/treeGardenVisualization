/* eslint-disable max-len */
import React, { useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TreeGardenNode, TreeGardenDataSample } from 'tree-garden';
import { VisualizationHeader } from './VisualizationHeader';
import { Tree } from './TreeSvg';
import { getDataForVisualization } from '../../utils/tree';
import { treeGardenTheme } from '../../theme';
import { ZoomableWrapper } from './ZoomableWrapper';


// ---------------

const MainContainer = styled.div`
  padding-top: 1rem;
  display: flex;
  margin-bottom: 1em;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;


// transform: scale(${({ zoom }) => zoom}) translate(${({ zoom }) => zoom * 10}%, ${({ zoom }) => zoom * 10}%);
const MainSvg = styled.svg`
  width: 100%;
  height: 100%;
`;

type Props = {
  tree:TreeGardenNode | null,
  label?:string,
  sampleToDisplay?:TreeGardenDataSample | null,
  onNodeClick?:(node:TreeGardenNode)=>void,
  showHeader?:boolean,
  initialZoom?:number,
  size?:number // in wv (width and height of tree component
  sizeUnit?:string | null // if no unit provided -  relative to window is used
};

const defaultOnNodeClick = (node:TreeGardenNode) => console.log(node);

export const TreeVisualization = ({
  tree,
  sampleToDisplay,
  onNodeClick = defaultOnNodeClick
}: Props) => {
  const doWeHaveTree = tree !== null;
  // todo remove 'as' with multiple trees support
  const visualizationData = useMemo(() => (tree ? getDataForVisualization(tree as TreeGardenNode, sampleToDisplay) : null), [tree, sampleToDisplay]);

  return (
    // to be able to use this component stand alone, we will need extra styled provider
    <ThemeProvider theme={treeGardenTheme as any}>
      <MainContainer style={{ width: '95%' }}>
        {/* {showHeader && <VisualizationHeader tree={tree} label={label} zoom={zoom} onZoomChanged={(value) => { setZoom(value); }}/>} */}

        {doWeHaveTree && (
          <ZoomableWrapper width={'100%'} height={'85vh'}>
            <MainSvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
              <Tree onClick={onNodeClick} visualizationData={visualizationData!} x={0} y={0} width={1000} height={1000}/>
            </MainSvg>
          </ZoomableWrapper>
        )}

      </MainContainer>
    </ThemeProvider>
  );
};
