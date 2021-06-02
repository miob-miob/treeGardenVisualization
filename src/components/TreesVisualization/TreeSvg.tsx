// todo this is concept of tree item vizualization
import React from 'react';
import styled from 'styled-components';
import { TreeGardenNode } from 'tree-garden';
import { getDataForVisualization } from '../../utils/tree';

type Props = {
  tree: TreeGardenNode,
  x:number,
  y:number,
  width:number,
  height:number,
};

const MyDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Tree = ({
  tree,
  x,
  y,
  width,
  height
}:Props) => {
  // console.log(getDataForVisualization(tree));
  console.log('HiHi');
  return (
  <svg viewBox="0 0 1000 1000" x={x} y={y} width={width} height={height}>
    <circle r={(Math.sqrt(2) * 1000) / 2} cx={0} cy={0} fill={'#ff55aa'}/>
    <circle r={(Math.sqrt(2) * 1000) / 2} cx={1000} cy={1000} fill={'#aaff55'}/>
    <foreignObject x={100} y={200} width={500} height={100}>
      <MyDiv>
        <div>this</div>
        <div>us</div>
        <div>text</div>
        <div>text</div>
        <div>text</div>
        <div>text</div>
      </MyDiv>
    </foreignObject>


  </svg>
  );
};
