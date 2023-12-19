import {
  IMod,
  ISettings,
} from '../interfaces';
import { RLMTActionTypes } from './actions';
import { RLMTTypes } from './constants';

export interface IRLMTStore {
  initializing: boolean;
  initialized: boolean;

  settings: ISettings | null;
  mods: IMod[];

  selectedMod: IMod | null;
  checkedMods: Map<string, boolean>;

  activating: boolean;
  activatedMods: string[];
}

const defaultValue: IRLMTStore = {
  initializing: false,
  initialized: false,

  settings: null,
  mods: [],

  selectedMod: null,
  checkedMods: new Map<string, boolean>(),

  activating: false,
  activatedMods: [],
};

export default function reducer(state: IRLMTStore = defaultValue, action: RLMTActionTypes) {
  switch (action.type) {
    case RLMTTypes.INITIALIZATION_REQUEST:
      return {
        ...state,
        initializing: true,
      };
    case RLMTTypes.INITIALIZATION_SUCCESS:
      return {
        ...state,
        initializing: false,
        initialized: true,
        ...action.payload,
      };
    case RLMTTypes.INITIALIZATION_FAILURE:
      return {
        ...state,
        initializing: false,
      };
    case RLMTTypes.CHANGE_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case RLMTTypes.SELECT_MOD_RESPONSE:
      return {
        ...state,
        selectedMod: action.payload,
      };
    case RLMTTypes.ACTIVATE_MOD_REQUEST:
      return {
        ...state,
        activating: true,
      };
    case RLMTTypes.ACTIVATE_MOD_SUCCESS:
      return {
        ...state,
        activating: false,
        activatedMods: [ ...action.payload ],
      };
    case RLMTTypes.ACTIVATE_MOD_FAILURE:
      return {
        ...state,
        activating: false,
      };
    case RLMTTypes.CHECK_MOD: {
      const mod = state.mods[action.payload.index];
      const checkedMods = state.checkedMods;
      checkedMods.set(mod.path, action.payload.checked);
      return {
        ...state,
        checkedMods: new Map<string, boolean>(checkedMods),
      };
    };
    case RLMTTypes.CHECK_ALL_MODS: {
      const checkedMods = new Map<string, boolean>();
      state.mods.forEach(mod => checkedMods.set(mod.path, true));
      return {
        ...state,
        checkedMods,
      };
    };
    case RLMTTypes.CLEAR_CHECKED_MODS:
      return {
        ...state,
        checkedMods: new Map<string, boolean>(),
      };
    default: return state;
  }
}