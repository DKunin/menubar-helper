const { contextBridge, ipcRenderer } = require('electron');
const pkg = require('../package.json');

contextBridge.exposeInMainWorld('electronAPI', {
    getConfig: () => ipcRenderer.invoke('get-config'),
    setConfig: (settings) => ipcRenderer.invoke('set-config', settings),
    restartServer: (forceRestart) =>
        ipcRenderer.invoke('restart-server', forceRestart),
    version: pkg.version
});
