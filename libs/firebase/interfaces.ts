export interface Post {
  id: string;
  name: string;
  phrase: string;
  book: string;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
}
