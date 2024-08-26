import { AppShell, Burger, Group, Text, Stack, Container } from '@mantine/core'
import NoteArea from '../NoteArea/NoteArea'
import UserMenu from '../UserMenu/UserMenu'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { Note } from '../../types/Note'
import './BasicAppShell.css'

// Generate random notes
const generateRandomNotes = (count: number): Note[] => {
  return Array(count)
    .fill(0)
    .map((_, index) => ({
      id: index,
      header: `Note ${index + 1}`,
      body: `This is the body of notes ${index + 1} `,
      date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
    }))
}

function BasicAppShell(): JSX.Element {
  const [opened, { toggle }] = useDisclosure()
  const [notes] = useState<Note[]>(generateRandomNotes(15))
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  return (
    <AppShell
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <UserMenu />
        <Container fluid style={{ overflowY: 'auto', width: '100%', paddingTop: '1rem' }}>
          <Stack>
            {notes.map((note) => (
              <Group
                key={note.id}
                onClick={() => setSelectedNote(note)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedNote?.id === note.id ? '#f0f0f0' : 'transparent',
                  padding: '2px',
                  borderRadius: '4px'
                }}
              >
                <Container fluid>
                  <Text fw={700}>{note.header}</Text>
                  <Text size="sm" truncate="end" c="dimmed">
                    {note.body}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {note.date}
                  </Text>
                </Container>
              </Group>
            ))}
          </Stack>
        </Container>
      </AppShell.Navbar>
      <AppShell.Main>
        <NoteArea selectedNote={selectedNote} />
      </AppShell.Main>
    </AppShell>
  )
}

export default BasicAppShell
