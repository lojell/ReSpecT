import React, { FC } from 'react'
import { Body, Container, Navigation, NavigationButton } from './styles';

import { useReSpecTContext } from '../../../store';
import Swagger from './Swagger';
import SpinnerLogo from '../../components/Spinner/SpinnerLogo';

const Tools: FC = () => {
  const { appState, swaggerState } = useReSpecTContext();

  return (
    <Container expand={appState.isToolsExpanded}>
      <Navigation>
        <NavigationButton onClick={() => appState.setToolsExpanded(!appState.isToolsExpanded)}>
          <SpinnerLogo enabled={swaggerState.loading} />
        </NavigationButton>
      </Navigation>
      {
        appState.isToolsExpanded &&
        <Body>
          <Swagger />
        </Body>
      }
    </Container>
  )
}

export default Tools;
