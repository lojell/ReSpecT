import React, { useCallback, useMemo } from 'react';

import { Cell, TRow, TRowControls } from './styles';
import { ColumnForRow } from './types';
import { DragItemTypes, DropContext } from '../../panel/types';
import IconButton from '../IconButton';

export type rowActions = 'remove' | 'unknown';

interface RowProps<T extends object> {
  columns: ColumnForRow[];
  rowData: T;
  onControlClick: (rowData: T, action: rowActions) => void;
  rowStyle: (har: T) => React.CSSProperties;
  onRowClick: (item: T) => void;
}

const getValue = <T extends object>(data: T, column: ColumnForRow) => {
  if (typeof column.fieldValueResolver === 'function') {
    return column.fieldValueResolver(data);
  } else {
    return column.fieldValueResolver.reduce((value, field) => value = value[field], data);
  }
}

function Row<T extends object>({ columns, rowData, onControlClick, rowStyle, onRowClick }: RowProps<T>) {

  const rowCustomeStyle = useMemo(() => rowStyle(rowData), [rowData]);

  const handleControlClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onControlClick(rowData, 'remove')
    },
    [rowData],
  )

  return (
    <TRow style={rowCustomeStyle} onClick={() => onRowClick(rowData)}>
      {
        columns.map((col, idx) => <Cell key={idx}>{getValue(rowData, col)}</Cell>)
      }
      <TRowControls>
        <IconButton name='remove' onClick={handleControlClick} />
      </TRowControls>
    </TRow>
  );
}


export default Row;
