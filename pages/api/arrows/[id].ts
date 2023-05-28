import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Arrow, arrowPutSchema, User } from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type ArrowData = {
  arrow: Arrow;
};
type ArrowPutResult = UpdateResult;
type ArrowDeleteResult = DeleteResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    ArrowData | ArrowPutResult | ArrowDeleteResult | ServerError
  >
) => {
  const id = String(req.query.id);
  const db = new Mongodb();

  if (req.method === 'GET') {
    try {
      const arrow = await db.findOne<Arrow>(CollectionName.Arrows, {
        _id: new ObjectId(id),
      });

      if (!arrow) {
        db.close();
        return res.status(404).json({ message: 'Not found.' });
      }

      db.close();
      return res.status(200).json({ arrow });
    } catch (error) {
      sendServerError(res, error);
    }
  }

  try {
    const accessToken = req.headers.authorization;
    blockNotLoggedIn(accessToken);

    const user: User = jwtDecode(accessToken as string);

    const arrow = await db.findOne<Arrow>(CollectionName.Arrows, {
      _id: new ObjectId(id),
    });

    if (!arrow) {
      db.close();
      return res.status(404).json({ message: 'Not found.' });
    }

    if (user._id !== String(arrow.userId)) {
      db.close();
      return res.status(400).json({
        message: 'Not the author.',
      });
    }
  } catch (error: any) {
    sendServerError(res, error);
  }

  if (req.method === 'PUT') {
    try {
      const validatedArrow = await arrowPutSchema.validate(req.body);
      const result = await db.updateOne(
        CollectionName.Arrows,
        {
          _id: new ObjectId(id),
        },
        {
          $set: validatedArrow,
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await db.deleteOne(CollectionName.Arrows, {
        _id: new ObjectId(id),
      });
      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
