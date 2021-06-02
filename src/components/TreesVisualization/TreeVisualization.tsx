import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { TreeGardenNode } from 'tree-garden';
import { AppDataContext } from '../../state';
import { VisualizationHeader } from './VisualizationHeader';
import { Tree } from './TreeSvg';

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


/*
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
  <g fill="#61DAFB">
  <circle cx="420.9" cy="296.5" r="45.7"/>
  <path d="M520.5 78.1z"/>
  </g>
</svg>
*/
const randNumber = (min = 0, max = 100) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(Math.random() * ((max - min) + 1)) + min;

// eslint-disable-next-line max-len
const randColor = () => `#${randInt(0, 255).toString(16).padStart(2, '0')}${randInt(0, 255).toString(16).padStart(2, '0')}${randInt(0, 255).toString(16).padStart(2, '0')}`;
const circles = new Array(1)
  .fill(1)
  .map(() => ({
    x: randNumber(0, 1000),
    y: randNumber(0, 1000),
    color: randColor()
  }));


export const TreeVisualization = () => {
  const { currentTree } = useContext(AppDataContext);
  const [zoom, setZoom] = useState(1);
  const doWeHaveTree = currentTree !== null;
  return (
    <MainContainer>
      <VisualizationHeader zoom={zoom} onZoomChanged={(value) => { setZoom(value); }}/>
      {doWeHaveTree
      && (
        <MainSvgContainer>
          <MainSvg zoom={zoom} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" >
            {
              circles.map(({ x, y, color }, index) => <circle key={index} r={10} cx={x} cy={y} fill={color}/>)
            }
            <Tree tree={currentTree as TreeGardenNode} x={0} y={0} width={1000} height={1000}/>
          </MainSvg>
        </MainSvgContainer>

      )}

    </MainContainer>
  );
};
