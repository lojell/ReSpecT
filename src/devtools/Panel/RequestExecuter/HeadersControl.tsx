import React, { FC, useCallback, useState } from 'react';

import { useReSpecTContext } from '../../../store';
import { HeaderInput, THeadersContainer, TCell } from './styles';
import { RequestHeader } from './types';

interface HeaderControlProps {
  requestHeader: RequestHeader;
  addNewRowEvent: () => void;
  onChange: (requestHeader: RequestHeader) => void;
}

const HeaderItem: FC<HeaderControlProps> = React.memo(({ requestHeader, onChange, addNewRowEvent }) => {

  const [isFresh, setIsFresh] = useState(true);

  const [enabled, setEnabled] = useState(requestHeader.enabled);
  const [header, setHeader] = useState(requestHeader.header || '');
  const [value, setValue] = useState(requestHeader.value || '');

  const handleEnabledChange = useCallback(() => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onChange({ enabled: newEnabled, header, value })
  }, [enabled, header, value]);

  const handleHeaderChange = useCallback((e) => {
    if (isFresh && !header) {
      addNewRowEvent();
    }

    setHeader(e.target.value);
    setIsFresh(false);
    onChange({ enabled, header: e.target.value, value })
  }, [enabled, header, value, isFresh]);

  const handleValueChange = useCallback((e) => {
    if (isFresh && !value) {
      addNewRowEvent();
    }

    setValue(e.target.value);
    setIsFresh(false);
    onChange({ enabled, header, value: e.target.value })
  }, [enabled, header, value, isFresh]);

  console.log('render');

  return (
    <>
      <TCell>
        <input type="checkbox" checked={enabled} onChange={handleEnabledChange} tabIndex={-1} />
      </TCell>
      <TCell>
        <HeaderInput type="input" placeholder='Header' value={header} onChange={handleHeaderChange} disabled={!enabled} />
      </TCell>
      <TCell>
        <HeaderInput type="input" placeholder='Value' value={value} onChange={handleValueChange} disabled={!enabled} />
      </TCell>
    </>
  );
});

interface HeadersControlProps {
  requestHeaders: RequestHeader[];
  onChange: (requestHeaders: RequestHeader[]) => void;
}

const HeadersControl: FC<HeadersControlProps> = ({ requestHeaders = [], onChange }) => {
  const { requestExecuterState: vm } = useReSpecTContext();

  const handleAddNewRowEvent = useCallback((index) => {
    if (vm.headers.length === (index + 1)) {
      vm.addEmptyHeader();
    }
  }, [vm.headers.length]);

  return (
    <THeadersContainer>
      {
        vm.headers.map((header, index) =>
          <HeaderItem
            key={`${index}`}
            requestHeader={header}
            onChange={value => vm.updateHeader(value, index)}
            addNewRowEvent={() => handleAddNewRowEvent(index)}
          />)
      }
    </THeadersContainer >
  );
};

export default HeadersControl;
