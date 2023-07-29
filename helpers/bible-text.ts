export const isEndText = (text: string) => {
  const regex = /[가-힣]\./;
  return regex.test(text);
};

export const isStartWithNumber = (text: string) => {
  const regex = /^[ ]*[0-9]/;
  return regex.test(text);
};

export const isStartWithLordWord = (text: string) => {
  const regex = /^[ ]*주님의 말씀입니다\.?[ ]*◎/;
  return regex.test(text);
};

export const isStartWithDoubleCircle = (text: string) => {
  const regex = /^[ ]*◎/;
  return regex.test(text);
};

export const isBibleChapterVerseNumberNext = (text: string) => {
  const lastChar = text.substring(text.length - 1);
  const lastCharRegex = /[가-힣]/;
  if (!lastCharRegex.test(lastChar)) return false;
  const textWithoutLastChar = text.substring(0, text.length - 1);
  const regex = /[0-9]+,[0-9]+[ㄱㄴㄷ-]+[,0-9]+[ ]*/;
  return regex.test(textWithoutLastChar);
};
