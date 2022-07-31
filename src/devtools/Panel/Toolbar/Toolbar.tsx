import React, { FC, useCallback, useMemo } from 'react'
import { useReSpecTContext } from '../../../store';
import { Container, Control, Divider, Select, ToolbarButton } from './styles';

import RecordIcon from '../../../assets/record.svg';
import StopIcon from '../../../assets/stop.svg';
import FilterGroup from '../../components/FilterGroup';

const Filters: FC = () => {
  const { appState } = useReSpecTContext();

  const handleRequestFilter = useCallback((activeUrls: string[]) => {
    appState.setRequestFilter(activeUrls);
  }, []);

  return (
    <Container>
      <ToolbarButton title="Stop recording network log" onClick={() => appState.setCaptureNetwork(!appState.captureNetwork)}>
        {
          appState.captureNetwork
            ? <RecordIcon style={{ filter: "drop-shadow( 0px 0px 2px #d93025)", color: '#d93025' }} />
            : <RecordIcon />
        }
      </ToolbarButton>

      <ToolbarButton title="Clear network table" onClick={() => appState.clearRequests()}>
        <StopIcon />
      </ToolbarButton>

      <Divider />

      <FilterGroup
        noFilterTitle="All requests"
        items={appState.baseUrls}
        activeItems={appState.filteredUrls}
        filterButton={appState.hostFilter}
        onChange={handleRequestFilter}
      />

      <Divider />

      {/* <Control>
        <input type="checkbox" checked={appState.groupByRequest} onChange={() => appState.setGroupByRequest(!appState.groupByRequest)} /> Group by request
      </Control> */}

    </Container>
  )
}

export default Filters;
