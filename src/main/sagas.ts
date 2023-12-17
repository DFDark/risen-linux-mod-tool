import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { RLMTTypes } from './constants';
import {
  IActivateModSuccess,
  ISelectModRequest,
  activateModFailure,
  activateModSuccess,
  initializationFailure,
  initializationSuccess,
  selectModResponse,
} from './actions';
import {
  FileLink,
  IMod,
  IRLMTIPC,
  ISettings,
} from '../interfaces';
import {
  makeSelectCheckedMods,
  makeSelectMods,
  makeSelectSettings,
} from './selectors';

declare global {
  interface Window {
    rlmt: IRLMTIPC;
  }
}

function* doInitialization() {
  try {
    const settings: ISettings | null = yield call(window.rlmt.loadSettings);
    const activatedModData: string[] | null = yield call(window.rlmt.loadActivatedMods);

    let mods: IMod[] = [];
    if (settings) {
      mods = yield call(window.rlmt.loadModList, settings.risenModFolder);
    }

    let activatedMods: string[] = [];
    const checkedMods: Map<string, boolean> = new Map<string, boolean>();
    if (activatedModData) {
      activatedMods = [ ...activatedModData];

      mods.forEach(mod => {
        if (activatedMods.indexOf(mod.path) !== -1) {
          checkedMods.set(mod.path, true);
        }
      })
    }
    

    yield put(initializationSuccess(settings, mods, activatedMods, checkedMods));
  } catch (err) {
    console.error(err);
    yield put(initializationFailure());
  }
}

function* doSaveSettings() {
  try {
    const settings: ISettings = yield select(makeSelectSettings());
    yield call(window.rlmt.saveSettings, settings);
  } catch (_) {}
}

function* doSelectMod(action: ISelectModRequest) {
  try {
    const mods: IMod[] = yield select(makeSelectMods());

    if (mods.length > action.payload) {
      let description: string = '';
      try {
        const html: string = yield call(window.rlmt.convertRTF, mods[action.payload].description);

        const htmlElement = document.createElement('html');
        htmlElement.innerHTML = html;
  
        const elem = htmlElement.getElementsByTagName('body');
        
        if (elem.length) {
          description = elem[0].innerHTML;
        }
      } catch (err) { console.error(err); }
      
      yield put(selectModResponse({
        ...mods[action.payload],
        description,
      }));
    }
  } catch (_) { }
}

function* doActivateMod() {
  try {
    const settings: ISettings = yield select(makeSelectSettings());
    const mods: IMod[] = yield select(makeSelectMods());
    const checkedMods: Map<string, boolean> = yield select(makeSelectCheckedMods());

    yield call(window.rlmt.deactivateAllMods, settings.risenExeFolder);

    const activatedMods: string[] = [];
    const fileLinks: FileLink[] = [];

    const fileIndexer: Map<string, number> = new Map<string, number>();
    mods.forEach(mod => {
      if (!!checkedMods.get(mod.path)) {
        activatedMods.push(mod.path);
        mod.common.forEach(file => {
          const sections = file.split('.');
          if (sections.length < 2) {
            throw new Error(`Wrong file included: ${file}`);
          }

          if (!fileIndexer.has(sections[0])) {
            fileIndexer.set(sections[0], 0);
          } else {
            fileIndexer.set(sections[0], (fileIndexer.get(sections[0]) || 0) + 1);
          }

          const index = (fileIndexer.get(sections[0]) || 0);
          fileLinks.push({
            modPath: mod.path,
            targetFolder: './common',
            source: file,
            target: `${sections[0]}.p${(index < 10 ? '0' : '')}${index}`
          });
        });

        mod.compiled.forEach(file => {
          const sections = file.split('.');
          if (sections.length < 2) {
            throw new Error(`Wrong file included: ${file}`);
          }

          if (!fileIndexer.has(sections[0])) {
            fileIndexer.set(sections[0], 0);
          } else {
            fileIndexer.set(sections[0], (fileIndexer.get(sections[0]) || 0) + 1);
          }

          const index = (fileIndexer.get(sections[0]) || 0);
          fileLinks.push({
            modPath: mod.path,
            targetFolder: './compiled',
            source: file,
            target: `${sections[0]}.p${(index < 10 ? '0' : '')}${index}`,
          });
        });
      }
    });

    yield call(window.rlmt.activateMods, settings.risenExeFolder, fileLinks);

    yield put(activateModSuccess(activatedMods));
  } catch (err) {
    console.error(err);
    yield put(activateModFailure());
  }
}

function* doSaveActivatedMods(action: IActivateModSuccess) {
  try {
    yield call(window.rlmt.saveActivatedMods, action.payload);
  } catch {}
}


export default function* sagas() {
  yield fork(function* initialize() {
    yield takeLatest(RLMTTypes.INITIALIZATION_REQUEST, doInitialization);
  });

  yield fork(function* watchSettingsChange() {
    yield takeLatest(RLMTTypes.CHANGE_SETTINGS, doSaveSettings);
  });

  yield fork(function* watchSelectMod() {
    yield takeLatest(RLMTTypes.SELECT_MOD_REQUEST, doSelectMod);
  });

  yield fork(function* watchModActivation() {
    yield takeLatest(RLMTTypes.ACTIVATE_MOD_REQUEST, doActivateMod);
  });

  yield fork(function* watchModsActivated() {
    yield takeLatest(RLMTTypes.ACTIVATE_MOD_SUCCESS, doSaveActivatedMods);
  });
}