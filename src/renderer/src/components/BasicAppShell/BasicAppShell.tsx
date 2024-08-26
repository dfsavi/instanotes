// Add this type declaration at the top of the file

import { AppShell, Burger, Group, Text, Stack, Container } from '@mantine/core'
import NoteArea from '../NoteArea/NoteArea'
import UserMenu from '../UserMenu/UserMenu'
import { useDisclosure } from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { Note } from '../../types/Note'
import './BasicAppShell.css'

const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function BasicAppShell(): JSX.Element {
  const [opened, { toggle }] = useDisclosure()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const fetchNotes = async (): Promise<void> => {
      try {
        const fetchedNotes = await window.electron.ipcRenderer.invoke('get-notes')
        setNotes(fetchedNotes)
        console.log('Fetched notes:', fetchedNotes)
      } catch (error) {
        console.error('Failed to fetch notes:', error)
      }
    }

    fetchNotes()
  }, [])

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
                  <Text truncate="end" fw={700}>
                    {stripHtml(note.body)}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {note.date_modified}
                  </Text>
                </Container>
              </Group>
            ))}
          </Stack>
        </Container>
      </AppShell.Navbar>
      <AppShell.Main>
        <NoteArea
          selectedNote={selectedNote}
          setNotes={setNotes}
          setSelectedNote={setSelectedNote}
        />
      </AppShell.Main>
    </AppShell>
  )
}

export default BasicAppShell
