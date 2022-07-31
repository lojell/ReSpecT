import React, { FC, useEffect, useState } from 'react'
import { useReSpecTContext } from '../../store';
import Header from './Header';
import Toolbar from './Toolbar';
import Requests from './Requests';
import { Container, LeftPanel, Main } from './styles';
import Tools from './Tools';
import RequestExecuter from './RequestExecuter';
import Notifications from './Notifications';

interface AppProps {
  tab: chrome.tabs.Tab
}

const App: FC<AppProps> = ({ tab }) => {
  const { appState } = useReSpecTContext();

  useEffect(() => {
    appState.initialize(tab);
  }, [tab])

  if (!appState.ready)
    return null;

  return (
    <Container>
      <Header />
      <Toolbar />
      <Main>
        <LeftPanel>
          <Requests />
          <RequestExecuter />
        </LeftPanel>
        <Tools />
      </Main>
      <Notifications />
    </Container>
  )
}

export default App
