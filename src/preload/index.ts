import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Note } from '../main/database'

// Custom APIs for renderer
const api = {
  addNote: (note: Note): Promise<Note> => ipcRenderer.invoke('add-note', note),
  getNotes: (): Promise<Note[]> => ipcRenderer.invoke('get-notes'),
  updateNote: (note: Note): Promise<Note> => ipcRenderer.invoke('update-note', note),
  deleteNote: (id: number): Promise<void> => ipcRenderer.invoke('delete-note', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
