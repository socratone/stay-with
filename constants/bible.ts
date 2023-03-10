export enum Bible {
  // 오경
  Genesis = 'genesis', // 창세기
  Exodus = 'exodus', // 탈출기
  Leviticus = 'leviticus', // 레위기
  Numbers = 'numbers', // 민수기
  Deuteronomy = 'deuteronomy', // 신명기
  // 역사서
  Joshua = 'joshua', // 여호수아기
  Judges = 'judges', // 판관기
  Ruth = 'ruth', // 롯기
  SamuelFirst = 'samuel-first', // 사무엘기 상권
  SamuelSecond = 'samuel-second', // 사무엘기 하권
  KingsFirst = 'kings-first', // 열왕기 상권
  KingsSecond = 'kings-second', // 열왕기 하권
  ChroniclesFirst = 'chronicles-first', // 역대기 상권
  ChroniclesSecond = 'chronicles-second', // 역대기 하권
  Ezra = 'ezra', // 에즈라기
  Nehemiah = 'nehemiah', // 느헤미야기
  Tobit = 'tobit', // 토빗기
  Judith = 'judith', // 유딧기
  Esther = 'esther', // 에스테르기
  MaccabeesFirst = 'maccabees-first', // 마카베오기 상권
  MaccabeesSecond = 'maccabees-second', // 마카베오기 하권
  // 시서와 지혜서
  Job = 'job', // 욥기
  Psalms = 'psalms', // 시편
  Proverbs = 'proverbs', // 잠언
  Ecclesiastes = 'ecclesiastes', // 코헬렛
  SongOfSongs = 'song-of-songs', // 아가
  Wisdom = 'wisdom', // 지혜서
  Sirach = 'sirach', // 집회서
  // 예언서
  Isaiah = 'isaiah', // 이사야서
  Jeremiah = 'jeremiah', // 예레미야서
  Lamentations = 'lamentations', // 애가
  Baruch = 'baruch', // 바룩서
  Ezekiel = 'ezekiel', // 에제키엘서
  Daniel = 'daniel', // 다니엘서
  Hosea = 'hosea', // 호세아서
  Joel = 'joel', // 요엘서
  Amos = 'amos', // 아모스서
  Obadiah = 'obadiah', // 오바드야서
  Jonah = 'jonah', // 요나서
  Micah = 'micah', // 미카서
  Nahum = 'nahum', // 나훔서
  Habakkuk = 'habakkuk', // 하바쿡서
  Zephaniah = 'zephaniah', // 스바니야서
  Haggai = 'haggai', // 하까이서
  Zechariah = 'zechariah', // 즈카르야서
  Malachi = 'malachi', // 말라키서
  // 신약
  Matthew = 'matthew',
  Mark = 'mark',
  Luke = 'luke',
  John = 'john',
  Acts = 'acts',
  Romans = 'romans',
  CorinthiansFirst = 'corinthians-first',
  CorinthiansSecond = 'corinthians-second',
  Galatians = 'galatians',
  Ephesians = 'ephesians',
  Philippians = 'philippians',
  Colossians = 'colossians',
  ThessaloniansFirst = 'thessalonians-first',
  ThessaloniansSecond = 'thessalonians-second',
  TimothyFirst = 'timothy-first',
  TimothySecond = 'timothy-second',
  Titus = 'titus',
  Philemon = 'philemon',
  Hebrews = 'hebrews',
  James = 'james',
  PeterFirst = 'peter-first',
  PeterSecond = 'peter-second',
  JohnFirst = 'john-first',
  JohnSecond = 'john-second',
  JohnThird = 'john-third',
  Jude = 'jude',
  Revelation = 'revelation',
}

