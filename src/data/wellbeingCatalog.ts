import {
  AssessmentItem,
  CounselorProfile,
  SelfHelpResource,
  WellbeingProgram,
} from '../types';

export const COUNSELORS: CounselorProfile[] = [
  {
    id: 'counselor-ananya',
    name: 'Dr. Ananya Deshmukh',
    credentials: 'PhD, Counseling Psychology · 9 yrs exp',
    specialties: ['Workplace burnout', 'Anxiety & overwhelm', 'Boundary setting'],
    languages: ['English', 'Hindi', 'Marathi'],
    nextAvailable: 'Today, 4:30 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
    bio: 'Works with product, engineering, and operations teams navigating sustained deadline pressure, perfectionism, and emotional exhaustion.',
    imageUrl: '/src/assets/images/counselor_ananya_1794897508909.jpg',
    availableSlots: ['Today, 4:30 PM', 'Today, 6:00 PM', 'Tomorrow, 10:30 AM', 'Tomorrow, 2:00 PM'],
  },
  {
    id: 'counselor-rohan',
    name: 'Rohan Kulkarni',
    credentials: 'MSc Applied Psychology · 7 yrs exp',
    specialties: ['Manager conflict', 'Career transitions', 'Imposter feelings'],
    languages: ['English', 'Hindi', 'Kannada'],
    nextAvailable: 'Today, 5:15 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
    bio: 'Focuses on interpersonal workplace friction, high-stakes feedback conversations, and regaining clarity during role or team changes.',
    imageUrl: '/src/assets/images/counselor_rohan_1794897511851.jpg',
    availableSlots: ['Today, 5:15 PM', 'Today, 7:30 PM', 'Tomorrow, 11:00 AM', 'Tomorrow, 4:00 PM'],
  },
  {
    id: 'counselor-meera',
    name: 'Meera Kapoor',
    credentials: 'MPhil Clinical Psychology · 11 yrs exp',
    specialties: ['Sleep recovery', 'Somatic stress', 'Caregiver & parent balance'],
    languages: ['English', 'Hindi', 'Punjabi'],
    nextAvailable: 'Today, 8:00 PM',
    sessionFormats: ['Chat', 'Audio', 'Video'],
    bio: 'Specializes in nervous-system regulation, sleep-onset rumination, and supporting working parents returning from extended leave.',
    imageUrl: '/src/assets/images/counselor_meera_1794897512194.jpg',
    availableSlots: ['Today, 8:00 PM', 'Tomorrow, 9:30 AM', 'Tomorrow, 1:00 PM', 'Tomorrow, 6:30 PM'],
  },
];

export const SELF_HELP_RESOURCES: SelfHelpResource[] = [
  {
    id: 'self-help-breathing',
    title: '2-Minute Physiological Reset',
    durationLabel: '2 min · Guided pacing',
    category: 'Acute calm',
    summary: 'Slows racing heart rate and breaks acute overwhelm through four paced 4-4-4-4 breathing cycles.',
    interactiveType: 'breathing',
  },
  {
    id: 'self-help-worry-triage',
    title: '5-Minute Control & Priority Split',
    durationLabel: '5 min · Interactive worksheet',
    category: 'Mental clarity',
    summary: 'Separates what needs one concrete action today from background worries you can deliberately park.',
    interactiveType: 'worry_triage',
  },
  {
    id: 'self-help-sleep-winddown',
    title: 'Evening Off-Ramp Protocol',
    durationLabel: '6 min · Wind-down checklist',
    category: 'Sleep & recovery',
    summary: 'A low-effort end-of-workday transition to stop replaying Slack threads and unresolved tasks before bed.',
    interactiveType: 'sleep_winddown',
  },
];

