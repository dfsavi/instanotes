import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css"
import { Container } from "@mantine/core";
import Navbar from "./components/Navbar/Navbar";
import NoteArea from "./components/NoteArea/NoteArea";
import BasicAppShell from "./components/BasicAppShell/BasicAppShell"
import electronLogo from "./assets/electron.svg";

import { MantineProvider } from "@mantine/core";

function App(): JSX.Element {
	const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

	return (
		<MantineProvider>
      <BasicAppShell />
		</MantineProvider>
	);
}

export default App;
