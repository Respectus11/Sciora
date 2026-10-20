import { CurriculumUnit, Lesson } from '@/types/curriculum';
import curriculumData from '@/content/curriculum.json';
import unit01Data from '@/content/units/unit-01.json';
import unit07Data from '@/content/units/unit-07.json';
import unit02Data from '@/content/units/unit-02.json';
import unit06Data from '@/content/units/unit-06.json';

const allUnits: CurriculumUnit[] = curriculumData.units as CurriculumUnit[];

const allLessons: Lesson[] = [
  ...(unit01Data.lessons as unknown as Lesson[]),
  ...(unit07Data.lessons as unknown as Lesson[]),
  ...(unit02Data.lessons as unknown as Lesson[]),
  ...(unit06Data.lessons as unknown as Lesson[]),
];

export const contentService = {
  getAllUnits(): CurriculumUnit[] {
    return allUnits;
  },

  getUnitById(id: string): CurriculumUnit | undefined {
    return allUnits.find((u) => u.id === id);
  },

  getLessonsByUnit(unitId: string): Lesson[] {
    return allLessons.filter((l) => l.unitId === unitId);
  },

  getLessonById(lessonId: string): Lesson | undefined {
    return allLessons.find((l) => l.id === lessonId);
  },

  getAllLessons(): Lesson[] {
    return allLessons;
  },

  getCurriculumDetails() {
    return {
      curriculumName: curriculumData.curriculumName,
      grade: curriculumData.grade,
      edition: curriculumData.edition,
      publisher: curriculumData.publisher,
      textbookDetails: curriculumData.textbookDetails,
    };
  },
};