export const ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'assessment-burnout-pulse',
    title: 'Burnout & Recovery Pulse Check',
    durationLabel: '3 min · 4 questions',
    questionCount: 4,
    summary: 'Distinguishes temporary heavy-week fatigue from deeper emotional exhaustion so you pick the right support level.',
    questions: [
      {
        id: 'bp1',
        prompt: 'Over the past 2 weeks, how often have you felt drained before the workday even begins?',
        options: [
          { label: 'Rarely or never', score: 0 },
          { label: 'A few mornings', score: 1 },
          { label: 'More than half the days', score: 2 },
          { label: 'Nearly every morning', score: 3 },
        ],
      },
      {
        id: 'bp2',
        prompt: 'When you step away from work in the evening, how easily can you mentally switch off?',
        options: [
          { label: 'I unwind comfortably', score: 0 },
          { label: 'Takes an hour or two', score: 1 },
          { label: 'My mind keeps replaying tasks', score: 2 },
          { label: 'I feel unable to detach at all', score: 3 },
        ],
      },
      {
        id: 'bp3',
        prompt: 'How has your patience with teammates or loved ones felt lately?',
        options: [
          { label: 'Steady and present', score: 0 },
          { label: 'Slightly thinner than usual', score: 1 },
          { label: 'Noticeably irritable or detached', score: 2 },
          { label: 'Completely depleted', score: 3 },
        ],
      },
      {
        id: 'bp4',
        prompt: 'Do small, routine decisions feel unusually heavy right now?',
        options: [
          { label: 'Not really', score: 0 },
          { label: 'Occasionally', score: 1 },
          { label: 'Often', score: 2 },
          { label: 'Almost constantly', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'assessment-stress-sleep',
    title: 'Acute Stress & Sleep Check',
    durationLabel: '3 min · 4 questions',
    questionCount: 4,
    summary: 'Evaluates how current stressors are affecting sleep onset, physical tension, and day-to-day focus.',
    questions: [
      {
        id: 'ss1',
        prompt: 'How long does it typically take you to fall asleep after getting into bed?',
        options: [
          { label: 'Under 20 minutes', score: 0 },
          { label: '20 to 40 minutes', score: 1 },
          { label: '40 to 60 minutes with racing thoughts', score: 2 },
          { label: 'Over an hour or waking repeatedly', score: 3 },
        ],
      },
      {
        id: 'ss2',
        prompt: 'How often do you notice physical tension (tight jaw, shoulders, shallow breathing) during the day?',
        options: [
          { label: 'Rarely', score: 0 },
          { label: 'Once or twice a week', score: 1 },
          { label: 'Most workdays', score: 2 },
          { label: 'Almost continuously', score: 3 },
        ],
      },
      {
        id: 'ss3',
        prompt: 'When unexpected changes hit your schedule, how does your nervous system react?',
        options: [
          { label: 'Adaptable', score: 0 },
          { label: 'Briefly rattled, then steady', score: 1 },
          { label: 'Overwhelmed for several hours', score: 2 },
          { label: 'Paralyzed or near panic', score: 3 },
        ],
      },
      {
        id: 'ss4',
        prompt: 'How confident do you feel about getting through this week sustainably?',
        options: [
          { label: 'Very confident', score: 0 },
          { label: 'Mostly manageable', score: 1 },
          { label: 'Barely holding it together', score: 2 },
          { label: 'Not confident without help', score: 3 },
        ],
      },
    ],
  },
];

export const WELLBEING_PROGRAMS: WellbeingProgram[] = [
  {
    id: 'program-boundaries',
    title: 'Sustainable Boundaries & Focus',
    durationLabel: '14-day cohort · 10 min/day',
    cadence: 'Async audio + 2 live group check-ins',
    summary: 'Practical scripts and workload habits for high-output employees learning to say no without guilt.',
    focusArea: 'Burnout prevention',
    modules: [
      'Auditing invisible time leaks',
      'Resetting manager & stakeholder expectations',
      'Guilt-free end-of-day shutdown rituals',
    ],
  },
  {
    id: 'program-sleep',
    title: 'Deep Sleep & Nervous System Reset',
    durationLabel: '21-day guided track · 8 min/evening',
    cadence: 'Evening audio + weekly sleep log',
    summary: 'Evidence-informed CBT-I habits to rebuild consistent sleep drive and quiet late-night rumination.',
    focusArea: 'Rest & recovery',
    modules: [
      'Breaking the bed-worry association',
      'Circadian anchoring for hybrid schedules',
      '90-minute evening decompression',
    ],
  },
  {
    id: 'program-conversations',
    title: 'Navigating Difficult Workplace Conversations',
    durationLabel: '3-week micro-program · 12 min/session',
    cadence: 'Interactive roleplay prompts + counselor Q&A',
    summary: 'Builds calm confidence before performance reviews, scope pushback, or tense peer conversations.',
    focusArea: 'Workplace relationships',
    modules: [
      'Separating intent from defensive reactions',
      'Structuring non-escalating feedback',
      'Decompressing after high-friction meetings',
    ],
  },
];

export interface SyntheticScenario {
  id: string;
  label: string;
  contextLine: string;
  message: string;
  timeAvailable: '5_min' | '15_min' | '30_plus';
  energyLevel: 'low' | 'moderate' | 'steady';
  supportPreference: 'open' | 'self_guided' | 'talk_to_someone';
}

export const SYNTHETIC_SCENARIOS: SyntheticScenario[] = [
  {
    id: 'scenario-burnout',
    label: 'Q4 Launch Burnout',
    contextLine: 'Exhausted, 15 min free, unsure where to start',
    message:
      'We have a major product release in two weeks and I have been working till 10 PM every night. Even on Sunday I feel a knot in my stomach and cannot relax. I know I should do something, I just do not have the bandwidth for a long program right now.',
    timeAvailable: '15_min',
    energyLevel: 'low',
    supportPreference: 'open',
  },
  {
    id: 'scenario-conflict',
    label: 'Manager Tension & Sleep',
    contextLine: 'Friction at work, waking up at 3 AM',
    message:
      'Ever since a tense 1-on-1 with my manager last Tuesday, I keep replaying what I should have said. I am waking up at 3 AM thinking about my performance review and dreading morning standups.',
    timeAvailable: '30_plus',
    energyLevel: 'moderate',
    supportPreference: 'talk_to_someone',
  },
  {
    id: 'scenario-overwhelm',
    label: 'Acute Midday Overwhelm',
    contextLine: 'Only 5 min between meetings, racing heart',
    message:
      'Back-to-back calls all morning and three urgent escalations just landed in Slack. My chest feels tight and I cannot focus on a single sentence. I literally have 5 minutes before my next call.',
    timeAvailable: '5_min',
    energyLevel: 'low',
    supportPreference: 'self_guided',
  },
  {
    id: 'scenario-crisis',
    label: 'Acute Distress (Safety Escalation)',
    contextLine: 'Tests immediate human-support & safety guardrail',
    message:
      'I feel completely hopeless lately. Nothing at work or home feels worth trying anymore and I do not feel safe being alone with my thoughts tonight.',
    timeAvailable: '15_min',
    energyLevel: 'low',
    supportPreference: 'open',
  },
];

export const CRISIS_HELPLINES = [
  {
    name: 'YourDOST Priority Care Desk',
    availability: '24/7 Immediate Counselor Callback',
    contact: 'Instant priority queue inside this app',
    note: 'Confidential · Zero employer visibility',
  },
  {
    name: 'Tele-MANAS (National Mental Health Helpline)',
    availability: '24/7 Toll-Free',
    contact: '14416 or 1-800-891-4416',
    note: 'Multilingual crisis counseling support',
  },
  {
    name: 'Kiran Helpline',
    availability: '24/7 Support',
    contact: '1800-599-0019',
    note: 'Immediate emotional support & triage',
  },
];
