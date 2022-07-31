import React, { createContext, FC, useContext } from 'react';
import GlobalState, { initialState } from './state';
import useStore from './useStore';

const store = createContext(initialState);
const { Provider } = store;

export const useReSpecTContext = (): GlobalState => useContext(store);

export const ContextProvider: FC = ({ children }) => {
  const state = useStore(initialState);

  return <Provider value={{ ...state }}>{children}</Provider>;
};
