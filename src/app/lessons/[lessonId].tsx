import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer, GlassCard, Badge, PrimaryButton } from '@/components/ui';
import { contentService } from '@/services/contentService';
import { getSimulationById } from '@/simulations/registry';
import { progressRepository } from '@/database/progressRepository';
import { PedagogicalStep, PredictionChoice, QuizQuestion } from '@/types/curriculum';
import { colors, spacing, typography, radii } from '@/design-system';

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = contentService.getLessonById(lessonId || 'lesson-7-1-reflection');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Prediction State
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionChoice | null>(null);

  // Quiz State: questionId -> selectedIndex
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load previously saved step from SQLite if available
    if (lesson) {
      progressRepository.getLessonProgress(lesson.id).then((saved) => {
        if (saved && saved.current_step > 1 && saved.current_step <= lesson.steps.length) {
          // Keep current step or let student resume
        }
      });
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>Lesson not found</Text>
        <PrimaryButton title="Back to Explorer" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const currentStep = lesson.steps[currentStepIndex];
  const totalSteps = lesson.steps.length;
  const progressRatio = (currentStepIndex + 1) / totalSteps;

  const handleNextStep = async () => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      // Persist step to SQLite
      await progressRepository.saveLessonStep(
        lesson.id,
        lesson.unitId,
        nextIndex + 1,
        nextIndex + 1 === totalSteps
      );
    } else {
      // Completed! Mark complete in SQLite
      await progressRepository.saveLessonStep(
        lesson.id,
        lesson.unitId,
        totalSteps,
        true
      );
      router.push('/(tabs)/progress');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSelectPrediction = async (choice: PredictionChoice) => {
    setSelectedPrediction(choice);
    await progressRepository.savePrediction(
      lesson.id,
      lesson.unitId,
      choice.id,
      choice.isScientificallySound
    );
  };

  const handleSelectQuizOption = async (question: QuizQuestion, optionIndex: number) => {
    if (quizAnswers[question.id] !== undefined) return; // already answered
    setQuizAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    const isCorrect = optionIndex === question.correctIndex;
    await progressRepository.saveQuizAttempt(
      lesson.id,
      question.id,
      optionIndex,
      isCorrect
    );
  };

  // Resolve simulation component if on simulation step
  const simRegistration = lesson.simulationId ? getSimulationById(lesson.simulationId) : undefined;
  const SimulationComponent = simRegistration ? simRegistration.component : null;

  return (
    <ScreenContainer scrollable={true} contentContainerStyle={styles.container}>
      {/* 1. Header Navigation & Progress Bar */}
      <View style={styles.header}>
        <View style={styles.navRow}>
          <Pressable style={styles.backBtn} onPress={handlePrevStep} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.stepInfo}>
            <Text style={styles.stepIndicatorText}>
              STEP {currentStepIndex + 1} OF {totalSteps}
            </Text>
            <Text style={styles.stepTitleHeader}>{currentStep.title}</Text>
          </View>
          <Badge label={lesson.lessonNumber} variant="cyan" />
        </View>

        {/* Progress bar track */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
        </View>
      </View>

      {/* 2. Step Content Body */}
      <View style={styles.body}>
        {/* Step-specific rendering */}
        {renderStepContent(
          currentStep,
          selectedPrediction,
          handleSelectPrediction,
          SimulationComponent,
          quizAnswers,
          handleSelectQuizOption
        )}
      </View>

      {/* 3. Bottom Navigation Controls */}
      <View style={styles.bottomNav}>
        <Pressable
          style={styles.prevBtn}
          onPress={handlePrevStep}
          accessibilityLabel="Previous step"
        >
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
          <Text style={styles.prevBtnText}>Previous</Text>
        </Pressable>

        <PrimaryButton
          title={currentStepIndex === totalSteps - 1 ? 'Finish & Save Mastery' : 'Next Step →'}
          variant="cyan"
          size="md"
          onPress={handleNextStep}
          style={styles.nextBtn}
        />
      </View>
    </ScreenContainer>
  );
}

