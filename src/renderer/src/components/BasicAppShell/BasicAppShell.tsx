import { AppShell, Burger, Group, Text, Stack } from '@mantine/core'
import NoteArea from '../NoteArea/NoteArea'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Note } from '../../types/Note'

// Generate random notes
const generateRandomNotes = (count: number): Note[] => {
  return Array(count)
    .fill(0)
    .map((_, index) => ({
      id: index,
      header: `Note ${index + 1}`,
      body: `This is the body of note ${index + 1}`,
      date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
    }))
}

function BasicAppShell(): JSX.Element {
  const [opened, { toggle }] = useDisclosure()
  const [notes] = useState<Note[]>(generateRandomNotes(15))
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack>
          {notes.map((note) => (
            <Group
              key={note.id}
              onClick={() => setSelectedNote(note)}
              style={{ cursor: 'pointer' }}
            >
              <Text fw={700}>{note.header}</Text>
              <Text size="sm" c="dimmed">
                {note.date}
              </Text>
            </Group>
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <NoteArea selectedNote={selectedNote} />
      </AppShell.Main>
    </AppShell>
  )
}

export default BasicAppShell
