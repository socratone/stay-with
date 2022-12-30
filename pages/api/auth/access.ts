import { NextApiRequest, NextApiResponse } from 'next';

export type ApiAuthAccessData = {
  accessToken: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data: ApiAuthAccessData = { accessToken: '1234qwer!@#$' }; // TODO: access token generater
  return res.status(200).json(data);
}
