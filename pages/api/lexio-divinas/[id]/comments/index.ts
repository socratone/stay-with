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

type LexioDivinaCommentPostResult = UpdateResult;

type Comment = {
  _id: string;
  userId: string;
  name: string;
  imageUrl: string;
  message: string;
  createdAt: Date;
};

type AggregatedLexioDivina = {
  commentUserIds: string[];
  commentUsers: Omit<User, 'kakaoId' | 'email'>[];
  comments: Comment[];
};

type UsersObject = {
  [userId: string]: {
    name: string;
    imageUrl: string;
  };
};

export type LexioDivinaCommentsData = {
  comments: Comment[];
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<
    LexioDivinaCommentsData | LexioDivinaCommentPostResult | ServerError
  >
) => {
  if (req.method === 'GET') {
    try {
      const id = String(req.query.id);
      const db = new Mongodb();

      const [lexioDivina] = await db.aggregate<AggregatedLexioDivina[]>(
        CollectionName.LexioDivinas,
        [
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $addFields: {
              commentUserIds: {
                $map: {
                  input: '$comments',
                  as: 'comment',
                  in: '$$comment.userId',
                },
              },
            },
          },
          // https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#use--lookup-with-an-array
          {
            $lookup: {
              from: CollectionName.Users,
              localField: 'commentUserIds',
              foreignField: '_id',
              as: 'commentUsers',
              pipeline: [
                // 민감한 정보 제거
                {
                  $project: {
                    kakaoId: 0,
                    email: 0,
                  },
                },
              ],
            },
          },
        ]
      );

      if (!lexioDivina) {
        db.close();
        return res.status(404).json({ error: { message: 'Not found.' } });
      }

      const commentUsers = lexioDivina.commentUsers;
      const commentUsersObject: UsersObject = commentUsers.reduce(
        (object, user) => {
          return {
            ...object,
            [user._id]: {
              name: user.name,
              imageUrl: user.imageUrl,
            },
          };
        },
        {}
      );

      const comments = lexioDivina.comments.map((comment) => {
        const user = commentUsersObject[comment.userId];
        return {
          _id: comment._id,
          userId: comment.userId,
          name: user.name,
          imageUrl: user.imageUrl,
          message: comment.message,
          createdAt: new ObjectId(comment._id).getTimestamp(),
        };
      });

      db.close();
      return res.status(200).json({ comments });
    } catch (error) {
      sendServerError(res, error);
    }
  }

  if (req.method === 'POST') {
    const id = String(req.query.id);
    const validatedComment = await lexioDivinaCommentPostSchema.validate(
      req.body
    );

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

      if (!lexioDivina) {
        return res.status(500).json({
          error: {
            message: `Can't access lexio divina data.`,
          },
        });
      }

      const lexioDivinaAuthorId = String(lexioDivina?.userId);

      // 댓글을 작성한 사람과 lexio divina를 작성한 사람이 동일하다면 notification을 생략한다.
      if (validatedComment.userId === lexioDivinaAuthorId) {
        return res.status(201).json(result);
      }

      if (accessToken) {
        const user: User = jwtDecode(accessToken as string);

        await addNotification(db, {
          userId: new ObjectId(lexioDivinaAuthorId),
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
