import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const COUNSELOR_CATALOG = [
  {
    id: 'counselor-ananya',
    name: 'Dr. Ananya Deshmukh',
    specialties: ['Workplace burnout', 'Anxiety & overwhelm', 'Boundary setting'],
    nextAvailable: 'Today, 4:30 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
  },
  {
    id: 'counselor-rohan',
    name: 'Rohan Kulkarni',
    specialties: ['Manager conflict', 'Career transitions', 'Imposter feelings'],
    nextAvailable: 'Today, 5:15 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
  },
  {
    id: 'counselor-meera',
    name: 'Meera Kapoor',
    specialties: ['Sleep recovery', 'Somatic stress', 'Caregiver & parent balance'],
    nextAvailable: 'Today, 8:00 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
  },
];

const SELF_HELP_CATALOG = [
  {
    id: 'self-help-breathing',
    title: '2-Minute Physiological Reset',
    durationLabel: '2 min · Guided pacing',
    category: 'Acute calm',
    summary:
      'Slows racing heart rate and breaks acute overwhelm through four paced 4-4-4-4 breathing cycles.',
  },
  {
    id: 'self-help-worry-triage',
    title: '5-Minute Control & Priority Split',
    durationLabel: '5 min · Interactive worksheet',
    category: 'Mental clarity',
    summary:
      'Separates what needs one concrete action today from background worries you can deliberately park.',
  },
  {
    id: 'self-help-sleep-winddown',
    title: 'Evening Off-Ramp Protocol',
    durationLabel: '6 min · Wind-down checklist',
    category: 'Sleep & recovery',
    summary:
      'A low-effort end-of-workday transition to stop replaying Slack threads and unresolved tasks before bed.',
  },
];

const ASSESSMENT_CATALOG = [
  {
    id: 'assessment-burnout-pulse',
    title: 'Burnout & Recovery Pulse Check',
    durationLabel: '3 min · 4 questions',
    summary:
      'Distinguishes temporary heavy-week fatigue from deeper emotional exhaustion so you pick the right support level.',
  },
  {
    id: 'assessment-stress-sleep',
    title: 'Acute Stress & Sleep Check',
    durationLabel: '3 min · 4 questions',
    summary:
      'Evaluates how current stressors are affecting sleep onset, physical tension, and day-to-day focus.',
  },
];

const PROGRAM_CATALOG = [
  {
    id: 'program-boundaries',
    title: 'Sustainable Boundaries & Focus',
    durationLabel: '14-day cohort · 10 min/day',
    focusArea: 'Burnout prevention',
    summary:
      'Practical scripts and workload habits for high-output employees learning to say no without guilt.',
  },
  {
    id: 'program-sleep',
    title: 'Deep Sleep & Nervous System Reset',
    durationLabel: '21-day guided track · 8 min/evening',
    focusArea: 'Rest & recovery',
    summary:
      'Evidence-informed CBT-I habits to rebuild consistent sleep drive and quiet late-night rumination.',
  },
  {
    id: 'program-conversations',
    title: 'Navigating Difficult Workplace Conversations',
    durationLabel: '3-week micro-program · 12 min/session',
    focusArea: 'Workplace relationships',
    summary:
      'Builds calm confidence before performance reviews, scope pushback, or tense peer conversations.',
  },
];

const COUNSELOR_IDS = new Set(COUNSELOR_CATALOG.map((c) => c.id));
const VALID_IDS = new Set([
  ...COUNSELOR_CATALOG.map((c) => c.id),
  ...SELF_HELP_CATALOG.map((s) => s.id),
  ...ASSESSMENT_CATALOG.map((a) => a.id),
  ...PROGRAM_CATALOG.map((p) => p.id),
]);

const CRISIS_PATTERNS = [
  /\b(suicide|suicidal|kill myself|end my life|want to die|better off dead|self[- ]?harm|cut myself|hurt myself)\b/i,
  /\b(not safe|unsafe being alone|cannot go on|no reason to live|hopeless.*tonight|end it all)\b/i,
];

export function detectDeterministicCrisis(text) {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(text));
}

