import { Bible } from './constants';

export interface Post {
  id: string;
  name: string;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
}
