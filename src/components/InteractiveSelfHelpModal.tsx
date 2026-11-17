import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Plus, Check, ArrowRight } from 'lucide-react';
import {
  ASSESSMENTS,
  SELF_HELP_RESOURCES,
  WELLBEING_PROGRAMS,
} from '../data/wellbeingCatalog';
import type { ServicePillar } from '../types';

interface InteractiveSelfHelpModalProps {
  resourceId: string | null;
  pillar: ServicePillar | null;
  onClose: () => void;
  onRefineWithAssessment: (summary: string) => void;
  onBookCounselor: () => void;
}

export const InteractiveSelfHelpModal: React.FC<InteractiveSelfHelpModalProps> = ({
  resourceId,
  pillar,
  onClose,
  onRefineWithAssessment,
  onBookCounselor,
}) => {
  // Breathing state
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Rest
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Worry triage state
  const [worryInput, setWorryInput] = useState('');
  const [worryItems, setWorryItems] = useState<
    { id: string; text: string; bucket: 'control' | 'park' }[]
  >([
    { id: 'w1', text: 'Send status summary on Q4 blockers before 5 PM', bucket: 'control' },
    { id: 'w2', text: 'How leadership reacts to next quarter headcount', bucket: 'park' },
  ]);

  // Sleep checklist state
  const [sleepSteps, setSleepSteps] = useState<Record<string, boolean>>({});

  // Assessment state
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);

  // Program state
  const [enrolledProgram, setEnrolledProgram] = useState(false);

  useEffect(() => {
    setIsBreathingRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(4);
    setCyclesCompleted(0);
    setAnswers({});
    setAssessmentSubmitted(false);
    setEnrolledProgram(false);
  }, [resourceId]);

  useEffect(() => {
    if (!isBreathingRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        setPhaseIndex((currPhase) => {
          const next = (currPhase + 1) % 4;
          if (next === 0) {
            setCyclesCompleted((c) => c + 1);
          }
          return next;
        });
        return 4;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isBreathingRunning]);

  if (!resourceId || !pillar) return null;

  const selfHelp = SELF_HELP_RESOURCES.find((s) => s.id === resourceId);
  const assessment = ASSESSMENTS.find((a) => a.id === resourceId);
  const program = WELLBEING_PROGRAMS.find((p) => p.id === resourceId);

  const phases = ['Inhale slowly', 'Hold gently', 'Exhale steadily', 'Rest empty'];
  const currentPhaseLabel = phases[phaseIndex];

  const handleAddWorry = (bucket: 'control' | 'park') => {
    if (!worryInput.trim()) return;
    setWorryItems((prev) => [
      ...prev,
      { id: `${Date.now()}`, text: worryInput.trim(), bucket },
    ]);
    setWorryInput('');
  };

  const renderSelfHelp = () => {
    if (!selfHelp) return null;

    if (selfHelp.interactiveType === 'breathing') {
      return (
        <div className="space-y-6">
          <p className="text-sm text-[#575A56]">{selfHelp.summary}</p>

          <div className="flex flex-col items-center justify-center rounded-xl border border-[#E5E4DF] bg-[#F8F7F4] py-10 px-6">
            <div
              className={`flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 transition-transform duration-700 ${
                phaseIndex === 0 || phaseIndex === 1
                  ? 'scale-105 border-[#1F6E5D] bg-[#E6EFEA]'
                  : 'scale-95 border-[#A6BFB6] bg-white'
              }`}
            >
              <span className="font-mono text-3xl font-semibold tabular-nums text-[#1C2421]">
                {secondsLeft}s
              </span>
              <span className="mt-1 text-xs font-medium text-[#1F6E5D]">
                {currentPhaseLabel}
              </span>
            </div>

            <p className="mt-6 text-xs font-mono tabular-nums text-[#575A56]">
              Cycles completed: {cyclesCompleted} / 4
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBreathingRunning((r) => !r)}
                className="flex items-center gap-2 rounded-lg bg-[#1F6E5D] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] cursor-pointer"
              >
                {isBreathingRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isBreathingRunning ? 'Pause Pacer' : 'Start Pacer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBreathingRunning(false);
                  setPhaseIndex(0);
                  setSecondsLeft(4);
                  setCyclesCompleted(0);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5E4DF] bg-white px-4 py-2.5 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selfHelp.interactiveType === 'worry_triage') {
      const controlItems = worryItems.filter((i) => i.bucket === 'control');
      const parkItems = worryItems.filter((i) => i.bucket === 'park');
      return (
        <div className="space-y-5">
          <p className="text-sm text-[#575A56]">{selfHelp.summary}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={worryInput}
              onChange={(e) => setWorryInput(e.target.value)}
              placeholder="Add one thing crowding your head..."
              className="flex-1 rounded-lg border border-[#E5E4DF] px-3.5 py-2 text-sm text-[#1C2421]"
            />
            <button
              type="button"
              onClick={() => handleAddWorry('control')}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#1F6E5D] px-3.5 py-2 text-xs font-medium text-white hover:bg-[#18584A] whitespace-nowrap cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Control Today</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddWorry('park')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E4DF] bg-white px-3.5 py-2 text-xs font-medium text-[#1C2421] hover:bg-[#F8F7F4] whitespace-nowrap cursor-pointer"
            >
              <span>Park for Later</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#D1E3DD] bg-[#F2F7F5] p-4">
              <h4 className="text-xs font-semibold text-[#1F6E5D]">
                Within My Control Today ({controlItems.length})
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#1C2421]">
                {controlItems.map((item) => (
                  <li key={item.id} className="rounded-lg bg-white px-3 py-2 border border-[#E5E4DF]">
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#E5E4DF] bg-[#F8F7F4] p-4">
              <h4 className="text-xs font-semibold text-[#575A56]">
                Deliberately Parked ({parkItems.length})
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-[#575A56]">
                {parkItems.map((item) => (
                  <li key={item.id} className="rounded-lg bg-white px-3 py-2 border border-[#E5E4DF]">
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    const checklist = [
      'Write tomorrow’s single top priority on a sticky note and close the laptop.',
      'Silence work chat notifications until 9:00 AM tomorrow.',
      'Step away from bright screens for 20 minutes before getting into bed.',
      'Keep a notepad next to bed to offload any 3 AM thoughts without checking your phone.',
    ];

    return (
      <div className="space-y-4">
        <p className="text-sm text-[#575A56]">{selfHelp.summary}</p>
        <div className="space-y-2.5">
          {checklist.map((step, idx) => {
            const key = `step-${idx}`;
            const checked = Boolean(sleepSteps[key]);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSleepSteps((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  checked
                    ? 'border-[#1F6E5D] bg-[#F2F7F5]'
                    : 'border-[#E5E4DF] bg-white hover:bg-[#F8F7F4]'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                    checked
                      ? 'border-[#1F6E5D] bg-[#1F6E5D] text-white'
                      : 'border-[#C9C7C0] bg-white'
                  }`}
                >
                  {checked && <Check className="h-3.5 w-3.5" />}
                </span>
                <span className={`text-sm ${checked ? 'text-[#1C2421] line-through' : 'text-[#1C2421]'}`}>
                  {step}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAssessment = () => {
    if (!assessment) return null;
    const totalAnswered = Object.keys(answers).length;
    const totalScore = Object.values(answers).reduce((acc, v) => acc + v, 0);
    const maxScore = assessment.questions.length * 3;
    const band =
      totalScore <= 3
        ? 'Mild / Early strain'
        : totalScore <= 7
        ? 'Moderate sustained strain'
        : 'High strain — human conversation recommended';

    return (
      <div className="space-y-5">
        <p className="text-sm text-[#575A56]">{assessment.summary}</p>

        {!assessmentSubmitted ? (
          <div className="space-y-5">
            {assessment.questions.map((q, idx) => (
              <div key={q.id} className="space-y-2.5 border-b border-[#E5E4DF] pb-4 last:border-b-0">
                <p className="text-sm font-medium text-[#1C2421]">
                  {idx + 1}. {q.prompt}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#1F6E5D] bg-[#F2F7F5] font-semibold text-[#1F6E5D]'
                            : 'border-[#E5E4DF] bg-white text-[#575A56] hover:text-[#1C2421]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              disabled={totalAnswered < assessment.questions.length}
              onClick={() => setAssessmentSubmitted(true)}
              className="w-full rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] disabled:opacity-50 cursor-pointer"
            >
              See Pulse Check Summary ({totalAnswered}/{assessment.questions.length} answered)
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl border border-[#D1E3DD] bg-[#F2F7F5] p-5">
              <p className="text-xs font-mono text-[#1F6E5D] tabular-nums">
                Pulse score: {totalScore} / {maxScore}
              </p>
              <h4 className="mt-1 text-base font-semibold text-[#1C2421]">{band}</h4>
              <p className="mt-2 text-sm text-[#575A56]">
                This brief check is for self-reflection only—not a clinical diagnosis. Use this
                result to re-calibrate your AI Next-Step recommendation or connect directly with a
                counselor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  onRefineWithAssessment(
                    `${assessment.title}: ${totalScore}/${maxScore} (${band})`
                  );
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] cursor-pointer"
              >
                <span>Update My Next Step</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              {totalScore >= 7 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onBookCounselor();
                  }}
                  className="rounded-lg border border-[#E5E4DF] bg-white px-4 py-2.5 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
                >
                  Book 1-on-1 Counselor
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderProgram = () => {
    if (!program) return null;
    return (
      <div className="space-y-5">
        <p className="text-sm text-[#575A56]">{program.summary}</p>
        <div className="rounded-xl border border-[#E5E4DF] bg-[#F8F7F4] p-4 space-y-2 text-sm">
          <p className="text-xs font-medium text-[#575A56]">
            {program.durationLabel} · {program.cadence}
          </p>
          <ul className="space-y-1.5 pt-1 text-[#1C2421]">
            {program.modules.map((m, idx) => (
              <li key={m}>
                0{idx + 1}. {m}
              </li>
            ))}
          </ul>
        </div>
        {enrolledProgram ? (
          <div className="rounded-xl border border-[#D1E3DD] bg-[#F2F7F5] p-4 text-sm text-[#1F6E5D] font-medium">
            Seat reserved for Monday cohort start. First 10-minute audio prompt will arrive privately
            in your YourDOST workspace.
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEnrolledProgram(true)}
            className="w-full rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] cursor-pointer"
          >
            Join Next Cohort (10 min/day)
          </button>
        )}
      </div>
    );
  };

  const title = selfHelp?.title || assessment?.title || program?.title || 'Guided Step';
  const subLabel =
    selfHelp?.durationLabel || assessment?.durationLabel || program?.durationLabel || '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2421]/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resource-modal-title"
    >
      <div className="w-full max-w-xl rounded-xl border border-[#E5E4DF] bg-white">
        <div className="flex items-start justify-between border-b border-[#E5E4DF] px-6 py-4">
          <div>
            <p className="text-xs font-medium text-[#575A56]">{subLabel}</p>
            <h3 id="resource-modal-title" className="mt-0.5 text-lg font-semibold text-[#1C2421]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close activity"
            className="rounded-lg p-1.5 text-[#575A56] hover:bg-[#F8F7F4] hover:text-[#1C2421] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {pillar === 'self_help' && renderSelfHelp()}
          {pillar === 'assessment' && renderAssessment()}
          {pillar === 'program' && renderProgram()}
        </div>
      </div>
    </div>
  );
};
