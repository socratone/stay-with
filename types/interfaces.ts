import { Bible } from 'constants/bible';

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
  bible: Bible;
  content: string;
  phrase: string;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  updatedAt: number;
  userId: string;
  createdAt: number;
  likedUserIds: string[];
  comments: Comment[];
}
