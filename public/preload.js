const {
  ipcRenderer,
  contextBridge,
} = require('electron');

contextBridge.exposeInMainWorld('rlmt', {
  chooseFolderPath: async () => {
    const data = await ipcRenderer.invoke('open-folder-dialog');
    return data;
  },
  saveSettings: async (settings) => {
    await ipcRenderer.invoke('save-settings', settings);
  },
  loadSettings: async () => {
    const settings = ipcRenderer.invoke('load-settings');
    return settings;
  },
  loadModList: async (modPath) => {
    const modList = await ipcRenderer.invoke('load-mod-list', modPath);
    return modList;
  },
  convertRTF: async (rtf) => {
    const html = await ipcRenderer.invoke('convert-rtf', rtf);
    return html;
  },
  deactivateAllMods: async (risenPath) => {
    await ipcRenderer.invoke('deactivate-all-mods', risenPath);
  },
  activateMods: async (risenPath, links) => {
    await ipcRenderer.invoke('activate-mods', risenPath, links);
  },
  saveActivatedMods: async (activateMods) => {
    await ipcRenderer.invoke('save-activated-mods', activateMods);
  },
  loadActivatedMods: async() => {
    return await ipcRenderer.invoke('load-activated-mods');
  }
});