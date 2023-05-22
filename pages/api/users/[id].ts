import { CollectionName } from 'constants/mongodb';
import jwtDecode from 'jwt-decode';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { User, UserPatchPayload, userPatchSchema } from 'schemas/user';
import { ApiErrorData } from 'utils/auth';
import Mongodb from 'utils/mongodb';
import { ValidationError } from 'yup';

export type ApiUserData = {
  user: User;
};

type ApiPutResultData = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiUserData | ApiErrorData | ApiPutResultData>
) => {
  const id = String(req.query.id);
  const db = new Mongodb();

  if (req.method === 'GET') {
    try {
      const user = await db.findOne<User>(CollectionName.Users, {
        _id: new ObjectId(id),
      });

      if (!user) {
        return res.status(404).json({ message: 'Not found.' });
      }

      db.close();
      return res.status(200).json({ user });
    } catch (error) {
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'PATCH') {
    const accessToken = req.headers.authorization;
    const user: User = jwtDecode(accessToken as string);

    // 본인이 요청하지 않은 경우
    if (id !== user._id) {
      db.close();
      return res.status(400).json({
        message: 'Not yourself.',
      });
    }

    const payload: UserPatchPayload = req.body;

    try {
      const validatedUser = await userPatchSchema.validate(payload);

      // name 수정 요청을 한 경우에만 중복 검사
      if (validatedUser.name) {
        const duplicateNameUser = await db.findOne<User>(CollectionName.Users, {
          name: payload.name,
        });

        // 중복된 이름이 존재하면서 내가 아닌 다른 유저의 이름인 경우
        if (duplicateNameUser && id !== duplicateNameUser._id.toString()) {
          return res.status(409).send({ message: 'Duplicate name.' });
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
      if (error instanceof ValidationError) {
        return res.status(400).send({ message: error.message });
      }

      // TODO: mongodb error
      const { status, message } = Mongodb.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
