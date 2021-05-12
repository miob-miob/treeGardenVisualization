import React from 'react';

type Props = {
  color?:string,
  id:string
};
export const TrainedTreeInput = ({ id, color = 'black' }:Props) => (
  <div>
    <div>{`There will be input with id: ${id}`}</div>
    <div>{`Color will be: ${color}`}</div>
  </div>
);
