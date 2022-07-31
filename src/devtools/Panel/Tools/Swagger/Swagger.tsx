import React, { FC, useCallback, useEffect, useRef } from 'react'
import lodash from 'lodash';

import { useReSpecTContext } from '../../../../store';
import { ButtonGroup, Button, Container, Divider, CornerBar, CopyButton } from './styles';
import CopyIcon from '../../../../assets/copy.svg';
import JsonViewer from '../../../components/JsonViewer';
import toast from 'react-hot-toast';

const Swagger: FC = () => {
  const { appState, swaggerState } = useReSpecTContext();

  const setRequestsDebounce = useRef(lodash.debounce((requests) => {
    swaggerState.setRequests(requests);
    swaggerState.setLoading(false);
  }, 500));

  useEffect(() => {
    swaggerState.setHost(appState.host);
  }, [appState.host]);

  useEffect(() => {
    swaggerState.setLoading(true);
    setRequestsDebounce.current(lodash.cloneDeep(appState.filteredRequests));
    return () => {
      setRequestsDebounce.current.cancel();
    }
  }, [appState.requests, appState.filteredUrls]);

  const doSaveDoc = useCallback(() => {
    swaggerState.saveDoc();
  }, []);

  const doClipboardCopy = useCallback(() => {
    swaggerState.clipboardCopy();
    toast.success('Copied to clipboard');
  }, []);


  return (
    <Container>
      <CornerBar>
        <CopyButton onClick={doClipboardCopy}><CopyIcon /></CopyButton>
      </CornerBar>

      <JsonViewer json={swaggerState.ouputSpec} />

      <Divider />

      <ButtonGroup>
        <Button onClick={doSaveDoc} disabled={!swaggerState.requests?.length}>Save to File</Button>
      </ButtonGroup>
    </Container >
  )
}

export default Swagger;
