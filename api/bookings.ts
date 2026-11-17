import { createSyntheticBooking } from '../lib/navigatorService';

interface ServerlessRequest {
  method?: string;
  body?: unknown;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST.' });
  }

  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const booking = createSyntheticBooking(rawBody);
  return res.status(200).json(booking);
}
