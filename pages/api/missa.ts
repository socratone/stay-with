import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';
import { sendServerError, ServerError } from 'utils/error';

export type MissaData = {
  today: string;
  words: {
    title: string;
    content: string;
  }[];
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<MissaData | ServerError>
) => {
  try {
    const offset =
      typeof req.query?.offset === 'string' ? Number(req.query.offset) : null;

    const response = await fetch(
      offset
        ? `https://m.mariasarang.net/page/missa.asp?go=${offset}`
        : 'https://m.mariasarang.net/page/missa.asp',
      {
        headers: {
          'Content-Type': 'text/plain; charset=euc-kr',
        },
      }
    );

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('euc-kr');
    const htmlText = decoder.decode(buffer);

    const root = parse(htmlText);
    const titles = root.querySelectorAll('.bd_tit');
    const contents = root.querySelectorAll('.board_layout');

    const matchedToday = htmlText.match(
      /[0-9]+[년\s]+[0-9]+[월\s]+[0-9]+[일\s]+[월화수목금토일주요]+/
    );

    // Raw text
    const words: { title: string; content: string }[] = [];

    // 독서와 복음만
    for (let i = 0; i < titles.length - 1; i++) {
      const titleText = titles[i].childNodes?.[0].innerText;
      if (
        titleText === '제1독서' ||
        titleText === '제2독서' ||
        titleText === '복음'
      ) {
        words.push({
          title: titles[i].textContent,
          content: contents[i].textContent,
        });
      }
    }

    return res.status(200).send({
      today: matchedToday ? matchedToday[0] : '',
      words,
    });
  } catch (error) {
    return sendServerError(res, error);
  }
};

export default handler;
