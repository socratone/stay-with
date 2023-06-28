import { CollectionName } from 'constants/mongodb';
import { addNotification } from 'helpers/notification';
import jwtDecode from 'jwt-decode';
import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  LexioDivina,
  lexioDivinaCommentPostSchema,
  NotificationType,
  User,
} from 'schemas';
import { blockNotLoggedIn } from 'utils/auth';
import { sendServerError, ServerError } from 'utils/error';
import Mongodb from 'utils/mongodb';

type CommentPostResult = UpdateResult;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CommentPostResult | ServerError>
) => {
  const id = String(req.query.id);
  const validatedComment = await lexioDivinaCommentPostSchema.validate(
    req.body
  );

  if (req.method === 'POST') {
    try {
      const accessToken = req.headers.authorization;
      blockNotLoggedIn(accessToken);

      const commentId = new ObjectId();
      const userId = new ObjectId(validatedComment.userId);

      const db = new Mongodb();
      const result = await db.updateOne(
        CollectionName.LexioDivinas,
        { _id: new ObjectId(id) },
        {
          // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
          $addToSet: {
            comments: {
              _id: commentId,
              userId,
              message: validatedComment.message,
            },
          },
        }
      );

      const lexioDivina = await db.findOne<LexioDivina>(
        CollectionName.LexioDivinas,
        {
          _id: new ObjectId(id),
        }
      );

      // 댓글을 작성한 사람과 lexio divina를 작성한 사람이 동일하다면 notification을 생략한다.
      if (validatedComment.userId === String(lexioDivina?.userId)) {
        return res.status(201).json(result);
      }

      if (accessToken) {
        const user: User = jwtDecode(accessToken as string);

        await addNotification(db, {
          userId,
          notifier: {
            name: user.name,
            imageUrl: user.imageUrl,
          },
          type: NotificationType.LexioDivinaComment,
          message: validatedComment.message,
          lexioDivinaId: new ObjectId(id),
          commentId,
        });
      }

      db.close();
      return res.status(201).json(result);
    } catch (error) {
      return sendServerError(res, error);
    }
  }
};

export default handler;
