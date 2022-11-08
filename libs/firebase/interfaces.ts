import { Bible } from './constants';

export interface User {
  name: string;
  email: string;
  image?: string;
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
}
