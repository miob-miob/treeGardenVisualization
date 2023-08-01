/* eslint-disable max-len */
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

// --------

const keepInRange = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// eslint-disable-next-line @typescript-eslint/comma-dangle
const useStateNoRerender = <T,>(defVal: T) => {
  const ref = useRef(defVal);
  const set = (newVal: T) => { ref.current = newVal; };
  return [ref.current, set] as [T, typeof set];
};

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
  const [unroundedScrollX, setUnroundedScrollX] = useStateNoRerender(ref.current?.scrollLeft ?? 0);
  const [unroundedScrollY, setUnroundedScrollY] = useStateNoRerender(ref.current?.scrollTop ?? 0);

  const ignoreNextScrollEvent = useRef(false);

  useEffect(() => {
    const onScroll = (e: any) => {
      // ignore only one calling
      if (ignoreNextScrollEvent.current === true) {
        ignoreNextScrollEvent.current = false;
        return;
      }
      // console.log(e.target.scrollLeft, e.target.scrollTop);
      setUnroundedScrollX(e.target.scrollLeft);
      setUnroundedScrollY(e.target.scrollTop);
    };

    ref.current?.addEventListener('scroll', onScroll);
    return () => ref.current?.removeEventListener('scroll', onScroll);
  }, []);

  return {
    left: unroundedScrollX,
    setLeft: (_newX: number) => {
      // coordinations cannot be smaller than 0
      const newX = Math.max(0, _newX);
      setUnroundedScrollX(newX);
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollLeft = newX;
    },

    top: unroundedScrollY,
    setTop: (_newY: number) => {
      // coordinations cannot be smaller than 0
      const newY = Math.max(0, _newY);
      setUnroundedScrollY(newY);
      ignoreNextScrollEvent.current = true;
      // assigning float into scroll round scroll into integer
      // eslint-disable-next-line no-param-reassign
      ref.current!.scrollTop = newY;
    }
  };
};


const DivZoomableWrapper = styled.div<{ width: string | number; height: string | number }>`
  width: ${(p) => p.width};
  height: ${(p) => p.height};
  border: 1px solid ${({ theme }) => theme.color2};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  display: flex;
  flex-direction: row;
  overflow: auto;
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
`;

export const ZoomableWrapper = (props: {
  children: React.ReactNode
  width: string | number
  height: string | number
  maxScale?: number
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [prevZoom, setPrevZoom] = useState(zoom);

  const viewElementScroll = useUnroundedScrollElement(ref);

  const cursorPos = useRef(null as { x: number; y: number } | null);
  // Power says that its not linear zoom, but exponent is constant value
  const computePowerZoom = (pZoom: number, scale = 1.02) => (scale * pZoom) ** 1.005;
  //   const computePowerZoom = (pZoom: number) => (1.05 * pZoom) ** 1.02;

  const normalizeZoom = (newZoom: number) => keepInRange(newZoom, 1, props.maxScale ?? 20);

  const setZoomIn = (scale?: number) => {
    setZoom((pZoom) => normalizeZoom(computePowerZoom(pZoom, scale)));
  };

  const setZoomOut = (scale?: number) => {
    setZoom((pZoom) => normalizeZoom(pZoom + pZoom - computePowerZoom(pZoom, scale)));
  };

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


    // TODO: check mobile version UI/UX
    const zoomPoint = cursorPos.current ?? {
      x: ref.current.clientWidth / 2,
      y: ref.current.clientHeight / 2
    };

    newScrollLeft += (zoomPoint.x * (xPxZoomCoefficient - 1));
    newScrollTop += (zoomPoint.y * (yPxZoomCoefficient - 1));

    // console.log(newScrollLeft, newScrollTop);
    // ---- apply computing into HTML elements -------
    viewElementScroll.setLeft(newScrollLeft);
    viewElementScroll.setTop(newScrollTop);

    setPrevZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+') setZoomIn(1.15);
      else if (e.key === '-') setZoomOut(1.15);
    };

    const doWheelScroll = (e: WheelEvent) => {
      const isCmd = e.metaKey;
      if (!isCmd) return;

      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) setZoomIn();
      else setZoomOut();
    };


    const onMouseMove = (e: MouseEvent) => {
      // I need to force user to click into the screen and focus to the page to not to have bugged UI
      if (document.hasFocus() === false) {
        // eslint-disable-next-line no-param-reassign
        ref.current!.style.overflow = 'hidden';
        // eslint-disable-next-line no-param-reassign
        return;
      }
      ref.current!.style.overflow = 'auto';

      //
      const rect = ref.current?.getBoundingClientRect()!;
      cursorPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      // console.log(cursorPos.current);
    };

    ref.current?.addEventListener('wheel', doWheelScroll);
    ref.current?.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      ref.current?.removeEventListener('wheel', doWheelScroll);
      ref.current?.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);


  return (
    <DivZoomableWrapper width={props.width} height={props.height} ref={ref}>
      <DivNested
        width={props.width}
        height={props.height}
        zoom={zoom}
        style={{ padding: '15rem' }}
      >
        {props.children}
      </DivNested>
    </DivZoomableWrapper>
  );
};
