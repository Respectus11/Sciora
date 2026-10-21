import { getDatabase } from './db';

export interface StudentNote {
  id: number;
  lesson_id: string;
  unit_id: string;
  step_number: number;
  note_text: string;
  created_at: number;
  updated_at: number;
}

export interface LessonBookmark {
  lesson_id: string;
  unit_id: string;
  bookmarked_at: number;
}

export const notesRepository = {
  /**
   * Creates a new personal lab note for a lesson step.
   */
  async createNote(
    lessonId: string,
    unitId: string,
    stepNumber: number,
    noteText: string
  ): Promise<number> {
    const db = await getDatabase();
    const now = Date.now();
    const result = await db.runAsync(
      `INSERT INTO student_notes (lesson_id, unit_id, step_number, note_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [lessonId, unitId, stepNumber, noteText.trim(), now, now]
    );
    return result.lastInsertRowId;
  },

  /**
   * Retrieves all notes recorded for a specific lesson, sorted latest first.
   */
  async getNotesByLesson(lessonId: string): Promise<StudentNote[]> {
    const db = await getDatabase();
    return db.getAllAsync<StudentNote>(
      `SELECT * FROM student_notes WHERE lesson_id = ? ORDER BY created_at DESC;`,
      [lessonId]
    );
  },

  /**
   * Retrieves all personal student lab notes across the entire curriculum.
   */
  async getAllNotes(): Promise<StudentNote[]> {
    const db = await getDatabase();
    return db.getAllAsync<StudentNote>(
      `SELECT * FROM student_notes ORDER BY created_at DESC;`
    );
  },

  /**
   * Updates an existing student note.
   */
  async updateNote(id: number, noteText: string): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.runAsync(
      `UPDATE student_notes SET note_text = ?, updated_at = ? WHERE id = ?;`,
      [noteText.trim(), now, id]
    );
  },

  /**
   * Deletes a student note by ID.
   */
  async deleteNote(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM student_notes WHERE id = ?;`, [id]);
  },

  /**
   * Toggles bookmark state for a lesson. Returns true if now bookmarked, false if removed.
   */
  async toggleBookmark(lessonId: string, unitId: string): Promise<boolean> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<LessonBookmark>(
      `SELECT * FROM lesson_bookmarks WHERE lesson_id = ?;`,
      [lessonId]
    );

    if (existing) {
      await db.runAsync(`DELETE FROM lesson_bookmarks WHERE lesson_id = ?;`, [lessonId]);
      return false;
    } else {
      const now = Date.now();
      await db.runAsync(
        `INSERT INTO lesson_bookmarks (lesson_id, unit_id, bookmarked_at) VALUES (?, ?, ?);`,
        [lessonId, unitId, now]
      );
      return true;
    }
  },

  /**
   * Checks whether a lesson is bookmarked.
   */
  async isBookmarked(lessonId: string): Promise<boolean> {
    const db = await getDatabase();
    const existing = await db.getFirstAsync<LessonBookmark>(
      `SELECT lesson_id FROM lesson_bookmarks WHERE lesson_id = ?;`,
      [lessonId]
    );
    return !!existing;
  },

  /**
   * Retrieves all bookmarked lesson IDs.
   */
  async getAllBookmarks(): Promise<LessonBookmark[]> {
    const db = await getDatabase();
    return db.getAllAsync<LessonBookmark>(
      `SELECT * FROM lesson_bookmarks ORDER BY bookmarked_at DESC;`
    );
  },
};
