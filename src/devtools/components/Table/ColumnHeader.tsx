import React, { FC, MutableRefObject, RefObject, useCallback, useEffect, useState } from 'react'
import { Column } from '.'
import { ColumnCell, ColumnResizer } from './styles'

interface ColumnHeaderProps {
  data: Column
  onRizeStart: (col: Column) => void
}

const ColumnHeader = React.forwardRef<HTMLDivElement, ColumnHeaderProps>(({ data, onRizeStart }, ref: MutableRefObject<any>) => {

  return (
    <ColumnCell ref={ref}>
      {data.title}
      <ColumnResizer onMouseDown={() => onRizeStart(data)} />
    </ColumnCell>
  )
});

export default ColumnHeader