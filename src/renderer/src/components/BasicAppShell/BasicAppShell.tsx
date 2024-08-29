// Add this type declaration at the top of the file

import { AppShell, Burger, Group, Text, Stack, Container } from '@mantine/core'
import NoteArea from '../NoteArea/NoteArea'
// import UserMenu from '../UserMenu/UserMenu'
import { useDisclosure } from '@mantine/hooks'
import { useState, useEffect } from 'react'
import { Note } from '../../types/Note'
import './BasicAppShell.css'

// Add these utility functions at the top of the file, after the imports
const stripHtml = (html: string): string => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

const getFirstParagraph = (html: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const firstP = doc.querySelector('p')
  return firstP ? stripHtml(firstP.innerHTML) : ''
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === now.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }
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
        // Select the first note if the list is not empty
        if (fetchedNotes.length > 0 && !selectedNote) {
          setSelectedNote(fetchedNotes[0])
        }
      } catch (error) {
        console.error('Failed to fetch notes:', error)
      }
    }

    fetchNotes()
  }, [selectedNote])

  return (
    <AppShell
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Navbar>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        {/* <UserMenu /> */}
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
                  borderRadius: '4px',
                  width: '100%'
                }}
              >
                <Stack gap={4} style={{ width: '100%' }}>
                  <Text truncate="end" fw={700} style={{ textAlign: 'left', userSelect: 'none' }}>
                    {getFirstParagraph(note.body)}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ textAlign: 'left', userSelect: 'none' }}>
                    {formatDate(note.date_modified)}
                  </Text>
                </Stack>
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