export function redactForLogs(text) {
  return String(text || '')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/\b\d{10,13}\b/g, '[REDACTED_PHONE]')
    .slice(0, 60);
}

function getCatalogSummaryForPrompt() {
  const counselorsText = COUNSELOR_CATALOG.map(
    (c) =>
      `- ID: "${c.id}" | Pillar: "counseling" | Title: "1-on-1 Session with ${c.name}" | Specialties: ${c.specialties.join(', ')} | Next slot: ${c.nextAvailable} | Formats: ${c.sessionFormats.join('/')}`
  ).join('\n');

  const selfHelpText = SELF_HELP_CATALOG.map(
    (s) =>
      `- ID: "${s.id}" | Pillar: "self_help" | Title: "${s.title}" | Duration: ${s.durationLabel} | Focus: ${s.category} — ${s.summary}`
  ).join('\n');

  const assessmentsText = ASSESSMENT_CATALOG.map(
    (a) =>
      `- ID: "${a.id}" | Pillar: "assessment" | Title: "${a.title}" | Duration: ${a.durationLabel} | Summary: ${a.summary}`
  ).join('\n');

  const programsText = PROGRAM_CATALOG.map(
    (p) =>
      `- ID: "${p.id}" | Pillar: "program" | Title: "${p.title}" | Duration: ${p.durationLabel} | Focus: ${p.focusArea} — ${p.summary}`
  ).join('\n');

  return [
    'COUNSELORS (pillar: "counseling"):',
    counselorsText,
    '',
    'SELF-HELP TOOLS (pillar: "self_help"):',
    selfHelpText,
    '',
    'ASSESSMENTS (pillar: "assessment"):',
    assessmentsText,
    '',
    'WELLBEING PROGRAMS (pillar: "program"):',
    programsText,
  ].join('\n');
}

