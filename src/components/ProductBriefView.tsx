import React from 'react';

export const ProductBriefView: React.FC = () => {
  return (
    <article className="mx-auto max-w-[920px] px-6 py-10 space-y-10">
      <header className="space-y-3 border-b border-[#E5E4DF] pb-6">
        <p className="text-xs font-medium text-[#1F6E5D]">
          Product Case Study · Max 2-Page Brief
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1C2421] [text-wrap:balance]">
          YourDOST Next-Step Navigator: Turning Wellbeing Choice Overload into Action
        </h1>
        <p className="text-sm leading-relaxed text-[#575A56]">
          How constrained, safety-first AI triage helps employees move from uncertain distress to
          the single most relevant YourDOST intervention in under 60 seconds.
        </p>
      </header>

      {/* 1. Opportunity */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#1C2421]">
          01. Identify the Opportunity & Why AI
        </h2>
        <p className="text-sm leading-relaxed text-[#575A56]">
          <strong className="font-semibold text-[#1C2421]">The User Problem:</strong> Employees
          opening a wellbeing portal rarely think in clinical categories. Someone facing a deadline
          crunch, 3 AM insomnia, and manager friction does not know whether they need a 45-minute
          therapy session, a 3-minute burnout screen, or a quick breathing reset. Faced with four
          service pillars and dozens of resources, fatigued users experience decision paralysis and
          leave without taking any step.
        </p>
        <p className="text-sm leading-relaxed text-[#575A56]">
          <strong className="font-semibold text-[#1C2421]">Why AI Is Appropriate:</strong> Rigid
          branching questionnaires feel bureaucratic when cognitive bandwidth is already low, while
          keyword search fails because users describe messy life contexts rather than service
          names. An LLM paired with strict structured output can synthesize unstructured emotional
          context alongside real-time constraints (5 minutes vs. 30 minutes, low energy vs. ready to
          talk) and explain in plain, human language why one concrete starting point fits right
          now.
        </p>
      </section>

      {/* 2. Key Features */}
      <section className="space-y-4 border-t border-[#E5E4DF] pt-8">
        <h2 className="text-lg font-semibold text-[#1C2421]">
          02. Key Features & Experience Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-[#1C2421]">
              Low-Friction Context Intake
            </h3>
            <p className="text-xs leading-relaxed text-[#575A56]">
              Combines one optional free-text reflection with three 1-tap constraint selectors
              (time available, current energy, self-guided vs. human preference) so recommendations
              respect what the employee can realistically do today.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-[#1C2421]">
              1 Primary + 2 Supporting Ranked Steps
            </h3>
            <p className="text-xs leading-relaxed text-[#575A56]">
              Instead of returning a 10-link search list, Gemini selects a single Primary Next Step
              with a transparent “Why this fits right now” rationale, plus two distinct fallback
              options across Counseling, Self-Help, Assessments, or Programs.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-[#1C2421]">
              In-Flow Execution (Zero Dead Ends)
            </h3>
            <p className="text-xs leading-relaxed text-[#575A56]">
              Every recommended item launches an interactive experience inside the prototype—a live
              2-minute breathing pacer, a worry-control split worksheet, a 4-question pulse check
              that recalibrates routing, or a 1-on-1 counselor slot booking drawer.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-5 space-y-2">
            <h3 className="text-sm font-semibold text-[#1C2421]">
              Conversational Refinement Loop
            </h3>
            <p className="text-xs leading-relaxed text-[#575A56]">
              If a suggestion misses the mark (e.g., “too drained for video”), a gentle clarifying
              prompt lets the employee adjust constraints in one line without restarting.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Assumptions & Trade-offs */}
      <section className="space-y-3 border-t border-[#E5E4DF] pt-8">
        <h2 className="text-lg font-semibold text-[#1C2421]">
          03. Assumptions & Key Trade-offs
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-[#575A56]">
          <p>
            <strong className="font-semibold text-[#1C2421]">
              Care Router, Not AI Therapist (Safety over Open Chat):
            </strong>{' '}
            We intentionally avoided building an open-ended therapeutic chatbot. Open chatbots risk
            clinical overreach, sycophancy, or keeping distressed users talking to software instead
            of human experts. Restricting Gemini via JSON schema to vetted YourDOST catalog IDs
            eliminates hallucinated advice and keeps human care central.
          </p>
          <p>
            <strong className="font-semibold text-[#1C2421]">
              Ephemeral Privacy over Longitudinal Memory:
            </strong>{' '}
            In corporate EAP settings, fear of employer visibility is the primary barrier to entry.
            This prototype runs statelessly per session with zero database storage of raw employee
            disclosures—trading cross-month personalization for immediate psychological safety.
          </p>
          <p>
            <strong className="font-semibold text-[#1C2421]">
              Brevity over Diagnostic Depth:
            </strong>{' '}
            Three quick context pills capture enough signal to distinguish a 2-minute panic reset
            from a 30-minute counselor booking without intimidating fatigued users.
          </p>
        </div>
      </section>

      {/* 4. Safety, Privacy & Error Handling */}
      <section className="space-y-3 border-t border-[#E5E4DF] pt-8">
        <h2 className="text-lg font-semibold text-[#1C2421]">
          04. AI Errors, Sensitive Data & Human Escalation
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[#E5E4DF] bg-white">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E5E4DF] bg-[#F8F7F4] text-[#575A56]">
              <tr>
                <th className="px-4 py-3 font-semibold text-[#1C2421]">Risk Area</th>
                <th className="px-4 py-3 font-semibold text-[#1C2421]">Implemented Guardrail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E4DF] text-[#575A56]">
              <tr>
                <td className="px-4 py-3 font-medium text-[#1C2421] whitespace-nowrap">
                  Acute Crisis / Self-Harm
                </td>
                <td className="px-4 py-3">
                  Dual-layer check: deterministic regex pre-filter plus AI urgency classification.
                  When triggered, self-help quizzes are suppressed and the UI routes immediately to
                  24/7 crisis helplines and a priority 15-minute counselor callback flow.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#1C2421] whitespace-nowrap">
                  Sensitive Employee PII
                </td>
                <td className="px-4 py-3">
                  Server-side log redaction strips emails/phone numbers; raw check-in text is never
                  persisted; counselor booking supports anonymous aliases and states zero HR
                  reporting.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-[#1C2421] whitespace-nowrap">
                  AI Timeout or API Error
                </td>
                <td className="px-4 py-3">
                  Automatic single retry with backoff; on failure, displays a calm recovery card
                  offering direct manual counselor browsing and offline-ready 2-minute breathing so
                  the user is never blocked.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Measuring Success */}
      <section className="space-y-3 border-t border-[#E5E4DF] pt-8">
        <h2 className="text-lg font-semibold text-[#1C2421]">05. How We Measure Success</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-4 space-y-1">
            <p className="text-xs font-medium text-[#575A56]">Primary Activation</p>
            <p className="text-base font-semibold text-[#1C2421]">Next-Step Initiation</p>
            <p className="text-xs text-[#575A56]">
              % of check-ins that start a recommended exercise, pulse check, or counselor slot.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-4 space-y-1">
            <p className="text-xs font-medium text-[#575A56]">Friction Reduction</p>
            <p className="text-base font-semibold text-[#1C2421]">Time-to-First-Action</p>
            <p className="text-xs text-[#575A56]">
              Median seconds from landing on portal to starting relevant support (target &lt; 90s).
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-4 space-y-1">
            <p className="text-xs font-medium text-[#575A56]">Relevance Calibration</p>
            <p className="text-base font-semibold text-[#1C2421]">1-Turn Match Rate</p>
            <p className="text-xs text-[#575A56]">
              % accepted without needing follow-up refinement or bouncing back to search.
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E4DF] bg-white p-4 space-y-1">
            <p className="text-xs font-medium text-[#575A56]">Clinical Safety</p>
            <p className="text-base font-semibold text-[#1C2421]">Escalation Precision</p>
            <p className="text-xs text-[#575A56]">
              Zero missed urgent-distress escalations in anonymized clinician QA audits.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
