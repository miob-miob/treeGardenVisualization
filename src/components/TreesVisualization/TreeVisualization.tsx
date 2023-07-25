/* eslint-disable max-len */
import React, {
  useRef, useEffect, useMemo, useState
} from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { TreeGardenNode, TreeGardenDataSample } from 'tree-garden';
import { VisualizationHeader } from './VisualizationHeader';
import { Tree } from './TreeSvg';
import { getDataForVisualization } from '../../utils/tree';
import { treeGardenTheme } from '../../theme';

const getVisualizationElementSize = (number:number, sizeUnit:string | null) => {
  if (sizeUnit === null) {
    return (window.innerWidth > window.innerHeight ? `${number}vh` : `${number}vw`);
  }
  return `${number}${sizeUnit}`;
};

const MainContainer = styled.div`
  display: flex;
  margin-bottom: 1em;
  flex-direction: column;
  align-items: center;
  //background-color: ${({ theme }) => theme.color2};
`;
const MainSvgContainer = styled.div<{ size:string }>`
  display: flex;
  flex-direction: row;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  //height: 500px;
  overflow: auto;
  
`;

// transform: scale(${({ zoom }) => zoom}) translate(${({ zoom }) => zoom * 10}%, ${({ zoom }) => zoom * 10}%);
const MainSvg = styled.svg<{ zoom:number, size:string }>`
  transform-origin: left top;
  margin:auto;
  // todo investigate possibility of usage dynamic transform-origin according to mouse
  // todo use width, height + make it proportionally shifted with translate + also set scrollbars
  transform: scale(${({ zoom }) => zoom});
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  overflow: auto;
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

const keepInRange = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// window.sharedRelativePointerPos = {x: 0, y: 0}

export const TreeVisualization = (
  {
    tree,
    sampleToDisplay,
    label = 'Trained tree visualization',
    onNodeClick = defaultOnNodeClick,
    showHeader = true,
    initialZoom = 1,
    size = 85,
    sizeUnit = null
  }:Props
) => {
  const [zoom, setZoom] = useState(initialZoom);
  const doWeHaveTree = tree !== null;
  // todo remove 'as' with multiple trees support
  const visualizationData = useMemo(() => (tree ? getDataForVisualization(tree as TreeGardenNode, sampleToDisplay) : null), [tree, sampleToDisplay]);
  const sizeAndUnit = getVisualizationElementSize(size, sizeUnit);

  const ref = useRef<any>(null);
  const [prevZoom, setPrevZoom] = useState(zoom);

  useEffect(() => {
    if (!ref || !ref.current) return;

    setPrevZoom(zoom);

    // make scrolling fixed to left top corner
    const prevScaledWidth = ref.current.clientWidth * prevZoom;
    const prevScaledHeight = ref.current.clientHeight * prevZoom;

    const newScaledWidth = ref.current.clientWidth * zoom;
    const newScaledHeight = ref.current.clientHeight * zoom;


    const xPxZoomCoefficient = (1 - (prevScaledWidth / newScaledWidth));
    const yPxZoomCoefficient = (1 - (prevScaledHeight / newScaledHeight));

    ref.current.scrollLeft += ref.current.scrollLeft * xPxZoomCoefficient;
    ref.current.scrollTop += ref.current.scrollTop * yPxZoomCoefficient;

    // -----------------------------------
    // change of zoom per px for center of current view...

    const currentViewXPercent = ref.current.clientWidth / newScaledWidth;
    const currentViewYPercent = ref.current.clientHeight / newScaledHeight;

    ref.current.scrollLeft += (((newScaledWidth * currentViewXPercent) / 2) * xPxZoomCoefficient);
    ref.current.scrollTop += (((newScaledHeight * currentViewYPercent) / 2) * yPxZoomCoefficient);
  }, [zoom]);


  useEffect(() => {
    const doScroll = (e: any) => {
      const isCmd = e.metaKey;

      if (!isCmd) return


      // const cursorPos = {
      //   x: e.offsetX,
      //   y: e.offsetY
      // };
      // console.log(cursorPos)
      // window.sharedRelativePointerPos = cursorPos
      e.preventDefault();
      e.stopPropagation();
      setZoom((p) => {
        const newValue = e.deltaY < 0 ? p + 0.1 : p - 0.1;
        return keepInRange(newValue, 1, 10);
      });
    };

    ref.current.addEventListener('wheel', doScroll);

    return () => ref.current.removeEventListener('wheel', doScroll);
  }, [zoom]);

  return (
    // to be able to use this component stand alone, we will need extra styled provider
    <ThemeProvider theme={treeGardenTheme as any}>
      <MainContainer>
        {showHeader && <VisualizationHeader tree={tree} label={label} zoom={zoom} onZoomChanged={(value) => { setZoom(value); }}/>}
        {doWeHaveTree
        && (
          <MainSvgContainer size={sizeAndUnit} ref={ref}>
            <MainSvg size={sizeAndUnit} zoom={zoom} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" >
              <Tree onClick={onNodeClick} visualizationData={visualizationData!} x={0} y={0} width={1000} height={1000}/>
            </MainSvg>
          </MainSvgContainer>
        )}

      </MainContainer>
    </ThemeProvider>
  );
};
