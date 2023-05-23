import { Bible } from 'constants/bible';

export type LexioDivinaComment = {
  _id: string;
  userId: string;
  message: string;
};

export type LexioDivina = {
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
  comments: LexioDivinaComment[];
};
