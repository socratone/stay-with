import { CollectionName } from 'constants/mongodb';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserPatchPayload, userPatchSchema } from 'schemas';
import { blockNotLoggedIn, isMyId } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

export type UserData = {
  user: User;
};

type UserPatchResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserData | UserPatchResult | ServerError>
) => {
  const id = String(req.query.id);
  const db = new Mongodb();

  if (req.method === 'GET') {
    try {
      const user = await db.findOne<User>(CollectionName.Users, {
        _id: new ObjectId(id),
      });

      if (!user) {
        return res.status(404).json({ error: { message: 'Not found.' } });
      }

      db.close();
      return res.status(200).json({ user });
    } catch (error) {
      return sendServerError(res, error);
    }
  }

  if (req.method === 'PATCH') {
    const accessToken = req.headers.authorization;
    const payload: UserPatchPayload = req.body;

    try {
      blockNotLoggedIn(accessToken);
      if (!isMyId(id, accessToken)) {
        db.close();
        return res.status(403).json({
          error: { message: 'Not yourself.' },
        });
      }

      const validatedUser = await userPatchSchema.validate(payload);

      // name 수정 요청을 한 경우에만 중복 검사
      if (validatedUser.name) {
        const duplicateNameUser = await db.findOne<User>(CollectionName.Users, {
          name: payload.name,
        });

        // 중복된 이름이 존재하면서 내가 아닌 다른 유저의 이름인 경우
        if (duplicateNameUser && id !== duplicateNameUser._id.toString()) {
          return res
            .status(409)
            .send({ error: { message: 'Duplicate name.' } });
        }
      }

      const result = await db.updateOne(
        CollectionName.Users,
        {
          _id: new ObjectId(id),
        },
        {
          $set: { ...validatedUser },
        }
      );

      db.close();
      return res.status(200).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
