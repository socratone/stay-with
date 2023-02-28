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

export interface LexioDivina {
  _id: string;
  bible: Bible;
  content: string;
  phrase: string;
  chapter: number;
  verse: number;
  endChapter: number;
  endVerse: number;
  updatedAt: number;
  userId: string;
  createdAt: number;
  likedUserIds: string[];
  comments: Comment[];
}
