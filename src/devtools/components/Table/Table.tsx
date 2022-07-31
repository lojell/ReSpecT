import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Body, ColumnCell, Container, Header } from './styles';
import Row, { rowActions } from './Row';
import { Column, ColumnForRow } from './types';
import ColumnHeader from './ColumnHeader';

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[]
  rowAction: (rowData: T, action: rowActions) => void;
  onRowClick: (rowData: T) => void;
  rowStyle: (har: T) => React.CSSProperties;
}

const convertToRowColumn = (columns: Column[]): ColumnForRow[] => {
  return columns.map(x => ({
    fieldValueResolver: typeof x.field === 'function' ? x.field : x.field.split('.')
  }));
}

function Table<T extends object>({ columns, data, rowAction, rowStyle, onRowClick }: TableProps<T>) {

  const rowColumns = useMemo(() => convertToRowColumn(columns), [columns]);
  const tableHederRef = useRef(null);
  const tableRowRef = useRef(null);
  const columnsWithRefs = columns.map(column => ({ column, ref: useRef(null) }));

  const [tableWidth, setTableWidth] = useState(0);
  const [activeResizeColumn, setActiveResizeColumn] = useState(null);

  useEffect(() => {
    setTableWidth(tableHederRef.current?.offsetWidth);
  }, [tableHederRef, tableHederRef.current?.offsetWidth]);

  const mouseMove = useCallback(
    (e) => {
      let delta = 0;
      let totalWidth = 0;
      const gridColumns = columnsWithRefs.map((col, i) => {
        let colWidth = col.ref.current?.offsetWidth;

        if (col.column === activeResizeColumn) {
          const width = e.clientX - col.ref.current?.offsetLeft;
          delta = col.ref.current?.offsetWidth - width;
          if (width >= (+col.column.width?.replace('px', '') || 100)) {
            colWidth = width;
          }
        } else if (i === (columnsWithRefs.length - 1)) {
          const width = col.ref.current?.offsetWidth + delta;
          if (width >= (+col.column.width?.replace('px', '') || 100)) {
            colWidth = width;
          }
        }

        totalWidth += colWidth;

        return `${colWidth}fr`;
      });

      if (totalWidth <= tableWidth) {
        const gridTemplateColumns = gridColumns.join(" ");
        tableHederRef.current.style.gridTemplateColumns = `${gridTemplateColumns} 20px`;
        tableRowRef.current.style.gridTemplateColumns = `${gridTemplateColumns} 37px`;
      }
    },
    [columnsWithRefs, activeResizeColumn, tableWidth]
  );

  const removeListeners = useCallback(() => {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", removeListeners);
  }, [mouseMove]);

  const mouseUp = useCallback(() => {
    setActiveResizeColumn(null);
    removeListeners();
  }, [setActiveResizeColumn, removeListeners]);

  useEffect(() => {
    if (activeResizeColumn !== null) {
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }

    return () => {
      removeListeners();
    };
  }, [activeResizeColumn, mouseMove, mouseUp, removeListeners]);


  return (
    <Container>
      <Header columns={columns} ref={tableHederRef}>
        {
          columnsWithRefs.map(col => <ColumnHeader key={col.column.title} data={col.column} ref={col.ref} onRizeStart={c => setActiveResizeColumn(c)} />)
        }
      </Header>
      <Body columns={columns} ref={tableRowRef}>
        {
          data.map((row, idx) => <Row key={idx} columns={rowColumns} rowData={row} onControlClick={rowAction} rowStyle={rowStyle} onRowClick={onRowClick} />)
        }
      </Body>
    </Container>
  );
}

export default Table;