import { ISettings, IMod } from "../interfaces";
import { RLMTTypes } from "./constants";

export interface IInitializationRequest {
  type: RLMTTypes.INITIALIZATION_REQUEST;
}

export interface IInitializationSuccess {
  type: RLMTTypes.INITIALIZATION_SUCCESS;
  payload: {
    settings: ISettings | null;
    mods: IMod[];
    activatedMods: string[];
    checkedMods: Map<string, boolean>;
  };
}

export interface IInitializationFailure {
  type: RLMTTypes.INITIALIZATION_FAILURE;
}

export interface IChangeSettings {
  type: RLMTTypes.CHANGE_SETTINGS;
  payload: ISettings;
}

export interface ISelectModRequest {
  type: RLMTTypes.SELECT_MOD_REQUEST;
  payload: number;
}

export interface ISelectModResponse {
  type: RLMTTypes.SELECT_MOD_RESPONSE;
  payload: IMod;
}

export interface IActivateModRequest {
  type: RLMTTypes.ACTIVATE_MOD_REQUEST;
}

export interface IActivateModSuccess {
  type: RLMTTypes.ACTIVATE_MOD_SUCCESS;
  payload: string[];
}

export interface IActivateModFailure {
  type: RLMTTypes.ACTIVATE_MOD_FAILURE;
}

export interface ICheckMod {
  type: RLMTTypes.CHECK_MOD;
  payload: {
    index: number;
    checked: boolean;
  }
}

export type RLMTActionTypes = IInitializationRequest |
  IInitializationSuccess |
  IInitializationFailure |
  IChangeSettings |
  ISelectModRequest |
  ISelectModResponse |
  IActivateModRequest |
  IActivateModSuccess |
  IActivateModFailure |
  ICheckMod;

export function initializationRequest(): IInitializationRequest {
  return {
    type: RLMTTypes.INITIALIZATION_REQUEST,
  };
}

export function initializationSuccess(settings: ISettings | null, mods: IMod[], activatedMods: string[], checkedMods: Map<string, boolean>): IInitializationSuccess {
  return {
    type: RLMTTypes.INITIALIZATION_SUCCESS,
    payload: {
      settings,
      mods,
      activatedMods,
      checkedMods,
    },
  };
}

export function initializationFailure(): IInitializationFailure {
  return {
    type: RLMTTypes.INITIALIZATION_FAILURE,
  };
}

export function changeSettings(newSettings: ISettings): IChangeSettings {
  return {
    type: RLMTTypes.CHANGE_SETTINGS,
    payload: newSettings,
  };
}

export function selectModRequest(index: number): ISelectModRequest {
  return {
    type: RLMTTypes.SELECT_MOD_REQUEST,
    payload: index,
  };
}

export function selectModResponse(mod: IMod): ISelectModResponse {
  return {
    type: RLMTTypes.SELECT_MOD_RESPONSE,
    payload: mod,
  };
}

export function activateModRequest(): IActivateModRequest {
  return {
    type: RLMTTypes.ACTIVATE_MOD_REQUEST,
  };
}

export function activateModSuccess(activatedMods: string[]): IActivateModSuccess {
  return {
    type: RLMTTypes.ACTIVATE_MOD_SUCCESS,
    payload: activatedMods,
  };
}

export function activateModFailure(): IActivateModFailure {
  return {
    type: RLMTTypes.ACTIVATE_MOD_FAILURE,
  };
}

export function checkMod(index: number, checked: boolean): ICheckMod {
  return {
    type: RLMTTypes.CHECK_MOD,
    payload: { index, checked },
  };
}