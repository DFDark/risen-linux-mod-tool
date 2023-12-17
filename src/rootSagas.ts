import { fork } from "redux-saga/effects";
import rmltSagas from './main/sagas';

export default function* rootSagas() {
  yield fork(rmltSagas);
}
