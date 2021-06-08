// todo this is concept of tree item vizualization
import React from 'react';
import styled from 'styled-components';
import { getDataForVisualization } from '../../utils/tree';

type VisualizationData = ReturnType<typeof getDataForVisualization>;


type Props = {
  visualizationData: VisualizationData,
  x:number,
  y:number,
  width:number,
  height:number,
};

const Edge = styled.line`
  stroke-width: 2px;
  stroke: ${({ theme }) => theme.color2}
`;

const EdgeLabel = styled.text<{ fontSizeRatio:number }>`
  font-size: ${(p) => p.fontSizeRatio * 14}px;
  font-weight: bold;
  fill: ${(p) => p.theme.color4};
  text-anchor: middle;
`;

const ForeignTextContainer = styled.foreignObject`
`;

const TextContainer = styled.div<{ isLeaf:boolean }>`
  font-family: Courier;
  display: flex;
  justify-content: ${(p) => (p.isLeaf ? 'center' : 'space-between')};
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Text = styled.div<{ fontSize:number }>`
  padding: 0.2em;
  font-size: ${(p) => p.fontSize}px;
`;


const Node = styled.rect<{ color?:string }>`
  fill: ${({ theme }) => theme.color2};
  stroke: ${({ theme, color }) => (color || theme.color3)};
  rx:${({ theme }) => theme.sizes.borderRadius};
  ry:${({ theme }) => theme.sizes.borderRadius};

  stroke-width: 1.5px;
`;

export const Tree = ({
  visualizationData,
  x,
  y,
  width,
  height
}:Props) => (
    <svg viewBox="0 0 1000 1000" x={x} y={y} width={width} height={height}>
      {visualizationData.edges.map(({
        x0, x1, y0, y1
      }, index) => <Edge key={index} x1={x0} x2={x1} y1={y0} y2={y1}/>)}
      {
        visualizationData.treeNodes.map(({
          x0, x1, y0, y1, color, data
        }) => <Node key={data.id} x={x0} y={y0} width={x1 - x0} height={y1 - y0} color={color}/>)
      }
      {visualizationData.treeNodes.map(({
        textBoundary, data, fontSize, texts
      }, index) => <ForeignTextContainer
        key={index}
        onClick={() => { console.log(data); }}
        x={textBoundary.x0}
        y={textBoundary.y0}
        width={textBoundary.x1 - textBoundary.x0}
        height={textBoundary.y1 - textBoundary.y0}>
        <TextContainer isLeaf={data.isLeaf}>
          {texts.map((item) => <Text key={item} fontSize={fontSize}>{item}</Text>)}
        </TextContainer>
      </ForeignTextContainer>)}
      {
        // ensure edge labels goes last (or they would be overridden by edges)
        visualizationData.edges.map(({ text }, index) => <EdgeLabel key ={index} x={text.x} y={text.y} fontSizeRatio={text.ratio}>{text.text}</EdgeLabel>)
      }
    </svg>
);


