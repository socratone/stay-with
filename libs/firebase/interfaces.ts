import { Bible } from './constants';

export interface User {
  id: string;
  nickname: string;
  email: string;
  password: string;
}

export interface Post {
  id: string;
  user: Omit<User, 'password' | 'email'>;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
}
