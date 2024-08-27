import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

const dbPath = path.join(app.getPath('userData'), 'instanotes.db')
const db = new Database(dbPath)

// Create the notes table if it doesn't exist and add the category column if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    header TEXT,
    body TEXT,
    date_created TEXT,
    date_modified TEXT,
    category TEXT
  );

  -- Add category column if it doesn't exist
  BEGIN TRANSACTION;
  ALTER TABLE notes ADD COLUMN category TEXT DEFAULT NULL;
  COMMIT;
`)

export interface Note {
  id?: number
  header: string
  body: string
  date_created?: string
  date_modified?: string
  category: string
}

export function addNote(note: Note): number {
  const stmt = db.prepare(`
    INSERT INTO notes (header, body, date_created, date_modified, category)
    VALUES (?, ?, datetime('now'), datetime('now'), ?)
  `)
  const result = stmt.run(note.header, note.body, note.category)
  return result.lastInsertRowid as number
}

export function getNotes(): Note[] {
  const stmt = db.prepare('SELECT * FROM notes ORDER BY date_modified DESC')
  return stmt.all() as Note[]
}

export function updateNote(note: Note): void {
  const stmt = db.prepare(`
    UPDATE notes
    SET header = ?, body = ?, date_modified = datetime('now'), category = ?
    WHERE id = ?
  `)
  stmt.run(note.header, note.body, note.category, note.id)
}

export function deleteNote(id: number): void {
  const stmt = db.prepare('DELETE FROM notes WHERE id = ?')
  stmt.run(id)
}

export default db
