import {
  generateRecommendationWithRetry,
  mapNavigatorError,
  redactForLogs,
} from '../../lib/navigatorService';
import type { UserContextInput } from '../../src/types';

interface ServerlessRequest {
  method?: string;
  body?: unknown;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST.' });
  }

  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const body = rawBody as Partial<UserContextInput>;
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (message.length < 6) {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Please share a few words about what is on your mind (at least 6 characters).',
    });
  }

  const input: UserContextInput = {
    message: message.slice(0, 1500),
    timeAvailable: body.timeAvailable || '15_min',
    energyLevel: body.energyLevel || 'moderate',
    supportPreference: body.supportPreference || 'open',
    assessmentSummary:
      typeof body.assessmentSummary === 'string' ? body.assessmentSummary.slice(0, 400) : undefined,
  };

  try {
    const recommendation = await generateRecommendationWithRetry(input);
    console.info(
      `[navigator] routed urgency=${recommendation.urgencyLevel} primary=${recommendation.primaryRecommendation.id} preview="${redactForLogs(message)}"`
    );
    return res.status(200).json(recommendation);
  } catch (err: unknown) {
    const mapped = mapNavigatorError(err);
    console.error('[navigator] Gemini error:', err);
    return res.status(mapped.status).json(mapped.body);
  }
}
