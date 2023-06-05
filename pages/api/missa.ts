import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';
import { sendServerError, ServerError } from 'utils/error';

export type MissaData = {
  bibles: { title: string; bibleInfo: string | null; contents: string[] }[];
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<MissaData | ServerError>
) => {
  try {
    const response = await fetch('https://m.mariasarang.net/page/missa.asp', {
      headers: {
        'Content-Type': 'text/plain; charset=euc-kr',
      },
    });

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('euc-kr');
    const htmlText = decoder.decode(buffer);

    const root = parse(htmlText);
    const titles = root.querySelectorAll('.bd_tit');
    const contents = root.querySelectorAll('.board_layout');

    // Raw text
    const bibles: { title: string; content: string }[] = [];

    // 독서와 복음만
    for (let i = 0; i < titles.length - 1; i++) {
      const titleText = titles[i].childNodes?.[0].innerText;
      if (
        titleText === '제1독서' ||
        titleText === '제2독서' ||
        titleText === '복음'
      ) {
        bibles.push({
          title: titles[i].textContent,
          content: contents[i].textContent,
        });
      }
    }

    const parsedBibles = bibles.map((rawText) => {
      // 문장으로 구분해서 배열로 return
      const regex = /[0-9가-힣“”,.!?<>].*[0-9가-힣“”.,!?<>]/gm;
      const contents = rawText.content.match(regex);

      // 머리말 삭제
      // Ex. '<소작인들은 주인의 사랑하는 아들을 붙잡아 죽이고는 포도밭 밖으로 던져 버렸다.>'
      const contentsWithoutHead =
        contents?.filter((content) => {
          if (content[0] === '<' && content[content.length - 1] === '>') {
            return false;
          }
          return true;
        }) ?? [];

      // 꼬리말 삭제
      const tailIndex = contentsWithoutHead.findLastIndex((content) => {
        return content.includes('주님의 말씀입니다.');
      });
      const contentsWitoutTail = contentsWithoutHead.slice(0, tailIndex);

      // 성서 정보 문장 추출
      // Ex. '토빗기의 시작입니다.1,3; 2,1ㄴ-8'
      const bibleInfo = contentsWitoutTail.find((content) => {
        const regex = /[0-9]+,[0-9]+[ㄱㄴㄷ-]+[,0-9]+/;
        return regex.test(content);
      });
      const contentsWitouhtBibleInfo = contentsWitoutTail.filter(
        (content) => content !== bibleInfo
      );

      return {
        title: rawText.title,
        bibleInfo: bibleInfo ?? null,
        contents: contentsWitouhtBibleInfo,
      };
    });

    return res.status(200).send({ bibles: parsedBibles });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export default handler;
