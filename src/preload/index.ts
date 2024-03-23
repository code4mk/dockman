import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
interface CustomAPI {
  selectFolder: () => Promise<string | undefined>
  openFinder: (folderPath: string) => any
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {
      selectFolder: () => ipcRenderer.invoke('dialog:openDirectory') as Promise<string | undefined>,
      openFinder: (folderPath: string) => ipcRenderer.invoke('openFinder', folderPath),
      getUserDataPath: () => ipcRenderer.invoke('getUserDataPath')
    } as CustomAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = {
    selectFolder: () => ipcRenderer.invoke('dialog:openDirectory') as Promise<string | undefined>,
    openFinder: (folderPath: string) => ipcRenderer.invoke('openFinder', folderPath),
    getUserDataPath: () => ipcRenderer.invoke('getUserDataPath')
  } as CustomAPI
}
