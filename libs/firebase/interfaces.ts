import { Bible } from './constants';

export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  image?: string;
}

export interface Comment {
  user: User;
  message: string;
  createdAt: number;
}

export interface Post {
  id: string;
  user: User;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
  createdAt: number;
  updatedAt: number;
  likedUsers: {
    [id: string]: Omit<User, 'id'>;
  };
  comments: Comment[];
}
