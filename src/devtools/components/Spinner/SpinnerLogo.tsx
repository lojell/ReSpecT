import React, { useEffect, useRef, useState } from 'react';
import styled from "styled-components";
import LogoIco from '../../../assets/logo.svg';

const TSpinnerContainer = styled.div`
  z-index: 10000;
  margin: 3px;
`;

const TSpinnerWrapper = styled.div<{ enabled?: boolean }>`
  animation: ${({ enabled }) => enabled ? '1000ms linear infinite spinner' : 'opacier 40ms ease 0s 1 normal forwards'};
  will-change: transform, opacity;
  width: 30px;
  height: 30px;
  /* opacity: ${({ enabled }) => enabled ? '1' : '0.3'}; */
  /* animation: ${({ enabled }) => enabled ? 'none' : 'opacier 100ms'}; */

  /* animation-play-state: ${({ enabled }) => enabled ? 'running' : 'paused'}; */
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes opacier {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
`;

const SpinnerLogo: React.FC<{ enabled?: boolean }> = React.memo(({ enabled }) => {
  const [enabledState, setEnabledState] = useState(enabled);

  const ref = useRef(null);

  useEffect(() => {
    setEnabledState(enabled)
  }, [enabled])

  return (
    <TSpinnerContainer ref={ref}>
      <TSpinnerWrapper enabled={enabledState}>
        <LogoIco height={30} />
      </TSpinnerWrapper>
    </TSpinnerContainer>
  );
})

export default SpinnerLogo
