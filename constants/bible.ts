export enum Bible {
  Genesis = 'genesis',
  Exodus = 'exodus',
  Leviticus = 'leviticus',
  Numbers = 'numbers',
  Deuteronomy = 'deuteronomy',
  // ...
  Matthew = 'matthew',
  Mark = 'mark',
  Luke = 'luke',
  John = 'john',
  Acts = 'acts',
}

// TODO: 나머지 성경 채우기
export const bibleLabel = {
  [Bible.Genesis]: '창세',
  [Bible.Exodus]: '탈출',
  [Bible.Leviticus]: '레위',
  [Bible.Numbers]: '민수',
  [Bible.Deuteronomy]: '신명',
  // ...
  [Bible.Matthew]: '마태',
  [Bible.Mark]: '마르',
  [Bible.Luke]: '루카',
  [Bible.John]: '요한',
  [Bible.Acts]: '사도',
};

export const bibleOptions = Object.keys(bibleLabel).map((key) => {
  return {
    value: key,
    label: bibleLabel[key as Bible],
  };
});
