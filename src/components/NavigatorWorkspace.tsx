import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  AlertTriangle,
  PhoneCall,
  RefreshCw,
  Compass,
  Send,
} from 'lucide-react';
import type {
  EnergyLevel,
  NavigatorRecommendationResponse,
  RecommendedStep,
  ServicePillar,
  SupportPreference,
  TimeAvailable,
  UserContextInput,
} from '../types';
import {
  COUNSELORS,
  CRISIS_HELPLINES,
  SYNTHETIC_SCENARIOS,
} from '../data/wellbeingCatalog';

interface NavigatorWorkspaceProps {
  inputContext: UserContextInput;
  onChangeContext: (next: UserContextInput) => void;
  recommendation: NavigatorRecommendationResponse | null;
  isLoading: boolean;
  errorMsg: string | null;
  onSubmitCheckIn: (overrideContext?: UserContextInput) => void;
  onSubmitFollowUp: (note: string) => void;
  onClearSession: () => void;
  onLaunchStep: (step: RecommendedStep) => void;
  onOpenPriorityCallback: () => void;
  onBrowseDirectory: (pillar?: ServicePillar) => void;
}

const PILLAR_LABEL: Record<ServicePillar, string> = {
  counseling: '1-on-1 Counseling',
  self_help: 'Self-Help Exercise',
  assessment: 'Quick Pulse Assessment',
  program: 'Wellbeing Program',
};

