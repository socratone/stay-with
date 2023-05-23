import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { isLoggedIn } from 'utils/auth';
import { ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type LexioDivinaLikedPostPayload = {
  userId: string;
};

type ApiLikedResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiLikedResultData | ServerError>
) => {
  const id = String(req.query.id);
  const payload: LexioDivinaLikedPostPayload = req.body;

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    const db = new Mongodb();

    try {
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            likedUserIds: new ObjectId(payload.userId),
          },
        }
      );

      db.close();
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
