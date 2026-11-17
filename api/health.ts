interface ServerlessRequest {
  method?: string;
}

interface ServerlessResponse {
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
}

export default function handler(req: ServerlessRequest, res: ServerlessResponse) {
  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  return res.status(200).json({ status: 'ok', service: 'yourdost-navigator' });
}
