import { createSelector } from 'reselect';
import { IRLMTStore } from './reducer';

const makeRLMT = () => (state: { rlmt: IRLMTStore; }): IRLMTStore => state.rlmt;

const makeSelectInitializing = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.initializing,
);

const makeSelectInitialized = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.initialized,
);

const makeSelectSettings = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.settings,
);

const makeSelectMods = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.mods,
);

const makeSelectSelectedMod = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.selectedMod,
);

const makeSelectModActivating = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.activating,
);

const makeSelectActivatedMods = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.activatedMods,
);

const makeSelectCheckedMods = () => createSelector(
  makeRLMT(),
  (rlmt) => rlmt.checkedMods,
);

export {
  makeSelectInitializing,
  makeSelectInitialized,
  makeSelectSettings,
  makeSelectMods,
  makeSelectSelectedMod,
  makeSelectModActivating,
  makeSelectActivatedMods,
  makeSelectCheckedMods,
};