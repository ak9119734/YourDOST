import {
  generateRecommendationWithRetry,
  mapNavigatorError,
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
  const { context, followUpNote } = rawBody as {
    context?: UserContextInput;
    followUpNote?: string;
  };

  if (!context || !context.message || !followUpNote || followUpNote.trim().length < 2) {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Please provide a brief refinement note.',
    });
  }

  try {
    const recommendation = await generateRecommendationWithRetry(context, followUpNote.trim());
    return res.status(200).json(recommendation);
  } catch (err: unknown) {
    const mapped = mapNavigatorError(err);
    console.error('[navigator/followup] Gemini error:', err);
    return res.status(mapped.status).json(mapped.body);
  }
}
