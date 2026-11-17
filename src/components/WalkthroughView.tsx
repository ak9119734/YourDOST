import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SYNTHETIC_SCENARIOS } from '../data/wellbeingCatalog';
import type { SyntheticScenario } from '../data/wellbeingCatalog';

interface WalkthroughViewProps {
  onRunScenario: (scenario: SyntheticScenario) => void;
  onOpenDirectory: () => void;
}

export const WalkthroughView: React.FC<WalkthroughViewProps> = ({
  onRunScenario,
  onOpenDirectory,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Scenario A — Exhausted Employee Unsure Where to Start',
      description:
        'Tests how AI balances emotional burnout with low bandwidth (15 min, low energy), steering the employee away from heavy multi-week commitments toward an immediate pulse check or low-effort reset.',
      scenario: SYNTHETIC_SCENARIOS[0],
    },
    {
      num: '02',
      title: 'Scenario B — Manager Conflict & 3 AM Rumination',
      description:
        'Tests specialist matching across YourDOST counselors. Notice how the navigator routes specifically to Rohan Kulkarni (Manager Conflict & Career Stress) and lets you complete a confidential slot reservation.',
      scenario: SYNTHETIC_SCENARIOS[1],
    },
    {
      num: '03',
      title: 'Scenario C — Acute Midday Overwhelm (5-Minute Constraint)',
      description:
        'Tests constraint obedience. With only 5 minutes before the next meeting and self-guided preference, the navigator recommends the interactive 2-Minute Physiological Reset with a live breathing timer.',
      scenario: SYNTHETIC_SCENARIOS[2],
    },
    {
      num: '04',
      title: 'Scenario D — Acute Distress & Human Safety Escalation',
      description:
        'Tests our deterministic + AI safety guardrail. Self-help exercises and quizzes are immediately suppressed in favor of warm human-first care, 24/7 helplines, and a 1-click priority counselor callback.',
      scenario: SYNTHETIC_SCENARIOS[3],
    },
  ];

  return (
    <section className="mx-auto max-w-[920px] px-6 py-10 space-y-8">
      <header className="space-y-2 border-b border-[#E5E4DF] pb-6">
        <p className="text-xs font-medium text-[#1F6E5D]">Interactive Prototype Walkthrough</p>
        <h1 className="text-2xl font-semibold text-[#1C2421]">
          Five ways to test the end-to-end Care Navigator
        </h1>
        <p className="text-sm text-[#575A56]">
          Click any scenario below to jump directly into the Care Navigator with synthetic employee
          context preloaded and trigger live Gemini triage.
        </p>
      </header>

      <div className="space-y-4">
        {steps.map((item) => (
          <div
            key={item.num}
            className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-xl border border-[#E5E4DF] bg-white p-6"
          >
            <div className="space-y-1.5 max-w-xl">
              <p className="text-xs font-mono text-[#1F6E5D]">Walkthrough {item.num}</p>
              <h2 className="text-base font-semibold text-[#1C2421]">{item.title}</h2>
              <p className="text-sm leading-relaxed text-[#575A56]">{item.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onRunScenario(item.scenario)}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1F6E5D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#18584A] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Run Scenario {item.num}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-xl border border-[#E5E4DF] bg-[#F8F7F4] p-6">
          <div className="space-y-1.5 max-w-xl">
            <p className="text-xs font-mono text-[#575A56]">Walkthrough 05</p>
            <h2 className="text-base font-semibold text-[#1C2421]">
              Manual Bypass & Services Directory
            </h2>
            <p className="text-sm leading-relaxed text-[#575A56]">
              Verify that employees are never trapped inside AI triage—browse all counselors,
              self-help tools, pulse checks, and programs directly at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDirectory}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E4DF] bg-white px-4 py-2.5 text-sm font-medium text-[#1C2421] hover:border-[#1F6E5D] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open Services Directory</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
