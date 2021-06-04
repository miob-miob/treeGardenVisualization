// todo this is concept of tree item vizualization
import React from 'react';
import styled from 'styled-components';
import { getDataForVisualization } from '../../utils/tree';

type Props = {
  visualizationData: ReturnType<typeof getDataForVisualization>,
  x:number,
  y:number,
  width:number,
  height:number,
};

// const MyDiv = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;
//
//
// <foreignObject x={100} y={200} width={500} height={100}>
//   <MyDiv>
//     <div>this</div>
//     <div>us</div>
//     <div>text</div>
//     <div>text</div>
//     <div>text</div>
//     <div>text</div>
//   </MyDiv>
// </foreignObject>
// <circle r={(Math.sqrt(2) * 1000) / 2} cx={0} cy={0} fill={'#ff55aa'}/>
// <circle r={(Math.sqrt(2) * 1000) / 2} cx={1000} cy={1000} fill={'#aaff55'}/>

const Edge = styled.line`
  stroke-width: 2px;
  stroke: ${({ theme }) => theme.color3}
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
      }) => <Edge x1={x0} x2={x1} y1={y0} y2={y1}/>)}
      {
        visualizationData.treeNodes.map(({
          x0, x1, y0, y1, color
        }) => <Node x={x0} y={y0} width={x1 - x0} height={y1 - y0} color={color}/>)
      }
    </svg>
);


