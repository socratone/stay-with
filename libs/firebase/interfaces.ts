import { Bible } from './constants';

export interface Post {
  id: string;
  // TODO: user id로 해야하지 않나? data structure 숙고
  name: string;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
}
