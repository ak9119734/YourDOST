import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  createSyntheticBooking,
  generateRecommendationWithRetry,
  mapNavigatorError,
  redactForLogs,
} from './api/_navigator.js';
import type { UserContextInput } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'yourdost-navigator' });
  });

  app.post('/api/navigator/recommend', async (req, res) => {
    const body = req.body as Partial<UserContextInput>;
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
      return res.json(recommendation);
    } catch (err: unknown) {
      const mapped = mapNavigatorError(err);
      console.error('[navigator] Gemini error:', err);
      return res.status(mapped.status).json(mapped.body);
    }
  });

  app.post('/api/navigator/followup', async (req, res) => {
    const { context, followUpNote } = req.body as {
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
      return res.json(recommendation);
    } catch (err: unknown) {
      const mapped = mapNavigatorError(err);
      console.error('[navigator/followup] Gemini error:', err);
      return res.status(mapped.status).json(mapped.body);
    }
  });

  app.post('/api/bookings', (req, res) => {
    const booking = createSyntheticBooking(req.body || {});
    return res.json(booking);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YourDOST Navigator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
