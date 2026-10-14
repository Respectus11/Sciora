export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  tagline: string;
  pageRange: string;
  authors: string[];
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  icon: string;
  accentColor: string;
  totalLessons: number;
  learningCompetencies: string[];
}

export type PedagogicalStepType =
  | 'intro'
  | 'ethiopian_context'
  | 'key_idea'
  | 'prediction'
  | 'simulation'
  | 'observation'
  | 'explanation'
  | 'quiz'
  | 'misconception'
  | 'summary';

export interface PredictionChoice {
  id: string;
  text: string;
  isScientificallySound: boolean;
  feedback: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  textbookPageRef?: string;
}

export interface SimulationParamControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface SimulationConfig {
  simId: string;
  title: string;
  defaultParams: Record<string, number | string | boolean>;
  controls: SimulationParamControl[];
  readoutLabels: Record<string, string>;
}

export interface PedagogicalStep {
  stepNumber: number;
  type: PedagogicalStepType;
  title: string;
  content: string;
  highlightBox?: {
    title: string;
    text: string;
    variant: 'info' | 'key' | 'warning' | 'context';
  };
  predictionData?: {
    prompt: string;
    choices: PredictionChoice[];
  };
  simulationData?: {
    simId: string;
    instructions: string[];
    guidingQuestions: string[];
  };
  quizData?: {
    questions: QuizQuestion[];
  };
  misconceptionData?: {
    myth: string;
    reality: string;
    scientificReason: string;
  };
}

export interface Lesson {
  id: string;
  unitId: string;
  lessonNumber: string;
  title: string;
  subtitle: string;
  textbookPageRef: string;
  estimatedMinutes: number;
  curriculumCompetencies: string[];
  simulationId: string;
  steps: PedagogicalStep[];
}
