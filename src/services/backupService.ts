import { getDatabase } from '@/database/db';
import { LessonProgressRecord } from '@/database/progressRepository';
import { notesRepository, StudentNote, LessonBookmark } from '@/database/notesRepository';

export interface QuizAttemptRecord {
  id?: number;
  lesson_id: string;
  question_id: string;
  selected_index: number;
  is_correct: number;
  attempted_at: number;
}

export interface StudentBackupPayload {
  version: number;
  exportedAt: number;
  appVersion: string;
  progress: LessonProgressRecord[];
  notes: StudentNote[];
  bookmarks: LessonBookmark[];
  quizAttempts: QuizAttemptRecord[];
}

export interface ImportSummary {
  success: boolean;
  progressImported: number;
  notesImported: number;
  bookmarksImported: number;
  quizAttemptsImported: number;
  error?: string;
}

export const backupService = {
  /**
   * Validates the structure and version of an incoming student backup payload.
   */
  validatePayload(payload: unknown): { valid: boolean; reason?: string } {
    if (!payload || typeof payload !== 'object') {
      return { valid: false, reason: 'Payload must be a non-null JSON object.' };
    }

    const data = payload as Partial<StudentBackupPayload>;
    if (data.version !== 1) {
      return { valid: false, reason: `Unsupported schema version: ${data.version}. Expected version 1.` };
    }

    if (!Array.isArray(data.progress)) {
      return { valid: false, reason: 'Payload property "progress" must be an array.' };
    }
    if (!Array.isArray(data.notes)) {
      return { valid: false, reason: 'Payload property "notes" must be an array.' };
    }
    if (!Array.isArray(data.bookmarks)) {
      return { valid: false, reason: 'Payload property "bookmarks" must be an array.' };
    }
    if (!Array.isArray(data.quizAttempts)) {
      return { valid: false, reason: 'Payload property "quizAttempts" must be an array.' };
    }

    return { valid: true };
  },

  /**
   * Computes summary metrics for a student backup payload.
   */
  getPayloadSummary(payload: StudentBackupPayload): { totalRecords: number; estimatedSizeKb: number } {
    const totalRecords =
      (payload.progress?.length || 0) +
      (payload.notes?.length || 0) +
      (payload.bookmarks?.length || 0) +
      (payload.quizAttempts?.length || 0);

    const serialized = JSON.stringify(payload);
    const estimatedSizeKb = Math.round((serialized.length / 1024) * 10) / 10;

    return { totalRecords, estimatedSizeKb };
  },

  /**
   * Generates a complete JSON-serializable snapshot of student progress, notes, and quiz history.
   */
  async exportStudentData(): Promise<StudentBackupPayload> {
    const db = await getDatabase();

    const progress = await db.getAllAsync<LessonProgressRecord>(
      `SELECT * FROM lesson_progress ORDER BY updated_at DESC;`
    );
    const notes = await notesRepository.getAllNotes();
    const bookmarks = await notesRepository.getAllBookmarks();
    const quizAttempts = await db.getAllAsync<QuizAttemptRecord>(
      `SELECT * FROM quiz_attempts ORDER BY attempted_at DESC;`
    );

    return {
      version: 1,
      exportedAt: Date.now(),
      appVersion: '1.0.0',
      progress,
      notes,
      bookmarks,
      quizAttempts,
    };
  },

  /**
   * Imports student data snapshot, merging or restoring records idempotently.
   */
  async importStudentData(payload: StudentBackupPayload): Promise<ImportSummary> {
    const validation = this.validatePayload(payload);
    if (!validation.valid) {
      return {
        success: false,
        progressImported: 0,
        notesImported: 0,
        bookmarksImported: 0,
        quizAttemptsImported: 0,
        error: validation.reason || 'Incompatible or corrupted backup payload format.',
      };
    }

    const db = await getDatabase();

    let progressCount = 0;
    let notesCount = 0;
    let bookmarksCount = 0;
    let quizCount = 0;

    await db.withTransactionAsync(async () => {
      // 1. Import Progress
      if (Array.isArray(payload.progress)) {
        for (const p of payload.progress) {
          await db.runAsync(
            `INSERT OR REPLACE INTO lesson_progress
             (lesson_id, unit_id, current_step, completed_step, is_completed, prediction_choice_id, prediction_correct, time_spent_seconds, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              p.lesson_id,
              p.unit_id,
              p.current_step,
              p.completed_step,
              p.is_completed,
              p.prediction_choice_id,
              p.prediction_correct,
              p.time_spent_seconds,
              p.updated_at,
            ]
          );
          progressCount++;
        }
      }

      // 2. Import Notes
      if (Array.isArray(payload.notes)) {
        for (const n of payload.notes) {
          await db.runAsync(
            `INSERT INTO student_notes (lesson_id, unit_id, step_number, note_text, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [n.lesson_id, n.unit_id, n.step_number, n.note_text, n.created_at, n.updated_at]
          );
          notesCount++;
        }
      }

      // 3. Import Bookmarks
      if (Array.isArray(payload.bookmarks)) {
        for (const b of payload.bookmarks) {
          await db.runAsync(
            `INSERT OR REPLACE INTO lesson_bookmarks (lesson_id, unit_id, bookmarked_at)
             VALUES (?, ?, ?);`,
            [b.lesson_id, b.unit_id, b.bookmarked_at]
          );
          bookmarksCount++;
        }
      }

      // 4. Import Quiz Attempts
      if (Array.isArray(payload.quizAttempts)) {
        for (const q of payload.quizAttempts) {
          await db.runAsync(
            `INSERT INTO quiz_attempts (lesson_id, question_id, selected_index, is_correct, attempted_at)
             VALUES (?, ?, ?, ?, ?);`,
            [q.lesson_id, q.question_id, q.selected_index, q.is_correct, q.attempted_at]
          );
          quizCount++;
        }
      }
    });

    return {
      success: true,
      progressImported: progressCount,
      notesImported: notesCount,
      bookmarksImported: bookmarksCount,
      quizAttemptsImported: quizCount,
    };
  },

  /**
   * Resets all student learning portfolio data across the application.
   */
  async clearAllStudentData(): Promise<void> {
    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM lesson_progress;`);
      await db.runAsync(`DELETE FROM quiz_attempts;`);
      await db.runAsync(`DELETE FROM student_notes;`);
      await db.runAsync(`DELETE FROM lesson_bookmarks;`);
    });
  },
};
