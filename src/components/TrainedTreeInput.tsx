import React from 'react';
import styled from 'styled-components';

const MyDiv = styled.div`
  color: #5555ee;
  background-color: #ffaaaa;
`;

type Props = {
  color?:string,
  id:string
};
export const TrainedTreeInput = ({ id, color = 'black' }:Props) => (
  <MyDiv>
    <div>{`There will be input with id: ${id}`}</div>
    <div>{`Color will be: ${color}`}</div>
  </MyDiv>
);
