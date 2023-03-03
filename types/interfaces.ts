import { Bible } from 'constants/bible';

export interface User {
  _id: string;
  kakaoId: number;
  name: string;
  email: string;
  imageUrl?: string;
}

export interface Comment {
  _id: string;
  userId: string;
  message: string;
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
  userId: string;
  likedUserIds: string[];
  comments: Comment[];
}
