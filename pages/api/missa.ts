import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'node-html-parser';

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
  const mode = req.query.mode;

  const newRoot = parse(`
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard.css"
        />
        <style>
          body {
            margin: 16px;
            font-family: Pretendard, -apple-system, BlinkMacSystemFont;
            background-color: ${mode === 'dark' ? '#000' : '#fff'};
          }

          h3:first-child {
            margin-top: 0;
          }
          
          h3,
          div {
            line-height: 1.5;
          }
          
          h3 {
            color: ${mode === 'dark' ? '#e0e0e0' : '#212121'};
            font-size: 18px;
          }
          
          div {
            color: ${mode === 'dark' ? '#bdbdbd' : '#757575'};
            font-size: 16px;
          }

          div.bumper {
            height: 100px;
          }
        </style>
      </head>
      <body>
      </body>
    </html>
  `);

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

    const body = newRoot.querySelector('body');

    // filter
    for (let i = 0; i < titles.length - 1; i++) {
      const titleText = titles[i].childNodes?.[0].innerText;
      if (
        titleText === '제1독서' ||
        titleText === '제2독서' ||
        titleText === '복음'
      ) {
        body?.appendChild(titles[i]);
        body?.appendChild(contents[i]);
      }
    }

    const bumper = parse('<div class="bumper"></div>');
    body?.appendChild(bumper);

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.status(200).send(newRoot.toString());
  } catch (error) {
    const body = newRoot.querySelector('body');
    body?.appendChild(parse('<div>에러가 발생했습니다.</div>'));
    return res.status(500).send(newRoot.toString());
  }
};

export default handler;
