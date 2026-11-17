import {
  generateRecommendationWithRetry,
  mapNavigatorError,
  parseRequestBody,
} from '../_navigator.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST.' });
    }

    const body = await parseRequestBody(req);
    const { context, followUpNote } = body || {};

    if (!context || !context.message || !followUpNote || String(followUpNote).trim().length < 2) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Please provide a brief refinement note.',
      });
    }

    try {
      const recommendation = await generateRecommendationWithRetry(context, String(followUpNote).trim());
      return res.status(200).json(recommendation);
    } catch (err) {
      const mapped = mapNavigatorError(err);
      console.error('[navigator/followup] Gemini error:', err);
      return res.status(mapped.status).json(mapped.body);
    }
  } catch (fatalErr) {
    console.error('[api/navigator/followup] fatal:', fatalErr);
    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Unable to refine recommendation right now.',
    });
  }
}
