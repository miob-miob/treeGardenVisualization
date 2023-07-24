import { useState } from 'react';
import { TreeGardenNode, TreeGardenDataSample } from 'tree-garden';

import { genericHookContextBuilder } from './utils/genericContextProviderBuilder';

let errorCounter = 0;
const errorShownDuration = 3.5 * 1000; // milliseconds
const maxErrors = 4;
const useAppData = () => {
  const [openedNode, setOpenedNode] = useState(null as TreeGardenNode | null);
  const [currentTree, setCurrentTree] = useState(null as TreeGardenNode | TreeGardenNode[] | null);
  const [currentSample, setCurrentSample] = useState(null as TreeGardenDataSample | null);
  const [errors, setErrors] = useState([] as [number, string][]);
  const addError = (newError:string) => {
    console.warn(newError);

    const errorId = errorCounter;
    errorCounter += 1;
    setErrors((oldErrors) => [[errorId, newError] as [number, string], ...oldErrors].slice(0, maxErrors));
    // let it disappear after timeout
    setTimeout(() => {
      setErrors((oldErrors) => oldErrors.filter(([errId]) => errId !== errorId));
    }, errorShownDuration);
  };
  return {
    currentTree,
    setCurrentTree,
    currentSample,
    setCurrentSample,
    errors,
    openedNode,
    setOpenedNode,
    addError
  };
};


export const { Context: AppDataContext, ContextProvider: AppDataContextProvider } = genericHookContextBuilder(useAppData);