export const NavigatorWorkspace: React.FC<NavigatorWorkspaceProps> = ({
  inputContext,
  onChangeContext,
  recommendation,
  isLoading,
  errorMsg,
  onSubmitCheckIn,
  onSubmitFollowUp,
  onClearSession,
  onLaunchStep,
  onOpenPriorityCallback,
  onBrowseDirectory,
}) => {
  const [followUpText, setFollowUpText] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCheckIn();
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim()) return;
    onSubmitFollowUp(followUpText.trim());
    setFollowUpText('');
  };

  const handleScenarioClick = (scenario: (typeof SYNTHETIC_SCENARIOS)[number]) => {
    const nextCtx: UserContextInput = {
      message: scenario.message,
      timeAvailable: scenario.timeAvailable,
      energyLevel: scenario.energyLevel,
      supportPreference: scenario.supportPreference,
    };
    onChangeContext(nextCtx);
    onSubmitCheckIn(nextCtx);
  };

  const renderPrimaryCounselorPreview = (counselorId?: string) => {
    if (!counselorId) return null;
    const c = COUNSELORS.find((item) => item.id === counselorId);
    if (!c) return null;
    return (
      <div className="mt-4 flex items-center gap-3 border-t border-[#E5E4DF] pt-4">
        {!imgErrors[c.id] ? (
          <img
            src={c.imageUrl}
            alt={c.name}
            referrerPolicy="no-referrer"
            onError={() => setImgErrors((prev) => ({ ...prev, [c.id]: true }))}
            className="h-11 w-11 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E6EFEA] font-display text-xs font-semibold text-[#1F6E5D]">
            {c.name.slice(0, 2)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#1C2421] truncate">{c.name}</p>
          <p className="text-xs text-[#575A56] truncate">
            {c.credentials} · Next: {c.nextAvailable}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Intake & Context */}
        <div className="lg:col-span-5 space-y-6 rounded-xl border border-[#E5E4DF] bg-white p-6">
          <div>
            <p className="text-xs font-medium text-[#1F6E5D]">
              Confidential Wellbeing Triage
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1C2421] [text-wrap:balance]">
              Find the right next step, without guessing.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#575A56]">
              Share what is going on in plain words. We will narrow YourDOST’s counseling,
              self-help, assessments, and programs down to one realistic starting point.
            </p>
          </div>

          {/* Quick synthetic scenario presets */}
          <div>
            <p className="text-xs font-medium text-[#575A56] mb-2">
              Try a sample employee scenario
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SYNTHETIC_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleScenarioClick(s)}
                  disabled={isLoading}
                  className="rounded-lg border border-[#E5E4DF] bg-[#F8F7F4] px-3 py-2 text-left transition-colors hover:border-[#1F6E5D] hover:bg-white disabled:opacity-60 cursor-pointer"
                >
                  <span className="block text-xs font-semibold text-[#1C2421] truncate">
                    {s.label}
                  </span>
                  <span className="block mt-0.5 text-[11px] text-[#575A56] truncate">
                    {s.contextLine}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="checkin-message"
                className="block text-xs font-medium text-[#1C2421] mb-1.5"
              >
                What has been weighing on you lately?
              </label>
              <textarea
                id="checkin-message"
                rows={4}
                value={inputContext.message}
                onChange={(e) =>
                  onChangeContext({ ...inputContext, message: e.target.value })
                }
                placeholder="e.g., Exhausted before a deadline, waking up at 3 AM, or unsure whether to talk to a counselor..."
                className="w-full rounded-lg border border-[#E5E4DF] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#1C2421] placeholder:text-[#8A8E88]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-medium text-[#575A56] mb-1.5">
                  Time right now
                </span>
                <div className="flex rounded-lg bg-[#F8F7F4] p-1 border border-[#E5E4DF]">
                  {(
                    [
                      { value: '5_min', label: '5 min' },
                      { value: '15_min', label: '15 min' },
                      { value: '30_plus', label: '30+ min' },
                    ] as { value: TimeAvailable; label: string }[]
                  ).map((opt) => {
                    const active = inputContext.timeAvailable === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          onChangeContext({ ...inputContext, timeAvailable: opt.value })
                        }
                        className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-white text-[#1C2421] shadow-xs'
                            : 'text-[#575A56] hover:text-[#1C2421]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-[#575A56] mb-1.5">
                  Current energy
                </span>
                <div className="flex rounded-lg bg-[#F8F7F4] p-1 border border-[#E5E4DF]">
                  {(
                    [
                      { value: 'low', label: 'Low' },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'steady', label: 'Steady' },
                    ] as { value: EnergyLevel; label: string }[]
                  ).map((opt) => {
                    const active = inputContext.energyLevel === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          onChangeContext({ ...inputContext, energyLevel: opt.value })
                        }
                        className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-white text-[#1C2421] shadow-xs'
                            : 'text-[#575A56] hover:text-[#1C2421]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#575A56] mb-1.5">
                Preference today
              </span>
              <div className="flex rounded-lg bg-[#F8F7F4] p-1 border border-[#E5E4DF]">
                {(
                  [
                    { value: 'open', label: 'Open to any' },
                    { value: 'self_guided', label: 'Self-guided first' },
                    { value: 'talk_to_someone', label: 'Talk to a person' },
                  ] as { value: SupportPreference; label: string }[]
                ).map((opt) => {
                  const active = inputContext.supportPreference === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        onChangeContext({ ...inputContext, supportPreference: opt.value })
                      }
                      className={`flex-1 rounded-md py-1.5 px-2 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white text-[#1C2421] shadow-xs'
                          : 'text-[#575A56] hover:text-[#1C2421]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {inputContext.assessmentSummary && (
              <div className="rounded-lg border border-[#D1E3DD] bg-[#F2F7F5] px-3.5 py-2.5 text-xs text-[#1F6E5D]">
                Included pulse context: {inputContext.assessmentSummary}
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-[#575A56]">
                <Lock className="h-3.5 w-3.5 shrink-0 text-[#1F6E5D]" />
                <span>Session-only · Never shared with HR</span>
              </div>
              {(inputContext.message || recommendation) && (
                <button
                  type="button"
                  onClick={onClearSession}
                  className="text-xs font-medium text-[#575A56] underline underline-offset-2 hover:text-[#1C2421] whitespace-nowrap cursor-pointer"
                >
                  Clear session
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || inputContext.message.trim().length < 6}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F6E5D] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18584A] disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Identifying Your Next Step...' : 'Find My Next Step'}</span>
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        {/* Right Column: Recommendation Canvas */}
        <div className="lg:col-span-7 space-y-6">
          {isLoading && (
            <div
              aria-live="polite"
              className="space-y-5 rounded-xl border border-[#E5E4DF] bg-white p-6"
            >
              <div className="h-4 w-40 rounded bg-[#ECEBE6] animate-pulse" />
              <div className="h-12 w-full rounded bg-[#ECEBE6] animate-pulse" />
              <div className="rounded-xl border border-[#E5E4DF] p-6 space-y-3">
                <div className="h-3 w-32 rounded bg-[#ECEBE6] animate-pulse" />
                <div className="h-6 w-3/4 rounded bg-[#ECEBE6] animate-pulse" />
                <div className="h-14 w-full rounded bg-[#ECEBE6] animate-pulse" />
                <div className="h-10 w-44 rounded bg-[#ECEBE6] animate-pulse" />
              </div>
            </div>
          )}

          {!isLoading && errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-[#E5E4DF] bg-white p-6 space-y-5"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
                <div>
                  <h2 className="text-base font-semibold text-[#1C2421]">
                    Could not complete AI guidance right now
                  </h2>
                  <p className="mt-1 text-sm text-[#575A56]">{errorMsg}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 border-t border-[#E5E4DF] pt-4">
                <button
                  type="button"
                  onClick={() => onSubmitCheckIn()}
                  className="flex items-center gap-2 rounded-lg bg-[#1F6E5D] px-4 py-2 text-sm font-medium text-white hover:bg-[#18584A] cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry Check-In</span>
                </button>
                <button
                  type="button"
                  onClick={() => onBrowseDirectory('counseling')}
                  className="rounded-lg border border-[#E5E4DF] bg-white px-4 py-2 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
                >
                  Browse Counselors Directly
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: 'self-help-breathing',
                      pillar: 'self_help',
                      title: '2-Minute Physiological Reset',
                      whyThisFits: 'Available offline without AI routing.',
                      expectedDuration: '2 min',
                      actionLabel: 'Open 2-Minute Reset',
                    })
                  }
                  className="rounded-lg border border-[#E5E4DF] bg-white px-4 py-2 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
                >
                  Open 2-Minute Reset
                </button>
              </div>
            </div>
          )}

          {!isLoading && !errorMsg && !recommendation && (
            <div className="rounded-xl border border-[#E5E4DF] bg-white p-8 space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F2F7F5] text-[#1F6E5D]">
                  <Compass className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#1C2421]">
                    How your Care Navigator works
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#575A56]">
                    Instead of asking you to guess between booking therapy, taking an assessment,
                    or scrolling through articles, we match one right-sized action to what you are
                    facing and the bandwidth you actually have today.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E5E4DF] pt-6">
                <div>
                  <p className="text-xs font-semibold text-[#1C2421]">01. Context-aware triage</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#575A56]">
                    Considers urgency, time available, and energy—not just keywords.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1C2421]">02. One clear primary step</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#575A56]">
                    Explains why a specific tool, check, or specialist fits right now.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1C2421]">03. Human-first safety</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#575A56]">
                    Elevated distress bypasses quizzes and connects straight to counselors.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E5E4DF] pt-5">
                <p className="text-xs text-[#575A56]">
                  Prefer not to type right now? Start with a structured 4-question pulse check.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: 'assessment-burnout-pulse',
                      pillar: 'assessment',
                      title: 'Burnout & Recovery Pulse Check',
                      whyThisFits: 'Quick structured baseline check.',
                      expectedDuration: '3 min',
                      actionLabel: 'Start 3-Min Pulse Check',
                    })
                  }
                  className="rounded-lg border border-[#E5E4DF] bg-[#F8F7F4] px-4 py-2 text-xs font-medium text-[#1C2421] hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                >
                  Take 3-Min Pulse Check
                </button>
              </div>
            </div>
          )}

          {!isLoading && !errorMsg && recommendation && recommendation.urgencyLevel === 'urgent_human' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-[#B91C1C]" />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#B91C1C]">
                      Immediate Human Support Recommended
                    </p>
                    <h2 className="text-xl font-semibold text-[#1C2421] [text-wrap:balance]">
                      Let us connect you directly with a live counselor right now.
                    </h2>
                    <p className="text-sm leading-relaxed text-[#451A1A]">
                      {recommendation.empatheticReflection}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onOpenPriorityCallback}
                    className="rounded-lg bg-[#B91C1C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#991B1B] cursor-pointer"
                  >
                    Request Immediate Counselor Callback
                  </button>
                  <button
                    type="button"
                    onClick={() => onLaunchStep(recommendation.secondaryRecommendations[0])}
                    className="rounded-lg border border-[#FCA5A5] bg-white px-4 py-2.5 text-sm font-medium text-[#7F1D1D] hover:bg-[#FEF2F2] cursor-pointer"
                  >
                    Start Anonymous Text Chat
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E4DF] bg-white p-6 space-y-4">
                <h3 className="text-sm font-semibold text-[#1C2421]">
                  24/7 Confidential Helplines
                </h3>
                <div className="divide-y divide-[#E5E4DF]">
                  {CRISIS_HELPLINES.map((line) => (
                    <div
                      key={line.name}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1C2421]">{line.name}</p>
                        <p className="text-xs text-[#575A56]">
                          {line.availability} · {line.note}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#1C2421] tabular-nums">
                        {line.contact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!isLoading && !errorMsg && recommendation && recommendation.urgencyLevel !== 'urgent_human' && (
            <div className="space-y-6">
              {/* Empathetic reflection & unboxed metadata */}
              <div className="rounded-xl border border-[#E5E4DF] bg-white p-6 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#575A56]">
                  <span className="font-medium text-[#1F6E5D]">
                    {recommendation.urgencyLevel === 'elevated'
                      ? 'Elevated strain noticed'
                      : 'Recommended starting point'}
                  </span>
                  {recommendation.identifiedThemes.length > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{recommendation.identifiedThemes.join(' · ')}</span>
                    </>
                  )}
                </div>
                <p className="text-base leading-relaxed text-[#1C2421]">
                  {recommendation.empatheticReflection}
                </p>
              </div>

              {/* Primary Recommendation Focal Anchor */}
              <div className="rounded-xl border border-[#1F6E5D] bg-white p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#575A56]">
                  <span className="font-semibold text-[#1F6E5D]">
                    Primary Next Step · {PILLAR_LABEL[recommendation.primaryRecommendation.pillar]}
                  </span>
                  <span className="font-mono tabular-nums">
                    {recommendation.primaryRecommendation.expectedDuration}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-[#1C2421] [text-wrap:balance]">
                  {recommendation.primaryRecommendation.title}
                </h2>

                <div className="rounded-lg bg-[#F8F7F4] p-4">
                  <p className="text-xs font-medium text-[#575A56]">Why this fits right now</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#1C2421]">
                    {recommendation.primaryRecommendation.whyThisFits}
                  </p>
                </div>

                {recommendation.primaryRecommendation.pillar === 'counseling' &&
                  renderPrimaryCounselorPreview(
                    recommendation.primaryRecommendation.counselorId ||
                      recommendation.primaryRecommendation.id
                  )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onLaunchStep(recommendation.primaryRecommendation)}
                    className="flex items-center gap-2 rounded-lg bg-[#1F6E5D] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#18584A] cursor-pointer"
                  >
                    <span>{recommendation.primaryRecommendation.actionLabel}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onBrowseDirectory()}
                    className="rounded-lg border border-[#E5E4DF] bg-white px-4 py-2.5 text-sm font-medium text-[#1C2421] hover:bg-[#F8F7F4] cursor-pointer"
                  >
                    Explore All Options
                  </button>
                </div>
              </div>

              {/* Supporting Alternatives */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#575A56]">
                  Two alternative next steps if you prefer
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendation.secondaryRecommendations.map((step) => (
                    <div
                      key={step.id}
                      className="flex flex-col justify-between rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-4"
                    >
                      <div className="space-y-2">
                        <p className="text-xs text-[#575A56]">
                          {PILLAR_LABEL[step.pillar]} ·{' '}
                          <span className="font-mono tabular-nums">{step.expectedDuration}</span>
                        </p>
                        <h4 className="text-base font-semibold text-[#1C2421]">{step.title}</h4>
                        <p className="text-xs leading-relaxed text-[#575A56]">
                          {step.whyThisFits}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onLaunchStep(step)}
                        className="flex w-full items-center justify-between rounded-lg border border-[#E5E4DF] bg-[#F8F7F4] px-3.5 py-2 text-xs font-semibold text-[#1C2421] transition-colors hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                      >
                        <span>{step.actionLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#1F6E5D]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up refinement */}
              <form
                onSubmit={handleFollowUpSubmit}
                className="rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-3"
              >
                <p className="text-xs font-medium text-[#1C2421]">
                  {recommendation.clarifyingQuestion ||
                    'Want to adjust this recommendation? Tell us what feels off or different.'}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={followUpText}
                    onChange={(e) => setFollowUpText(e.target.value)}
                    placeholder="e.g., I am too drained for video—give me a 2-minute option or chat..."
                    className="flex-1 rounded-lg border border-[#E5E4DF] bg-white px-3.5 py-2 text-sm text-[#1C2421] placeholder:text-[#8A8E88]"
                  />
                  <button
                    type="submit"
                    disabled={!followUpText.trim()}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1C2421] px-4 py-2 text-sm font-medium text-white hover:bg-[#2F3B36] disabled:opacity-40 whitespace-nowrap cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Refine</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
