import { useState } from 'react';
import { TreeGardenNode } from 'tree-garden';
import { TreeGardenDataSample } from 'tree-garden/dist/dataSet';

import { genericHookContextBuilder } from './utils/genericContextProviderBuilder';

let errorCounter = 0;
const errorShownDuration = 3 * 1000; // milliseconds
const maxErrors = 4;
const useAppData = () => {
  const [currentTree, setCurrentTree] = useState(null as TreeGardenNode|TreeGardenNode[]|null);
  const [currentSample, setCurrentSample] = useState(null as TreeGardenDataSample|null);
  const [errors, setErrors] = useState([] as [number, string][]);
  const addError = (newError:string) => {
    console.warn(newError);

    const errorId = errorCounter;
    errorCounter += 1;

    setErrors((oldErrors) => {
      // ensure correct number throw away oldest
      const errosWithRemovedOldes = oldErrors
        .reverse()
        .slice(0, maxErrors - 1)
        .reverse();
      return [[errorId, newError], ...errosWithRemovedOldes];
    });
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
    addError
  };
};


export const { Context: AppDataContext, ContextProvider: AppDataContextProvider } = genericHookContextBuilder(useAppData);


