import React from 'react';
import styled from 'styled-components';
import { TreeGardenNode } from 'tree-garden';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  margin-top: 1em;
  justify-content: center;
`;

const TreeTitle = styled.h3<{ isTreeAvailable:boolean }>`
  display: flex;
  justify-content: center;
  color: ${({ theme, isTreeAvailable }) => (isTreeAvailable ? theme.color4 : theme.color3)};
`;

type Props = {
  onZoomChanged:(zoomValue:number)=>void,
  zoom: number,
  label:string,
  tree:TreeGardenNode | null

};

export const VisualizationHeader = ({
  label, tree
}:Props) => {
  const isTrainedTreeAvailable = tree !== null;
  return (
    <MainContainer>
      {isTrainedTreeAvailable ? <TreeTitle isTreeAvailable={isTrainedTreeAvailable}>{label}</TreeTitle>
        : <TreeTitle isTreeAvailable={isTrainedTreeAvailable}>No tree available</TreeTitle>
      }
    </MainContainer>
  );
};
