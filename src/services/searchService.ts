import { contentService } from './contentService';

export type SearchResultType = 'lesson' | 'unit' | 'simulation' | 'competency';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  unitTitle: string;
  unitId: string;
  lessonId?: string;
  score: number;
  highlightText?: string;
}

export interface SearchFilterOptions {
  unitId?: string;
  type?: SearchResultType;
  limit?: number;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function computeMatchScore(query: string, text: string): number {
  const normQuery = normalize(query);
  const normText = normalize(text);

  if (!normQuery || !normText) return 0;
  if (normText === normQuery) return 100;
  if (normText.startsWith(normQuery)) return 80;

  const queryWords = normQuery.split(' ');
  let matches = 0;
  for (const qWord of queryWords) {
    if (normText.includes(qWord)) {
      matches += 1;
    }
  }

  const wordMatchRatio = matches / queryWords.length;
  if (wordMatchRatio === 1) return 60;
  if (wordMatchRatio > 0.5) return 40;
  if (wordMatchRatio > 0) return 20;

  return 0;
}

export const searchService = {
  search(query: string, options: SearchFilterOptions = {}): SearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const units = contentService.getAllUnits();
    const lessons = contentService.getAllLessons();
    const results: SearchResult[] = [];
    const limit = options.limit || 20;

    // 1. Search in Unit metadata
    if (!options.type || options.type === 'unit') {
      for (const unit of units) {
        const titleScore = computeMatchScore(trimmed, unit.title);
        const descScore = computeMatchScore(trimmed, unit.description);
        const maxUnitScore = Math.max(titleScore * 1.2, descScore);

        if (maxUnitScore > 0) {
          results.push({
            id: `unit-${unit.id}`,
            type: 'unit',
            title: unit.title,
            subtitle: unit.description,
            unitTitle: unit.title,
            unitId: unit.id,
            score: maxUnitScore,
            highlightText: unit.title,
          });
        }
      }
    }

    // 2. Search in Lessons & Steps
    for (const lesson of lessons) {
      const unit = contentService.getUnitById(lesson.unitId);
      const unitTitle = unit?.title || 'Science Unit';

      if (!options.type || options.type === 'lesson') {
        const lTitleScore = computeMatchScore(trimmed, lesson.title);
        const lSubScore = computeMatchScore(trimmed, lesson.subtitle);
        const introStep = lesson.steps.find((s) => s.type === 'intro');
        const introScore = introStep ? computeMatchScore(trimmed, introStep.content) : 0;
        const maxLessonScore = Math.max(lTitleScore * 1.5, lSubScore * 1.1, introScore * 0.8);

        if (maxLessonScore > 0) {
          results.push({
            id: `lesson-${lesson.id}`,
            type: 'lesson',
            title: lesson.title,
            subtitle: lesson.subtitle,
            unitTitle,
            unitId: lesson.unitId,
            lessonId: lesson.id,
            score: maxLessonScore,
            highlightText: lesson.subtitle,
          });
        }
      }

      // 3. Search in Simulation Metadata
      if (!options.type || options.type === 'simulation') {
        const simStep = lesson.steps.find((s) => s.type === 'simulation');
        if (simStep) {
          const simTitleScore = computeMatchScore(trimmed, simStep.title);
          const simContentScore = computeMatchScore(trimmed, simStep.content);
          const maxSimScore = Math.max(simTitleScore * 1.4, simContentScore * 0.8);

          if (maxSimScore > 0) {
            results.push({
              id: `sim-${lesson.simulationId}`,
              type: 'simulation',
              title: simStep.title,
              subtitle: `Interactive Lab in ${lesson.title}`,
              unitTitle,
              unitId: lesson.unitId,
              lessonId: lesson.id,
              score: maxSimScore,
              highlightText: simStep.title,
            });
          }
        }
      }

      // 4. Search in Competency Objectives
      if (!options.type || options.type === 'competency') {
        for (const comp of lesson.curriculumCompetencies) {
          const compScore = computeMatchScore(trimmed, comp);
          if (compScore > 0) {
            results.push({
              id: `comp-${lesson.id}-${comp.slice(0, 15)}`,
              type: 'competency',
              title: comp,
              subtitle: `Competency in ${lesson.title}`,
              unitTitle,
              unitId: lesson.unitId,
              lessonId: lesson.id,
              score: compScore * 0.85,
              highlightText: comp,
            });
            break;
          }
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  },
};
