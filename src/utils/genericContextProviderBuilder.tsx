import React from 'react';


// crafted with love by Jakub Svehla
type Props = {
  children: React.ReactNode
};
export const genericHookContextBuilder = <T, P>(hook: () => T) => {
  const Context = React.createContext<T>(undefined as never);

  return {
    Context,
    ContextProvider: (props: Props & P) => {
      const value = hook();
      return <Context.Provider value={value}>{props.children}</Context.Provider>;
    }
  };
};
