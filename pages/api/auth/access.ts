import { NextApiRequest, NextApiResponse } from 'next';

export type ApiAuthAccessData = {
  accessToken: string;
};

export type ApiAuthAccessPayload = {
  googleId: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { googleId }: ApiAuthAccessPayload = req.body;

    const data: ApiAuthAccessData = { accessToken: '1234qwer!@#$' }; // TODO: access token generater
    return res.status(200).json(data);
  }

  return res.status(400).json({});
}
