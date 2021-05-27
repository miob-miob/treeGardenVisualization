import React, { useContext } from 'react';
import styled from 'styled-components';
import { AppDataContext } from '../../state';


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

const LabelAndZoomContainer = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;


const Zoom = styled.input.attrs({ type: 'range' })`

  width: 10em;
  
  -webkit-appearance: none;
  ::-webkit-slider-runnable-track {
    height: 8px;
    background: ${({ theme }) => theme.color2};
    border: none;
    border-radius: 3px;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color3};
    margin-top: -4px;
  }
  
`;

const ZoomText = styled.div`
  color: ${({ theme }) => theme.color3};
  margin-right: 1em;
`;

type Props = {
  onZoomChanged:(zoomValue:number)=>void,
  zoom: number

};

export const VisualizationHeader = ({ onZoomChanged, zoom }:Props) => {
  const { currentTree } = useContext(AppDataContext);
  const isTrainedTreeAvailable = currentTree !== null;
  return (
    <MainContainer>
      {isTrainedTreeAvailable ? <TreeTitle isTreeAvailable={isTrainedTreeAvailable}>Trained tree visualization</TreeTitle>
        : <TreeTitle isTreeAvailable={isTrainedTreeAvailable}>No tree available</TreeTitle>
      }
      {isTrainedTreeAvailable
      && (
        <LabelAndZoomContainer>
          <ZoomText>Zoom:</ZoomText>
          <Zoom value={zoom} min={1} max={10} step={0.1} onInput={((event:React.FormEvent<HTMLInputElement>) => {
            onZoomChanged(parseFloat(event.currentTarget.value));
          })}/>
        </LabelAndZoomContainer>)}
    </MainContainer>
  );
};