export const BIBLE_LABEL = {
  [Bible.Genesis]: '창세',
  [Bible.Exodus]: '탈출',
  [Bible.Leviticus]: '레위',
  [Bible.Numbers]: '민수',
  [Bible.Deuteronomy]: '신명',
  [Bible.Joshua]: '여호',
  [Bible.Judges]: '판관',
  [Bible.Ruth]: '룻',
  [Bible.SamuelFirst]: '1사무',
  [Bible.SamuelSecond]: '2사무',
  [Bible.KingsFirst]: '1열왕',
  [Bible.KingsSecond]: '2열왕',
  [Bible.ChroniclesFirst]: '1역대',
  [Bible.ChroniclesSecond]: '2역대',
  [Bible.Ezra]: '에즈',
  [Bible.Nehemiah]: '느헤',
  [Bible.Tobit]: '토빗',
  [Bible.Judith]: '유딧',
  [Bible.Esther]: '에스',
  [Bible.MaccabeesFirst]: '1마카',
  [Bible.MaccabeesSecond]: '2마카',
  [Bible.Job]: '욥',
  [Bible.Psalms]: '시편',
  [Bible.Proverbs]: '잠언',
  [Bible.Ecclesiastes]: '코헬',
  [Bible.SongOfSongs]: '아가',
  [Bible.Wisdom]: '지혜',
  [Bible.Sirach]: '집회',
  [Bible.Isaiah]: '이사',
  [Bible.Jeremiah]: '예레',
  [Bible.Lamentations]: '애가',
  [Bible.Baruch]: '바룩',
  [Bible.Ezekiel]: '에제',
  [Bible.Daniel]: '다니',
  [Bible.Hosea]: '호세',
  [Bible.Joel]: '요엘',
  [Bible.Amos]: '아모',
  [Bible.Obadiah]: '오바',
  [Bible.Jonah]: '요나',
  [Bible.Micah]: '미카',
  [Bible.Nahum]: '나훔',
  [Bible.Habakkuk]: '하바',
  [Bible.Zephaniah]: '스바',
  [Bible.Haggai]: '하까',
  [Bible.Zechariah]: '즈카',
  [Bible.Malachi]: '말라',
  [Bible.Matthew]: '마태',
  [Bible.Mark]: '마르',
  [Bible.Luke]: '루카',
  [Bible.John]: '요한',
  [Bible.Acts]: '사도',
  [Bible.Romans]: '로마',
  [Bible.CorinthiansFirst]: '1코린',
  [Bible.CorinthiansSecond]: '2코린',
  [Bible.Galatians]: '갈라',
  [Bible.Ephesians]: '에페',
  [Bible.Philippians]: '필리',
  [Bible.Colossians]: '콜로',
  [Bible.ThessaloniansFirst]: '1데살',
  [Bible.ThessaloniansSecond]: '2데살',
  [Bible.TimothyFirst]: '1티모',
  [Bible.TimothySecond]: '2티모',
  [Bible.Titus]: '티토',
  [Bible.Philemon]: '필레',
  [Bible.Hebrews]: '히브',
  [Bible.James]: '야고',
  [Bible.PeterFirst]: '1베드',
  [Bible.PeterSecond]: '2베드',
  [Bible.JohnFirst]: '1요한',
  [Bible.JohnSecond]: '2요한',
  [Bible.JohnThird]: '3요한',
  [Bible.Jude]: '유다',
  [Bible.Revelation]: '묵시',
} as const;

export const BIBLE_OPTIONS = Object.keys(BIBLE_LABEL).map((key) => {
  return {
    value: key as Bible,
    label: BIBLE_LABEL[key as Bible],
  };
});

export const NEW_TESTAMENTS = [
  Bible.Matthew,
  Bible.Mark,
  Bible.Luke,
  Bible.John,
  Bible.Acts,
  Bible.Romans,
  Bible.CorinthiansFirst,
  Bible.CorinthiansSecond,
  Bible.Galatians,
  Bible.Ephesians,
  Bible.Philippians,
  Bible.Colossians,
  Bible.ThessaloniansFirst,
  Bible.ThessaloniansSecond,
  Bible.TimothyFirst,
  Bible.TimothySecond,
  Bible.Titus,
  Bible.Philemon,
  Bible.Hebrews,
  Bible.James,
  Bible.PeterFirst,
  Bible.PeterSecond,
  Bible.JohnFirst,
  Bible.JohnSecond,
  Bible.JohnThird,
  Bible.Jude,
  Bible.Revelation,
] as const;
