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

/**
 * storing unrounded results of computed scroll position change
 *
 * by default HTML elements are rounding scroll position into integers
 * this hook helps you to change scroll position + keep stored unrounded data
 *
 * without this hook the UI will start to glitching a few pixels every zoom change
 */
const useUnroundedScrollElement = (ref: { current: HTMLElement | null }) => {
  // => HTML is rounding scroll from float into int
  const [unroundedScrollX, setUnroundedScrollX] = useState(ref.current?.scrollLeft ?? 0);
  const [unroundedScrollY, setUnroundedScrollY] = useState(ref.current?.scrollTop ?? 0);

  const ignoreNextScrollEvent = useRef(false);

  useEffect(() => {
    const onScroll = (e: any) => {
      // ignore only one calling
      if (ignoreNextScrollEvent.current === true) {
        ignoreNextScrollEvent.current = false;
        return;
      }
      setUnroundedScrollX(e.target.scrollLeft);
      setUnroundedScrollY(e.target.scrollTop);
    };

    ref.current?.addEventListener('scroll', onScroll);
    return () => ref.current?.removeEventListener('scroll', onScroll);
  }, []);

  return {
    left: unroundedScrollX,
    setLeft: (newX: number) => {
      setUnroundedScrollX(newX);
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollLeft = newX;
    },

    top: unroundedScrollY,
    setTop: (newY: number) => {
      setUnroundedScrollY(newY);
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollTop = newY;
    }
  };
};


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

  const ref = useRef<HTMLDivElement | null>(null);
  const [prevZoom, setPrevZoom] = useState(zoom);

  const viewElementScroll = useUnroundedScrollElement(ref);


  // Power says that its not linear zoom, but exponent is constant value
  const computePowerZoom = (pZoom: number) => (1.05 * pZoom) ** 1.1;

  const setZoomIn = () => setZoom((pZoom) => keepInRange(computePowerZoom(pZoom), 1, 10));

  const setZoomOut = () => setZoom((pZoom) => keepInRange(pZoom + pZoom - computePowerZoom(pZoom), 1, 10));

  useEffect(() => {
    if (!ref || !ref.current) return;

    // computing zoom by myself instead of reading ref.current.children[0].getBoundingClientRect()
    // from HTML ref do different in computing ~0.03% which is too small to take care about it
    const prevScaledWidth = ref.current.clientWidth * prevZoom;
    const prevScaledHeight = ref.current.clientHeight * prevZoom;
    const newScaledWidth = ref.current.clientWidth * zoom;
    const newScaledHeight = ref.current.clientHeight * zoom;

    const xPxZoomCoefficient = newScaledWidth / prevScaledWidth;
    const yPxZoomCoefficient = newScaledHeight / prevScaledHeight;

    let newScrollLeft = viewElementScroll.left * xPxZoomCoefficient;
    let newScrollTop = viewElementScroll.top * yPxZoomCoefficient;

    // zoom user view into the center, not left top corner
    newScrollLeft += ((ref.current.clientWidth / 2) * (xPxZoomCoefficient - 1));
    newScrollTop += ((ref.current.clientHeight / 2) * (yPxZoomCoefficient - 1));

    // ---- apply computing into HTML elements -------
    viewElementScroll.setLeft(newScrollLeft);
    viewElementScroll.setTop(newScrollTop);

    setPrevZoom(zoom);
  }, [zoom]);


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+') setZoomIn();
      else if (e.key === '-') setZoomOut();
    };

    const doWheelScroll = (e: WheelEvent) => {
      const isCmd = e.metaKey;
      if (!isCmd) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) setZoomIn();
      else setZoomOut();
    };

    ref.current?.addEventListener('wheel', doWheelScroll);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      ref.current?.removeEventListener('wheel', doWheelScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

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
