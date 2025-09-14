// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  buscarOfertas: (palabrasClave) => ipcRenderer.invoke('iniciar-busqueda', palabrasClave),
  autocompletar: (datos) => ipcRenderer.invoke('iniciar-asistente', datos)
});