export function buildUrgentHumanResponse(reason) {
  return {
    urgencyLevel: 'urgent_human',
    safetyEscalationReason: reason,
    empatheticReflection:
      'Thank you for sharing how heavy things feel right now. You do not have to carry this alone tonight—let us connect you directly with a trained human counselor rather than giving you self-help tasks.',
    identifiedThemes: ['Immediate emotional distress', 'Human care priority'],
    primaryRecommendation: {
      id: 'counselor-ananya',
      pillar: 'counseling',
      title: 'Immediate Priority Counselor Callback or Live Chat',
      whyThisFits:
        'When distress feels acute or unsafe, speaking directly with a compassionate specialist is the safest and most supportive step.',
      expectedDuration: 'Immediate priority queue',
      actionLabel: 'Request Priority Callback Now',
      counselorId: 'counselor-ananya',
    },
    secondaryRecommendations: [
      {
        id: 'counselor-meera',
        pillar: 'counseling',
        title: 'Anonymous Text-First Session with Meera Kapoor',
        whyThisFits:
          'If speaking out loud feels too hard right now, you can start privately over text chat with a senior clinical specialist.',
        expectedDuration: 'Available today · Private chat',
        actionLabel: 'Start Private Chat Booking',
        counselorId: 'counselor-meera',
      },
      {
        id: 'counselor-rohan',
        pillar: 'counseling',
        title: '1-on-1 Audio Support with Rohan Kulkarni',
        whyThisFits:
          'A calm voice conversation focused purely on immediate stabilization and practical support without pressure.',
        expectedDuration: 'Available today · 30 min',
        actionLabel: 'Book Audio Session',
        counselorId: 'counselor-rohan',
      },
    ],
    privacyNote: 'Your message stays confidential to this session and is never shared with your employer.',
  };
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateRecommendationWithRetry(input, followUpNote) {
  const combinedText = `${input.message} ${followUpNote || ''}`.trim();
  if (detectDeterministicCrisis(combinedText)) {
    return buildUrgentHumanResponse(
      'Detected expressions of severe hopelessness or potential safety risk. Routing immediately to live human support.'
    );
  }

  const ai = getGeminiClient();

  const systemInstruction = `You are the YourDOST Care Navigator—a warm, grounded triage and care-routing assistant helping corporate employees find the single most relevant next step in their mental wellbeing journey.

CRITICAL BOUNDARIES:
1. You are NOT a therapist, doctor, or diagnostic tool. Never diagnose conditions (never say "you have clinical depression" or "you have GAD").
2. Never overwhelm the user. Select exactly ONE primary next step and TWO distinct secondary options strictly using the exact IDs from the provided YourDOST Catalog.
3. Match recommendations realistically to the user's constraints:
   - If timeAvailable is "5_min" and energyLevel is "low", prioritize a 2-5 min self-help tool (like "self-help-breathing" or "self-help-worry-triage") or a quick 3-min pulse check, NOT a 21-day program.
   - If supportPreference is "talk_to_someone", prioritize 1-on-1 counseling matched to their specific theme (burnout -> Dr. Ananya Deshmukh; manager conflict/career -> Rohan Kulkarni; sleep/parenting -> Meera Kapoor).
   - If the user has severe distress, self-harm ideation, hopelessness, or feeling unsafe, set urgencyLevel to "urgent_human" and exclusively recommend counseling options (never self-help).
4. Explain "whyThisFits" in plain, empathetic, concrete language referencing their stated situation and time/energy constraints without sounding robotic or clinical.
5. Keep empatheticReflection to 2 concise, warm sentences. Never use toxic positivity ("Everything happens for a reason!").

AVAILABLE YOURDOST CATALOG:
${getCatalogSummaryForPrompt()}`;

  const userPrompt = [
    `Employee check-in: "${input.message}"`,
    `Time available right now: ${input.timeAvailable}`,
    `Current energy level: ${input.energyLevel}`,
    `Support preference: ${input.supportPreference}`,
    input.assessmentSummary ? `Recent pulse check result: ${input.assessmentSummary}` : '',
    followUpNote ? `Follow-up refinement from user: "${followUpNote}"` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const stepSchema = {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: 'Exact catalog ID from the provided YourDOST catalog.',
      },
      pillar: {
        type: Type.STRING,
        description: 'Must be one of: counseling, self_help, assessment, program',
      },
      title: { type: Type.STRING },
      whyThisFits: {
        type: Type.STRING,
        description: '1-2 sentences explaining why this step fits their specific situation and constraints.',
      },
      expectedDuration: { type: Type.STRING },
      actionLabel: {
        type: Type.STRING,
        description: 'Plain-language action button label under 5 words (e.g., "Start 2-Minute Reset", "Book Chat Slot").',
      },
    },
    required: ['id', 'pillar', 'title', 'whyThisFits', 'expectedDuration', 'actionLabel'],
  };

  const modelAttempts = [
    { model: 'gemini-3.1-flash-lite', thinkingLevel: ThinkingLevel.MINIMAL },
    { model: 'gemini-4-hydrogen', thinkingLevel: ThinkingLevel.LOW },
  ];

  let lastError;
  for (let attempt = 0; attempt < modelAttempts.length; attempt++) {
    const { model, thinkingLevel } = modelAttempts[attempt];
    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                urgencyLevel: {
                  type: Type.STRING,
                  description: 'Must be one of: routine, elevated, urgent_human',
                },
                safetyEscalationReason: {
                  type: Type.STRING,
                  description: 'Only populate if urgencyLevel is urgent_human.',
                },
                empatheticReflection: {
                  type: Type.STRING,
                  description: '2 short warm sentences acknowledging what they shared without diagnosing.',
                },
                identifiedThemes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '1 to 3 concise plain-text themes.',
                },
                primaryRecommendation: stepSchema,
                secondaryRecommendations: {
                  type: Type.ARRAY,
                  items: stepSchema,
                  description: 'Exactly 2 supporting recommendations with distinct catalog IDs.',
                },
                clarifyingQuestion: {
                  type: Type.STRING,
                  description: 'Optional 1-line follow-up question to refine further if needed.',
                },
              },
              required: [
                'urgencyLevel',
                'empatheticReflection',
                'identifiedThemes',
                'primaryRecommendation',
                'secondaryRecommendations',
              ],
            },
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`UPSTREAM_TIMEOUT:${model}`)), 12000)
        ),
      ]);

      const rawText = (response.text || '')
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      const parsed = JSON.parse(rawText);

      if (parsed.urgencyLevel === 'urgent_human') {
        return buildUrgentHumanResponse(
          parsed.safetyEscalationReason ||
            'Your check-in suggests intense emotional strain where direct human support is the safest priority.'
        );
      }

      const normalizeStep = (step) => {
        const safeId = step && VALID_IDS.has(step.id) ? step.id : 'self-help-worry-triage';
        return {
          ...step,
          id: safeId,
          counselorId: COUNSELOR_IDS.has(safeId) ? safeId : undefined,
        };
      };

      const primary = normalizeStep(parsed.primaryRecommendation);
      const secondaries = (parsed.secondaryRecommendations || [])
        .filter((s) => s && s.id !== primary.id)
        .slice(0, 2)
        .map(normalizeStep);

      return {
        urgencyLevel: parsed.urgencyLevel === 'elevated' ? 'elevated' : 'routine',
        empatheticReflection: parsed.empatheticReflection,
        identifiedThemes: (parsed.identifiedThemes || []).slice(0, 3),
        primaryRecommendation: primary,
        secondaryRecommendations: secondaries,
        clarifyingQuestion: parsed.clarifyingQuestion,
        privacyNote:
          'Session-only guidance · Not stored in employer HR systems · Clear anytime.',
      };
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (/403|API_KEY_INVALID|PERMISSION_DENIED/i.test(msg)) {
        break;
      }
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
  }

  throw lastError;
}

