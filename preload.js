const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.invoke('minimize-window'),
  processText: (text) => ipcRenderer.invoke('process-text', text),
  getSelectedText: () => ipcRenderer.invoke('get-selected-text'),
  setClipboard: (text) => ipcRenderer.invoke('set-clipboard', text),
  simulatePaste: () => ipcRenderer.invoke('simulate-paste'),
  focusPreviousWindow: () => ipcRenderer.invoke('focus-previous-window')
});
