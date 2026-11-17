import { useState } from 'react';
import { TopNav, type ActiveTab } from './components/TopNav';
import { NavigatorWorkspace } from './components/NavigatorWorkspace';
import { DirectoryView } from './components/DirectoryView';
import { WalkthroughView } from './components/WalkthroughView';
import { CounselorBookingDrawer } from './components/CounselorBookingDrawer';
import { InteractiveSelfHelpModal } from './components/InteractiveSelfHelpModal';
import type { SyntheticScenario } from './data/wellbeingCatalog';
import type {
  NavigatorRecommendationResponse,
  RecommendedStep,
  ServicePillar,
  UserContextInput,
} from './types';

const INITIAL_CONTEXT: UserContextInput = {
  message: '',
  timeAvailable: '15_min',
  energyLevel: 'moderate',
  supportPreference: 'open',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('navigator');
  const [directoryFilter, setDirectoryFilter] = useState<ServicePillar | 'all'>('all');

  const [inputContext, setInputContext] = useState<UserContextInput>(INITIAL_CONTEXT);
  const [recommendation, setRecommendation] =
    useState<NavigatorRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Booking drawer state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingCounselorId, setBookingCounselorId] = useState<string | undefined>(undefined);
  const [priorityCallbackMode, setPriorityCallbackMode] = useState(false);

  // Interactive self-help / assessment / program modal state
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [activeResourcePillar, setActiveResourcePillar] = useState<ServicePillar | null>(null);

  const parseJsonResponse = async (res: Response) => {
    const raw = await res.text();
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      throw new Error(
        `The AI service endpoint returned an unexpected response (HTTP ${res.status}). Ensure your server or /api serverless functions are deployed with GEMINI_API_KEY configured.`
      );
    }
  };

  const handleSubmitCheckIn = async (overrideContext?: UserContextInput) => {
    const ctx = overrideContext || inputContext;
    if (ctx.message.trim().length < 6) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/navigator/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctx),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(
          typeof data.message === 'string' ? data.message : 'Could not retrieve recommendation.'
        );
      }

      setRecommendation(data as unknown as NavigatorRecommendationResponse);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to reach Care Navigator right now. You can browse counselors or tools directly.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFollowUp = async (followUpNote: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/navigator/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: inputContext, followUpNote }),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok) {
        throw new Error(
          typeof data.message === 'string' ? data.message : 'Could not refine recommendation.'
        );
      }
      setRecommendation(data as unknown as NavigatorRecommendationResponse);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unable to refine recommendation right now.';
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSession = () => {
    setInputContext(INITIAL_CONTEXT);
    setRecommendation(null);
    setErrorMsg(null);
  };

  const handleLaunchStep = (step: RecommendedStep) => {
    if (step.pillar === 'counseling') {
      setBookingCounselorId(step.counselorId || step.id);
      setPriorityCallbackMode(recommendation?.urgencyLevel === 'urgent_human');
      setBookingOpen(true);
      return;
    }
    setActiveResourceId(step.id);
    setActiveResourcePillar(step.pillar);
  };

  const handleRefineWithAssessment = (assessmentSummary: string) => {
    const updatedCtx: UserContextInput = {
      ...inputContext,
      message:
        inputContext.message.trim().length >= 6
          ? inputContext.message
          : 'I just completed a quick wellbeing pulse check and want the best next step based on my score.',
      assessmentSummary,
    };
    setInputContext(updatedCtx);
    setActiveTab('navigator');
    handleSubmitCheckIn(updatedCtx);
  };

  const handleRunWalkthroughScenario = (scenario: SyntheticScenario) => {
    const nextCtx: UserContextInput = {
      message: scenario.message,
      timeAvailable: scenario.timeAvailable,
      energyLevel: scenario.energyLevel,
      supportPreference: scenario.supportPreference,
    };
    setInputContext(nextCtx);
    setActiveTab('navigator');
    handleSubmitCheckIn(nextCtx);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#1C2421]">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCounselorSupport={() => {
          setBookingCounselorId(undefined);
          setPriorityCallbackMode(false);
          setBookingOpen(true);
        }}
      />

      <main className="flex-1">
        {activeTab === 'navigator' && (
          <NavigatorWorkspace
            inputContext={inputContext}
            onChangeContext={setInputContext}
            recommendation={recommendation}
            isLoading={isLoading}
            errorMsg={errorMsg}
            onSubmitCheckIn={handleSubmitCheckIn}
            onSubmitFollowUp={handleSubmitFollowUp}
            onClearSession={handleClearSession}
            onLaunchStep={handleLaunchStep}
            onOpenPriorityCallback={() => {
              setBookingCounselorId('counselor-ananya');
              setPriorityCallbackMode(true);
              setBookingOpen(true);
            }}
            onBrowseDirectory={(pillar) => {
              setDirectoryFilter(pillar || 'all');
              setActiveTab('directory');
            }}
          />
        )}

        {activeTab === 'directory' && (
          <DirectoryView
            initialFilter={directoryFilter}
            onLaunchStep={handleLaunchStep}
          />
        )}

        {activeTab === 'walkthrough' && (
          <WalkthroughView
            onRunScenario={handleRunWalkthroughScenario}
            onOpenDirectory={() => {
              setDirectoryFilter('all');
              setActiveTab('directory');
            }}
          />
        )}
      </main>

      <footer className="border-t border-[#E5E4DF] bg-[#F8F7F4] py-6 px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#575A56]">
          <span>YourDOST Next-Step Navigator · Synthetic prototype for evaluation</span>
          <span>Non-diagnostic care routing · Confidential session architecture</span>
        </div>
      </footer>

      <CounselorBookingDrawer
        isOpen={bookingOpen}
        initialCounselorId={bookingCounselorId}
        priorityCallbackMode={priorityCallbackMode}
        onClose={() => setBookingOpen(false)}
      />

      <InteractiveSelfHelpModal
        resourceId={activeResourceId}
        pillar={activeResourcePillar}
        onClose={() => {
          setActiveResourceId(null);
          setActiveResourcePillar(null);
        }}
        onRefineWithAssessment={handleRefineWithAssessment}
        onBookCounselor={() => {
          setBookingCounselorId(undefined);
          setPriorityCallbackMode(false);
          setBookingOpen(true);
        }}
      />
    </div>
  );
}
