import { LexioDivina, LexioDivinaComment } from 'schemas';

type Validation = {
  minLength?: number;
  maxLength?: number;
};

type LexioDivinaValidation = {
  [Key in keyof Omit<LexioDivina, '_id'>]+?: Validation;
};

type LexioDivinaCommentValidation = {
  [Key in keyof Omit<LexioDivinaComment, '_id'>]+?: Validation;
};

/**
 * @deprecated
 */
export const LEXIO_DIVINA_VALIDATION = {
  phrase: {
    maxLength: 300,
  },
  content: { minLength: 10, maxLength: 3000 },
} satisfies LexioDivinaValidation;

/**
 * @deprecated
 */
export const LEXIO_DIVINA_COMMENT_VALIDATION = {
  message: {
    maxLength: 300,
  },
} satisfies LexioDivinaCommentValidation;
