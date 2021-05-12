import React from 'react';
import { TrainedTreeInput } from './TrainedTreeInput';

type Props = {
  name?: string
};


export const TreeGardenVisualization = ({ name = 'sulda' }:Props) => (
  <div>
    <h2>{`Welcome  too the hell!!${name}`}</h2>
    <TrainedTreeInput id={'susu'}/>
  </div>
);


