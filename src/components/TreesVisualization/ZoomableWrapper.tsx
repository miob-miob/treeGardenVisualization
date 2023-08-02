/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

// --------

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
  // TODO: don't use useState and use useRef for better performance and
  const unroundedScrollX = useRef(ref.current?.scrollLeft ?? 0);
  const unroundedScrollY = useRef(ref.current?.scrollTop ?? 0);

  const ignoreNextScrollEvent = useRef(false);

  useEffect(() => {
    const onScroll = (e: any) => {
      // ignore only one calling
      if (ignoreNextScrollEvent.current === true) {
        ignoreNextScrollEvent.current = false;
        return;
      }
      // console.log(e.target.scrollLeft, e.target.scrollTop);
      unroundedScrollX.current = e.target.scrollLeft;
      unroundedScrollY.current = e.target.scrollTop;
    };

    ref.current?.addEventListener('scroll', onScroll);
    return () => ref.current?.removeEventListener('scroll', onScroll);
  }, []);

  return {
    left: unroundedScrollX,
    setLeft: (_newX: number) => {
      // coordinations cannot be smaller than 0
      const newX = Math.max(0, _newX);
      unroundedScrollX.current = newX;
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollLeft = newX;
    },

    top: unroundedScrollY,
    setTop: (_newY: number) => {
      // coordinations cannot be smaller than 0
      const newY = Math.max(0, _newY);
      unroundedScrollY.current = newY;
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollTop = newY;
    }
  };
};


const useWindowFocus = (cb?: (isFocused: boolean) => void) => {
  const [isFocused, setIsFocused] = useState(document.hasFocus());

  useEffect(() => {
    const onFocus = () => {
      setIsFocused(true);
      cb?.(true);
    };

    const onBlur = () => {
      setIsFocused(false);
      cb?.(false);
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return isFocused;
};


export const ZoomableWrapper = (props: {
  children: React.ReactNode
  width: string | number
  height: string | number
  // scale + zoom should be computed based on window.innerWidth
  maxScale?: number
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [prevZoom, setPrevZoom] = useState(zoom);

  const isWindowFocused = useWindowFocus((isFocused) => {
    if (isFocused) {
      ref.current!.style.overflow = 'auto';
    } else {
      ref.current!.style.overflow = 'hidden';
    }
  });

  const viewElementScroll = useUnroundedScrollElement(ref);

  const cursorPos = useRef(null as { x: number; y: number } | null);
  // Power says that its not linear zoom, but exponent is constant value
  const computePowerZoom = (pZoom: number, scale = 1.02) => (scale * pZoom) ** 1.005;
  //   const computePowerZoom = (pZoom: number) => (1.05 * pZoom) ** 1.02;

  const normalizeZoom = (newZoom: number) => keepInRange(newZoom, 1.2, props.maxScale ?? 20);

  const setZoomIn = (scale?: number) => {
    setZoom((pZoom) => normalizeZoom(computePowerZoom(pZoom, scale)));
  };

  const setZoomOut = (scale?: number) => {
    setZoom((pZoom) => normalizeZoom(pZoom + pZoom - computePowerZoom(pZoom, scale)));
  };


  // TODO: there is weird bug with scroller memory when we get out of ranges
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

    let newScrollLeft = viewElementScroll.left.current * xPxZoomCoefficient;
    let newScrollTop = viewElementScroll.top.current * yPxZoomCoefficient;


    // TODO: check mobile version UI/UX
    const zoomPoint = cursorPos.current ?? {
      x: ref.current.clientWidth / 2,
      y: ref.current.clientHeight / 2
    };

    newScrollLeft += (zoomPoint.x * (xPxZoomCoefficient - 1));
    newScrollTop += (zoomPoint.y * (yPxZoomCoefficient - 1));

    // ---- apply computing into HTML elements -------
    viewElementScroll.setLeft(newScrollLeft);
    viewElementScroll.setTop(newScrollTop);

    setPrevZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isWindowFocused === false) return;
      if (e.key === '+') setZoomIn(1.15);
      else if (e.key === '-') setZoomOut(1.15);
    };

    const doWheelScroll = (e: WheelEvent) => {
      if (isWindowFocused === false) return;
      const isCmd = e.metaKey;
      if (!isCmd) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) setZoomIn();
      else setZoomOut();
    };


    const onMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect()!;
      cursorPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    ref.current?.addEventListener('wheel', doWheelScroll);
    ref.current?.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      ref.current?.removeEventListener('wheel', doWheelScroll);
      ref.current?.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isWindowFocused]);

  return (
    <Wrapper width={props.width} height={props.height}>
      {/* to manipulate and properly analyze cursor position we need to have focused user in the page */}
      {!isWindowFocused && <DivOverlay>
        <DivOverlayText>
          click to view
          <DivOverlaySmallText>
            use +, - or cmd+scroll to zoomIn
          </DivOverlaySmallText>
        </DivOverlayText>
        </DivOverlay>
     }

      <DivZoomableWrapper width={props.width} height={props.height} ref={ref} >
        <DivNested
          width={props.width}
          height={props.height}
          zoom={zoom}
        >
          {props.children}
        </DivNested>
      </DivZoomableWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div<{ width: string | number; height: string | number }>`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  position: relative;
`;

const DivOverlay = styled.div` 
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  z-index: 2;
  display: flex;
`;

const DivOverlayText = styled.div` 
  text-align: center;
  margin: auto;
  font-size: 3rem;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
`;

const DivOverlaySmallText = styled.div` 
 font-size: 1.5rem;
`;

const DivZoomableWrapper = styled.div<{ width: string | number; height: string | number }>`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  display: flex;
  flex-direction: row;
  overflow: auto;
  
  ::-webkit-scrollbar { 
    width: 1 !important
  }
`;

const DivNested = styled.div<{ width: string | number; height: string | number; zoom: number }>`
  transform: scale(${({ zoom }) => zoom});
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  transform-origin: left top;
  margin:auto;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 15rem;
`;
