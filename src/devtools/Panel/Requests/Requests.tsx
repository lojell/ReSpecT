import React, { FC, useCallback } from 'react'
import HAR from '../../../models/HAR';
import { useReSpecTContext } from '../../../store';
import Table from '../../components/Table';
import { rowActions } from '../../components/Table/Row';
import { Column } from '../../components/Table/types';
import { Container, EmptyContainer, LogoIcoStyled } from './styles';

const rowStyleHandler = (har: HAR): React.CSSProperties => {
  if (har.hasError) {
    return {
      "color": '#ee442f'
    }
  }

  return undefined;
};

const EmptyRequestsTableBadge: FC = () => {
  return (
    <EmptyContainer>
      <LogoIcoStyled height={40} /> 
      Refresh the page or call an API endpoint using tool below to see the OpenApi spec.
    </EmptyContainer>
  );

}

const Requests: FC = () => {
  const { appState, requestExecuterState } = useReSpecTContext();

  const columns = React.useMemo<Column<HAR>[]>(() => [
    {
      title: 'Name',
      field: 'urlEx.shortUrlName',
      width: "1fr"
    },
    {
      title: 'Status',
      field: (har) => har.status,
      width: "50px"
    },
    {
      title: 'Method',
      field: 'request.request.method',
      width: "55px"
    },
    {
      title: 'Response',
      field: (har) => har.responseBody ? JSON.stringify(har.responseBody) : null,
      width: "2fr"
    }
  ], []);

  const handleRowAction = useCallback((request, action: rowActions) => {
    if (action === 'remove') {
      appState.removeRequest(request);
    }
  }, []);

  const handleRowClick = useCallback(request => {
    requestExecuterState.setFromRequest(request);
  }, []);


  return (
    <Container>
      {
        appState.filteredRequests.length
          ? <Table<HAR> columns={columns} data={appState.filteredRequests} rowAction={handleRowAction} rowStyle={rowStyleHandler} onRowClick={handleRowClick} />
          : <EmptyRequestsTableBadge />
      }
    </Container>
  )
}

export default Requests;