function renderStepContent(
  step: PedagogicalStep,
  selectedPrediction: PredictionChoice | null,
  onSelectPrediction: (c: PredictionChoice) => void,
  SimulationComponent: React.ComponentType | null,
  quizAnswers: Record<string, number>,
  onSelectQuizOption: (q: QuizQuestion, optIdx: number) => void
) {
  switch (step.type) {
    case 'prediction':
      return (
        <View>
          <Text style={styles.stepHeading}>{step.title}</Text>
          <Text style={styles.stepBodyText}>{step.content}</Text>

          {step.predictionData && (
            <GlassCard variant="highlight" style={styles.predictionCard} padding="lg">
              <View style={styles.predictionIconRow}>
                <Ionicons name="help-circle" size={22} color={colors.cyan} />
                <Text style={styles.predictionPrompt}>{step.predictionData.prompt}</Text>
              </View>

              {step.predictionData.choices.map((choice) => {
                const isSelected = selectedPrediction?.id === choice.id;
                return (
                  <Pressable
                    key={choice.id}
                    style={[
                      styles.choiceBtn,
                      isSelected ? styles.choiceBtnSelected : undefined,
                    ]}
                    onPress={() => onSelectPrediction(choice)}
                  >
                    <View style={styles.choiceRadio}>
                      {isSelected && <View style={styles.choiceRadioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.choiceText,
                        isSelected ? styles.choiceTextSelected : undefined,
                      ]}
                    >
                      {choice.text}
                    </Text>
                  </Pressable>
                );
              })}

              {selectedPrediction && (
                <View
                  style={[
                    styles.feedbackBox,
                    selectedPrediction.isScientificallySound
                      ? styles.feedbackBoxSound
                      : styles.feedbackBoxWarning,
                  ]}
                >
                  <Ionicons
                    name={
                      selectedPrediction.isScientificallySound
                        ? 'checkmark-circle'
                        : 'alert-circle'
                    }
                    size={20}
                    color={
                      selectedPrediction.isScientificallySound
                        ? colors.emerald
                        : colors.amber
                    }
                  />
                  <Text style={styles.feedbackText}>{selectedPrediction.feedback}</Text>
                </View>
              )}
            </GlassCard>
          )}
        </View>
      );

    case 'simulation':
      return (
        <View>
          <Text style={styles.stepHeading}>{step.title}</Text>
          <Text style={styles.stepBodyText}>{step.content}</Text>

          {/* Embedded Native Vector Simulation */}
          {SimulationComponent ? (
            <View style={styles.simContainer}>
              <SimulationComponent />
            </View>
          ) : (
            <GlassCard variant="base" padding="md">
              <Text style={styles.errorText}>Simulation module loading...</Text>
            </GlassCard>
          )}

          {step.simulationData && (
            <GlassCard variant="base" style={styles.guideQuestionsCard} padding="md">
              <Text style={styles.guideHeading}>Guiding Questions while interacting:</Text>
              {step.simulationData.guidingQuestions.map((gq, idx) => (
                <View key={idx} style={styles.guideRow}>
                  <Text style={styles.guideBullet}>•</Text>
                  <Text style={styles.guideText}>{gq}</Text>
                </View>
              ))}
            </GlassCard>
          )}
        </View>
      );

    case 'quiz':
      return (
        <View>
          <Text style={styles.stepHeading}>{step.title}</Text>
          <Text style={styles.stepBodyText}>{step.content}</Text>

          {step.quizData?.questions.map((q, qIdx) => {
            const selectedOpt = quizAnswers[q.id];
            const hasAnswered = selectedOpt !== undefined;

            return (
              <GlassCard key={q.id} variant="base" style={styles.quizCard} padding="md">
                <Text style={styles.quizQNum}>Question {qIdx + 1} of {step.quizData!.questions.length}</Text>
                <Text style={styles.quizQText}>{q.question}</Text>

                {q.options.map((opt, optIdx) => {
                  const isThisSelected = selectedOpt === optIdx;
                  const isCorrect = optIdx === q.correctIndex;

                  let optStyle = styles.quizOption;
                  if (hasAnswered) {
                    if (isCorrect) optStyle = styles.quizOptionCorrect;
                    else if (isThisSelected) optStyle = styles.quizOptionWrong;
                  }

                  return (
                    <Pressable
                      key={optIdx}
                      style={[styles.quizOptionBase, optStyle]}
                      onPress={() => onSelectQuizOption(q, optIdx)}
                      disabled={hasAnswered}
                    >
                      <Text style={styles.quizOptionLetter}>
                        {String.fromCharCode(65 + optIdx)}.
                      </Text>
                      <Text style={styles.quizOptionText}>{opt}</Text>
                    </Pressable>
                  );
                })}

                {hasAnswered && (
                  <View style={styles.quizExplanationBox}>
                    <Text style={styles.quizExplanationTitle}>Scientific Rationale:</Text>
                    <Text style={styles.quizExplanationText}>{q.explanation}</Text>
                    {q.textbookPageRef && (
                      <Text style={styles.quizRefText}>
                        Textbook reference: {q.textbookPageRef}
                      </Text>
                    )}
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>
      );

    case 'misconception':
      return (
        <View>
          <Text style={styles.stepHeading}>{step.title}</Text>
          <Text style={styles.stepBodyText}>{step.content}</Text>

          {step.misconceptionData && (
            <View style={styles.misconceptionStack}>
              {/* Myth Card */}
              <GlassCard variant="base" style={styles.mythCard} padding="md">
                <View style={styles.mythHeaderRow}>
                  <Ionicons name="close-circle" size={20} color={colors.rose} />
                  <Text style={styles.mythHeader}>COMMON STUDENT MISCONCEPTION</Text>
                </View>
                <Text style={styles.mythBody}>&ldquo;{step.misconceptionData.myth}&rdquo;</Text>
              </GlassCard>

              {/* Reality Card */}
              <GlassCard variant="base" style={styles.realityCard} padding="md">
                <View style={styles.realityHeaderRow}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.emerald} />
                  <Text style={styles.realityHeader}>SCIENTIFIC FACTUAL REALITY</Text>
                </View>
                <Text style={styles.realityBody}>{step.misconceptionData.reality}</Text>
                <View style={styles.realityDivider} />
                <Text style={styles.reasonText}>
                  Why? {step.misconceptionData.scientificReason}
                </Text>
              </GlassCard>
            </View>
          )}
        </View>
      );

    case 'summary':
      return (
        <View style={styles.summaryContainer}>
          <GlassCard variant="raised" glow="cyan" style={styles.summaryCard} padding="lg">
            <View style={styles.summaryBadgeRow}>
              <Ionicons name="trophy" size={32} color={colors.amber} />
              <Badge label="Lab Mastered" variant="emerald" />
            </View>
            <Text style={styles.summaryHeading}>{step.title}</Text>
            <Text style={styles.summaryBody}>{step.content}</Text>
          </GlassCard>
        </View>
      );

    default:
      // Standard content step (intro, ethiopian_context, key_idea, observation, explanation)
      return (
        <View>
          <Text style={styles.stepHeading}>{step.title}</Text>
          <Text style={styles.stepBodyText}>{step.content}</Text>

          {step.highlightBox && (
            <GlassCard
              variant="highlight"
              style={[
                styles.highlightBox,
                step.highlightBox.variant === 'context'
                  ? styles.highlightContext
                  : step.highlightBox.variant === 'key'
                  ? styles.highlightKey
                  : styles.highlightInfo,
              ]}
              padding="md"
            >
              <Text style={styles.highlightTitle}>{step.highlightBox.title}</Text>
              <Text style={styles.highlightText}>{step.highlightBox.text}</Text>
            </GlassCard>
          )}
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xs,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.button,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInfo: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  stepIndicatorText: {
    ...typography.badgeText,
    color: colors.cyan,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  stepTitleHeader: {
    ...typography.heading3,
    color: colors.textPrimary,
    fontSize: 14,
  },
  progressTrack: {
    height: 4,
    borderRadius: radii.full,
    backgroundColor: colors.spaceElevated,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: radii.full,
  },
  body: {
    marginBottom: spacing.xl,
  },
  stepHeading: {
    ...typography.heading2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  stepBodyText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  highlightBox: {
    marginTop: spacing.sm,
  },
  highlightInfo: {
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  highlightKey: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  highlightContext: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  highlightTitle: {
    ...typography.heading3,
    fontSize: 13,
    color: colors.cyan,
    marginBottom: 4,
  },
  highlightText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  predictionCard: {
    marginBottom: spacing.lg,
  },
  predictionIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  predictionPrompt: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.sm,
  },
  choiceBtnSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
  },
  choiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  choiceRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cyan,
  },
  choiceText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    flex: 1,
  },
  choiceTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radii.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
  },
  feedbackBoxSound: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: colors.emerald,
  },
  feedbackBoxWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: colors.amber,
  },
  feedbackText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  simContainer: {
    marginBottom: spacing.md,
  },
  guideQuestionsCard: {
    marginTop: spacing.md,
  },
  guideHeading: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.cyan,
    marginBottom: spacing.xs,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  guideBullet: {
    color: colors.cyan,
    marginRight: 6,
  },
  guideText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  quizCard: {
    marginBottom: spacing.lg,
  },
  quizQNum: {
    ...typography.badgeText,
    color: colors.cyan,
    marginBottom: 4,
  },
  quizQText: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quizOptionBase: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.spaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: spacing.xs,
  },
  quizOption: {},
  quizOptionCorrect: {
    borderColor: colors.emerald,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  quizOptionWrong: {
    borderColor: colors.rose,
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },
  quizOptionLetter: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.cyan,
    width: 24,
  },
  quizOptionText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  quizExplanationBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorderSubtle,
  },
  quizExplanationTitle: {
    ...typography.caption,
    color: colors.cyan,
    fontWeight: '700',
    marginBottom: 2,
  },
  quizExplanationText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  quizRefText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  misconceptionStack: {
    gap: spacing.md,
  },
  mythCard: {
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  mythHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  mythHeader: {
    ...typography.badgeText,
    color: colors.rose,
    marginLeft: 6,
  },
  mythBody: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  realityCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  realityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  realityHeader: {
    ...typography.badgeText,
    color: colors.emerald,
    marginLeft: 6,
  },
  realityBody: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  realityDivider: {
    height: 1,
    backgroundColor: colors.glassBorderSubtle,
    marginVertical: 6,
  },
  reasonText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  summaryContainer: {
    paddingVertical: spacing.md,
  },
  summaryCard: {
    alignItems: 'center',
    textAlign: 'center',
  },
  summaryBadgeRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 8,
  },
  summaryHeading: {
    ...typography.heading2,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  summaryBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  errorText: {
    ...typography.bodyMedium,
    color: colors.rose,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: colors.spaceDark,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.button,
  },
  prevBtnText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  nextBtn: {
    minWidth: 160,
  },
});
