import AppState from './states/AppState';
import RequestExecuterState from './states/RequestExecuterState';
import SwaggerState from './states/SwaggerState';

export const initialState: GlobalState = {
  appState: new AppState(),
  swaggerState: new SwaggerState(),
  requestExecuterState: new RequestExecuterState()
};

export default interface GlobalState {
  appState: AppState;
  swaggerState: SwaggerState;
  requestExecuterState: RequestExecuterState;
}

