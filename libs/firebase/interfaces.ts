import { Bible } from './constants';

export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  image?: string;
}

export interface Comment {
  _id: string;
  userId: string;
  message: string;
  createdAt: number;
}

export interface Post {
  _id: string;
  userId: string;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
  createdAt: number;
  updatedAt: number;
  likedUserIds: string[];
  comments: Comment[];
}
