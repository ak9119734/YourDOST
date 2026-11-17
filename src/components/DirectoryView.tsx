import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  ASSESSMENTS,
  COUNSELORS,
  SELF_HELP_RESOURCES,
  WELLBEING_PROGRAMS,
} from '../data/wellbeingCatalog';
import type { RecommendedStep, ServicePillar } from '../types';

interface DirectoryViewProps {
  initialFilter?: ServicePillar | 'all';
  onLaunchStep: (step: RecommendedStep) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  initialFilter = 'all',
  onLaunchStep,
}) => {
  const [filter, setFilter] = useState<ServicePillar | 'all'>(initialFilter);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const tabs: { id: ServicePillar | 'all'; label: string }[] = [
    { id: 'all', label: 'All Services' },
    { id: 'counseling', label: '1-on-1 Counseling' },
    { id: 'self_help', label: 'Self-Help Tools' },
    { id: 'assessment', label: 'Assessments' },
    { id: 'program', label: 'Programs' },
  ];

  const showSection = (pillar: ServicePillar) => filter === 'all' || filter === pillar;

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E4DF] pb-6">
        <div>
          <p className="text-xs font-medium text-[#1F6E5D]">YourDOST Wellbeing Catalog</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#1C2421]">
            Browse all support services directly
          </h1>
          <p className="mt-1.5 text-sm text-[#575A56]">
            Direct manual access is always available—whether or not you use the AI Care Navigator.
          </p>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto rounded-lg border border-[#E5E4DF] bg-white p-1">
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#1F6E5D] text-white'
                    : 'text-[#575A56] hover:text-[#1C2421]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {showSection('counseling') && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#1C2421]">01. 1-on-1 Counseling Specialists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COUNSELORS.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3.5">
                    {!imgErrors[c.id] ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        onError={() => setImgErrors((prev) => ({ ...prev, [c.id]: true }))}
                        className="h-14 w-14 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#E6EFEA] font-display text-sm font-semibold text-[#1F6E5D]">
                        {c.name.slice(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[#1C2421] truncate">{c.name}</h3>
                      <p className="text-xs text-[#575A56] truncate">{c.credentials}</p>
                    </div>
                  </div>
                  <p className="text-xs font-mono text-[#1F6E5D]">Next slot: {c.nextAvailable}</p>
                  <p className="text-sm leading-relaxed text-[#575A56]">{c.bio}</p>
                  <p className="text-xs text-[#575A56]">
                    {c.specialties.join(' · ')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: c.id,
                      pillar: 'counseling',
                      title: `Session with ${c.name}`,
                      whyThisFits: c.bio,
                      expectedDuration: '30–45 min',
                      actionLabel: 'Book Session',
                      counselorId: c.id,
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-[#F8F7F4] border border-[#E5E4DF] px-4 py-2 text-xs font-semibold text-[#1C2421] hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                >
                  <span>Book Confidential Session</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#1F6E5D]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSection('self_help') && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#1C2421]">02. Interactive Self-Help Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SELF_HELP_RESOURCES.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs text-[#575A56]">
                    {item.category} · <span className="font-mono">{item.durationLabel}</span>
                  </p>
                  <h3 className="text-base font-semibold text-[#1C2421]">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575A56]">{item.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: item.id,
                      pillar: 'self_help',
                      title: item.title,
                      whyThisFits: item.summary,
                      expectedDuration: item.durationLabel,
                      actionLabel: 'Open Exercise',
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-[#F8F7F4] border border-[#E5E4DF] px-4 py-2 text-xs font-semibold text-[#1C2421] hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                >
                  <span>Start Interactive Exercise</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#1F6E5D]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSection('assessment') && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#1C2421]">03. Quick Pulse Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ASSESSMENTS.map((a) => (
              <div
                key={a.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs font-mono text-[#575A56]">{a.durationLabel}</p>
                  <h3 className="text-base font-semibold text-[#1C2421]">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575A56]">{a.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: a.id,
                      pillar: 'assessment',
                      title: a.title,
                      whyThisFits: a.summary,
                      expectedDuration: a.durationLabel,
                      actionLabel: 'Take Pulse Check',
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-[#F8F7F4] border border-[#E5E4DF] px-4 py-2 text-xs font-semibold text-[#1C2421] hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                >
                  <span>Start 4-Question Check</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#1F6E5D]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSection('program') && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-[#1C2421]">04. Structured Wellbeing Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WELLBEING_PROGRAMS.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs text-[#575A56]">
                    {p.focusArea} · <span className="font-mono">{p.durationLabel}</span>
                  </p>
                  <h3 className="text-base font-semibold text-[#1C2421]">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[#575A56]">{p.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onLaunchStep({
                      id: p.id,
                      pillar: 'program',
                      title: p.title,
                      whyThisFits: p.summary,
                      expectedDuration: p.durationLabel,
                      actionLabel: 'View Program',
                    })
                  }
                  className="flex w-full items-center justify-between rounded-lg bg-[#F8F7F4] border border-[#E5E4DF] px-4 py-2 text-xs font-semibold text-[#1C2421] hover:border-[#1F6E5D] hover:bg-white cursor-pointer"
                >
                  <span>View Syllabus & Enroll</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#1F6E5D]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
