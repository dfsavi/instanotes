import '@mantine/core/styles.css'
import '@mantine/tiptap/styles.css'
import BasicAppShell from './components/BasicAppShell/BasicAppShell'

import { MantineProvider } from '@mantine/core'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <MantineProvider>
      <BasicAppShell />
    </MantineProvider>
  )
}

export default App
