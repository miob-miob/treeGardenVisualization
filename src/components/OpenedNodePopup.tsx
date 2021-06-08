import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { NodeDetail } from './NodeDetail';
import { AppDataContext } from '../state';


const PopupContainer = styled.div`
  min-width: 60%;
  min-height: 40%;
  padding: 0.5em;
  background-color: ${(p) => p.theme.color1};
  border: ${({ theme }) => `${theme.sizes.borderWidth} solid ${theme.color3}`};
  border-radius: ${(props) => props.theme.sizes.borderRadius};
  box-shadow: 5px 5px 20px ${(p) => p.theme.color3};
`;

const ClickOverlay = styled.div`
  
  position: fixed;
  top:0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color:rgba(255,255,255,0.5);
  z-index: 1;
`;

export const OpenedNodePopup = () => {
  const { setOpenedNode, openedNode } = useContext(AppDataContext);
  const overlayRef = useRef(null);


  if (openedNode === null) {
    return null;
  }

  return (
  <ClickOverlay ref={overlayRef} onClick={() => setOpenedNode(null)}>
    <PopupContainer onClick={(e) => e.stopPropagation()}>
      <NodeDetail node={openedNode}/>
    </PopupContainer>;
  </ClickOverlay>
  );
};
