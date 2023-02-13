import { NextApiRequest, NextApiResponse } from 'next';
import { Post } from 'libs/firebase/interfaces';
import { ApiErrorData, isLoggedIn } from 'utils/api';
import Database, { CollectionName, FindParams } from 'server/database';
import { InsertOneResult } from 'mongodb';

export type ApiPostPayload = Omit<Post, 'id'>;

export type ApiPostsData = { posts: Post[]; total: number };

export type ApiPostResultData = InsertOneResult<Document>;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiPostsData | ApiPostResultData | ApiErrorData>
) => {
  const db = new Database();

  if (req.method === 'GET') {
    let params: FindParams = {};

    if (req.query.page) {
      params['skip'] = (Number(req.query.page) - 1) * Number(req.query.count);
    }

    if (req.query.count) {
      params['limit'] = Number(req.query.count);
    }

    try {
      const posts = await db.find(CollectionName.Posts, params);
      const total = await db.count(CollectionName.Posts);
      return res.status(200).json({ posts, total });
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }

  if (req.method === 'POST') {
    const accessToken = req.headers.authorization;

    if (!isLoggedIn(accessToken)) {
      return res.status(401).json({
        message: 'Unauthorized.',
      });
    }

    try {
      const result = await db.insertOne(CollectionName.Posts, req.body);
      return res.status(201).json(result);
    } catch (error) {
      const { status, message } = db.parseError(error);
      return res.status(status).send({ message });
    }
  }
};

export default handler;
