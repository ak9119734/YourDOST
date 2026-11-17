import { createSyntheticBooking, parseRequestBody } from './_navigator.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST.' });
    }
    const body = await parseRequestBody(req);
    const booking = createSyntheticBooking(body);
    return res.status(200).json(booking);
  } catch (err) {
    console.error('[api/bookings] error:', err);
    return res.status(500).json({
      error: 'BOOKING_ERROR',
      message: 'Unable to reserve this slot right now. Please try again.',
    });
  }
}
