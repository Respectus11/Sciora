import { getDatabase } from './db';

export interface LessonProgressRecord {
  lesson_id: string;
  unit_id: string;
  current_step: number;
  completed_step: number;
  is_completed: number;
  prediction_choice_id: string | null;
  prediction_correct: number | null;
  time_spent_seconds: number;
  updated_at: number;
}

export interface GlobalStats {
  completedLessonsCount: number;
  totalQuestionsAnswered: number;
  correctQuestionsCount: number;
  accuracyPercent: number;
}

export const progressRepository = {
  async getLessonProgress(lessonId: string): Promise<LessonProgressRecord | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<LessonProgressRecord>(
      'SELECT * FROM lesson_progress WHERE lesson_id = ?;',
      [lessonId]
    );
    return result || null;
  },

  async getMostRecentInProgressLesson(): Promise<LessonProgressRecord | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<LessonProgressRecord>(
      'SELECT * FROM lesson_progress WHERE is_completed = 0 AND (current_step > 1 OR completed_step > 0) ORDER BY updated_at DESC LIMIT 1;'
    );
    return result || null;
  },

  async getQuizAnswersByLesson(lessonId: string): Promise<Record<string, number>> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ question_id: string | null; selected_index: number }>(
      'SELECT question_id, selected_index FROM quiz_attempts WHERE lesson_id = ? ORDER BY attempted_at ASC, id ASC;',
      [lessonId]
    );

    const answers: Record<string, number> = {};
    for (const row of rows) {
      if (row.question_id) answers[row.question_id] = row.selected_index;
    }
    return answers;
  },

  async saveLessonStep(
    lessonId: string,
    unitId: string,
    stepNumber: number,
    isCompleted: boolean = false
  ): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO lesson_progress (lesson_id, unit_id, current_step, completed_step, is_completed, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET
         current_step = excluded.current_step,
         completed_step = MAX(lesson_progress.completed_step, excluded.completed_step),
         is_completed = CASE WHEN excluded.is_completed = 1 THEN 1 ELSE lesson_progress.is_completed END,
         updated_at = excluded.updated_at;`,
      [lessonId, unitId, stepNumber, stepNumber, isCompleted ? 1 : 0, now]
    );
  },

  async savePrediction(
    lessonId: string,
    unitId: string,
    choiceId: string,
    isCorrect: boolean
  ): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO lesson_progress (lesson_id, unit_id, current_step, completed_step, prediction_choice_id, prediction_correct, is_completed, updated_at)
       VALUES (?, ?, 4, 4, ?, ?, 0, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET
         current_step = 4,
         completed_step = MAX(lesson_progress.completed_step, 4),
         prediction_choice_id = excluded.prediction_choice_id,
         prediction_correct = excluded.prediction_correct,
         updated_at = excluded.updated_at;`,
      [lessonId, unitId, choiceId, isCorrect ? 1 : 0, now]
    );
  },

  async saveQuizAttempt(
    lessonId: string,
    questionId: string,
    selectedIndex: number,
    isCorrect: boolean
  ): Promise<void> {
    const db = await getDatabase();
    const now = Date.now();
    await db.runAsync(
      `INSERT INTO quiz_attempts (lesson_id, question_id, selected_index, is_correct, attempted_at)
       VALUES (?, ?, ?, ?, ?);`,
      [lessonId, questionId, selectedIndex, isCorrect ? 1 : 0, now]
    );
  },

  async getAllCompletedLessonIds(): Promise<string[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ lesson_id: string }>(
      'SELECT lesson_id FROM lesson_progress WHERE is_completed = 1;'
    );
    return rows.map((r) => r.lesson_id);
  },

  async getGlobalStats(): Promise<GlobalStats> {
    const db = await getDatabase();
    const completedRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM lesson_progress WHERE is_completed = 1;'
    );
    const questionsRow = await db.getFirstAsync<{ total: number; correct: number }>(
      'SELECT COUNT(*) as total, SUM(is_correct) as correct FROM quiz_attempts;'
    );

    const completedLessonsCount = completedRow?.count || 0;
    const totalQuestionsAnswered = questionsRow?.total || 0;
    const correctQuestionsCount = questionsRow?.correct || 0;
    const accuracyPercent =
      totalQuestionsAnswered > 0
        ? Math.round((correctQuestionsCount / totalQuestionsAnswered) * 100)
        : 0;

    return {
      completedLessonsCount,
      totalQuestionsAnswered,
      correctQuestionsCount,
      accuracyPercent,
    };
  },

  async resetAllProgress(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM lesson_progress;');
    await db.runAsync('DELETE FROM quiz_attempts;');
  },

  /**
   * Computes completed lessons count and total active learning time for a specific unit.
   */
  async getUnitProgress(unitId: string): Promise<{ completedLessons: number; totalTimeSpent: number }> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ completed_count: number; total_time: number }>(
      `SELECT
         COUNT(CASE WHEN is_completed = 1 THEN 1 END) as completed_count,
         COALESCE(SUM(time_spent_seconds), 0) as total_time
       FROM lesson_progress
       WHERE unit_id = ?;`,
      [unitId]
    );

    return {
      completedLessons: row?.completed_count || 0,
      totalTimeSpent: row?.total_time || 0,
    };
  },

  /**
   * Helper to check if a single lesson is marked as completed.
   */
  async isLessonCompleted(lessonId: string): Promise<boolean> {
    const record = await this.getLessonProgress(lessonId);
    return record?.is_completed === 1;
  },

  /**
   * Calculates integer mastery percentage safely bounded between 0 and 100.
   */
  calculateMasteryPercentage(completed: number, total: number): number {
    if (!total || total <= 0) return 0;
    const ratio = (completed / total) * 100;
    return Math.min(100, Math.max(0, Math.round(ratio)));
  },
};
