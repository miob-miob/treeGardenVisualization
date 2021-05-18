import { useState } from 'react';
import { TreeGardenNode } from 'tree-garden';
import { TreeGardenDataSample } from 'tree-garden/dist/dataSet';

import { genericHookContextBuilder } from './utils/genericContextProviderBuilder';

const useAppData = () => {
  const [currentTree, setCurrentTree] = useState(null as TreeGardenNode|TreeGardenNode[]|null);
  const [currentSample, setCurrentSample] = useState(null as TreeGardenDataSample|null);

  return {
    currentTree,
    setCurrentTree,
    currentSample,
    setCurrentSample
  };
};


export const { Context: AppDataContext, ContextProvider: AppDataContextProvider } = genericHookContextBuilder(useAppData);