export function mapNavigatorError(err) {
  const errMessage = err instanceof Error ? err.message : 'Unknown error';
  const errStatus =
    typeof err === 'object' && err !== null && 'status' in err ? err.status : undefined;

  if (errMessage === 'GEMINI_API_KEY_MISSING') {
    return {
      status: 503,
      body: {
        error: 'AI_UNAVAILABLE',
        message:
          'AI guidance is temporarily unavailable because the GEMINI_API_KEY environment variable is not set. You can browse counselors and self-help tools directly below.',
      },
    };
  }

  if (
    errStatus === 403 ||
    errStatus === 400 ||
    /PERMISSION_DENIED|API_KEY_INVALID/i.test(errMessage)
  ) {
    return {
      status: errStatus || 403,
      body: {
        error: 'GEMINI_AUTH_ERROR',
        message:
          'AI guidance could not authenticate with the GEMINI_API_KEY environment variable. Please verify the key in your deployment environment or Secrets panel, or browse counselors and self-help tools directly below.',
      },
    };
  }

  if (errStatus === 429 || /RESOURCE_EXHAUSTED/i.test(errMessage)) {
    return {
      status: 429,
      body: {
        error: 'GEMINI_QUOTA_ERROR',
        message:
          'AI guidance is momentarily rate-limited. Please try again in a few seconds or browse counselors directly below.',
      },
    };
  }

  return {
    status: 502,
    body: {
      error: 'UPSTREAM_AI_ERROR',
      message:
        'We could not complete the AI check-in right now. Your words were not saved, and you can connect directly with a counselor or open any self-help tool below.',
    },
  };
}

export function createSyntheticBooking(payload = {}) {
  const counselor = COUNSELOR_CATALOG.find((c) => c.id === payload.counselorId) || COUNSELOR_CATALOG[0];
  const refNumber = Math.floor(1000 + Math.random() * 9000);

  return {
    referenceId: `YD-${refNumber}`,
    counselorName: counselor.name,
    format: payload.format || 'Chat',
    slot: payload.priorityCallback
      ? 'Priority callback within 15 minutes'
      : payload.slot || counselor.nextAvailable,
    alias: (payload.alias && String(payload.alias).trim()) || 'Anonymous Employee',
    priorityCallback: Boolean(payload.priorityCallback),
    createdAt: new Date().toISOString(),
  };
}

export async function parseRequestBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      return JSON.parse(req.body || '{}');
    }
    if (Buffer.isBuffer(req.body)) {
      return JSON.parse(req.body.toString('utf8') || '{}');
    }
    if (typeof req.body === 'object') {
      return req.body;
    }
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}
