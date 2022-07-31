import React, { useCallback, useState } from 'react';
import { useReSpecTContext } from '../../../store';
import BodyControl from './BodyControl';
import HeadersControl from './HeadersControl';
import { Container, Divider, TSendButton, TExecuter, TInput, TInputMethod, TUrl, TMethod, TConfigTabs, TTab, TLink, TTabContent } from './styles';
import Badge from '../../components/Badge';


type Tabs = 'headersTab' | 'bodyTab';

const RequestExecuter = () => {
  const { appState, requestExecuterState } = useReSpecTContext();
  const [currentTab, setCurrentTab] = useState<Tabs>();

  const handleRun = useCallback(() => {
    requestExecuterState.doRequest(appState.tab.id);
  }, [appState.tab.id]);

  const handleTabClick = useCallback((tab: Tabs) => {
    setCurrentTab(prev => {
      return prev !== tab ? tab : undefined;
    });
  }, []);

  return (
    <Container>
      <TExecuter>
        <TMethod>
          <TInputMethod placeholder='method' value={requestExecuterState.method} onChange={(value) => requestExecuterState.setMethod(value)} />
        </TMethod>
        <Divider />
        <TUrl>
          <TInput placeholder='url' value={requestExecuterState.url} onChange={(value) => requestExecuterState.setUrl(value)} />
        </TUrl>
        <TConfigTabs>
          <TTab><TLink onClick={() => handleTabClick('headersTab')} active={currentTab === 'headersTab'}>Headers<Badge value={requestExecuterState.headersValidCount} /> </TLink></TTab>
          <TTab><TLink onClick={() => handleTabClick('bodyTab')} active={currentTab === 'bodyTab'}>Body<Badge value={requestExecuterState.bodyValidCount} /></TLink></TTab>
        </TConfigTabs>
        <TSendButton onClick={handleRun} disabled={!requestExecuterState.isValid || requestExecuterState.loading}>
          Send
        </TSendButton>
      </TExecuter>
      {
        currentTab &&
        <TTabContent>
          {
            currentTab === 'headersTab' && <HeadersControl requestHeaders={requestExecuterState.headers} onChange={x => requestExecuterState.addEmptyHeader()} />
          }
          {
            currentTab === 'bodyTab' && <BodyControl body={requestExecuterState.body} onChange={x => requestExecuterState.setBody(x)} />
          }
        </TTabContent>
      }
    </Container>
  );
};

export default RequestExecuter;
