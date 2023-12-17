import { compose } from '@reduxjs/toolkit';
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from '../rootReducer';
import rootSagas from '../rootSagas';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export function configureAppStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares:any[] = [sagaMiddleware];

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(createLogger({ collapsed: true }));
  }

  const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares),
  );

  sagaMiddleware.run(rootSagas);

  return store;
}
