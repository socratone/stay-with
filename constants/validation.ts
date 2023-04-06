import { LexioDivina } from 'types/document';

type Validation = {
  minLength?: number;
  maxLength?: number;
};

type LexioDivinaValidation = {
  [Key in keyof Omit<LexioDivina, '_id'>]+?: Validation;
};

export const LEXIO_DIVINA_VALIDATION = {
  phrase: {
    maxLength: 300,
  },
  content: { minLength: 10, maxLength: 3000 },
} satisfies LexioDivinaValidation;
