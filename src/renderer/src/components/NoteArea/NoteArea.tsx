import React from 'react'
import { Note } from '../../types/Note'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import './NoteArea.css'
import { IconPlus, IconTrash } from '@tabler/icons-react'

interface NoteAreaProps {
  selectedNote: Note | null
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
  setSelectedNote: React.Dispatch<React.SetStateAction<Note | null>>
}

function NoteArea({ selectedNote, setNotes, setSelectedNote }: NoteAreaProps): JSX.Element {
  const content = selectedNote || ''

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content,
    onUpdate: ({ editor }) => {
      // Save data logic
      const updatedNote: Note = {
        id: selectedNote?.id || 0,
        header: '',
        body: editor.getHTML(),
        date_created: selectedNote?.date_created || '',
        date_modified: new Date().toISOString()
      }
      window.electron.ipcRenderer.invoke('update-note', updatedNote)
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
      )
      console.log(editor.getHTML())
    }
  })

  React.useEffect(() => {
    if (editor && selectedNote) {
      const { body } = selectedNote
      const content = `${body}`
      editor.commands.setContent(content)
    }
  }, [editor, selectedNote])

  const handleDeleteNote = (): void => {
    if (selectedNote && window.confirm('Are you sure you want to delete this note?')) {
      // Clear the content of the note
      if (editor) {
        editor.commands.setContent('')
      }

      window.electron.ipcRenderer
        .invoke('delete-note', selectedNote.id)
        .then(() => {
          setNotes((prevNotes) => prevNotes.filter((note) => note.id !== selectedNote.id))
          setSelectedNote(null)
        })
        .catch((error) => {
          console.error('Failed to delete note:', error)
        })
    }
  }

  const handleAddNewNote = (): void => {
    const newNote: Note = {
      id: Date.now(),
      header: '',
      body: '',
      date_created: new Date().toISOString(),
      date_modified: new Date().toISOString()
    }
    window.electron.ipcRenderer
      .invoke('add-note', newNote)
      .then(() => {
        setNotes((prevNotes) => [...prevNotes, newNote])
        setSelectedNote(newNote)
      })
      .catch((error) => {
        console.error('Failed to add new note:', error)
      })
  }

  return (
    <RichTextEditor editor={editor} className="borderless-editor">
      <RichTextEditor.Toolbar sticky>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control title="Add New Note" onClick={handleAddNewNote}>
            <IconPlus size={16} />
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Control title="Delete Note" onClick={handleDeleteNote}>
            <IconTrash size={16} />
          </RichTextEditor.Control>
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
export default NoteArea
