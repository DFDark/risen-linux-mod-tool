export interface ISettings {
  risenExeFolder: string;
  risenModFolder: string;
}

export interface IMod {
  name: string;
  image: string;
  description: string;
  path: string;
  common: string[];
  compiled: string[];
}

export interface FileLink {
  modPath: string;
  targetFolder: string;
  source: string;
  target: string;
}

export interface IRLMTIPC {
  chooseFolderPath: () => Promise<string | null>;
  saveSettings: (settings: ISettings) => Promise<void>;
  loadSettings: () => Promise<ISettings | null>;
  loadModList: (modPath: string) => Promise<IMod[]>;
  convertRTF: (rtf: string) => Promise<string>;
  deactivateAllMods: (risenPath: string) => Promise<void>;
  activateMods: (risenPath: string, links: FileLink[]) => Promise<void>;
  saveActivatedMods: (activatedMods: string[]) => Promise<void>;
  loadActivatedMods: () => Promise<string[]>;
}