import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { AppDataContext } from '../../state';


const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //background-color: ${({ theme }) => theme.color2};
  width: 100vw;
  height: 100vh;
`;

const Title = styled.h3<{ doWeHaveTree:boolean }>`

`;

const MainSvgContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const MainSvg = styled.svg<{ zoom:number }>`
  transform: scale(${({ zoom }) => zoom});

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
const circles = new Array(333)
  .fill(1)
  .map(() => ({
    x: randNumber(0, 1000),
    y: randNumber(0, 1000),
    color: randColor()
  }));


export const TreeVisualization = () => {
  const { currentTree } = useContext(AppDataContext);
  const [counter, setCounter] = useState(1);
  const doWeHaveTree = currentTree !== null;
  return (
    <MainContainer>
      {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      <button onClick={() => { setCounter((value) => value + 1); }}>Zoom</button>
      <Title doWeHaveTree={doWeHaveTree}>{`${doWeHaveTree ? 'Visualization of loaded tree' : 'No tree for visualization'}`}</Title>
      {doWeHaveTree
      && (
        <MainSvgContainer>
          <MainSvg zoom={counter} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width={'100%'} >
            {
              circles.map(({ x, y, color }) => <circle r={10} cx={x} cy={y} fill={color}/>)
            }
          </MainSvg>
        </MainSvgContainer>

      )}

    </MainContainer>
  );
};
