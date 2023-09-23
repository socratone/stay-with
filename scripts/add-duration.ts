/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { getFileNames } from '../utils/file';
import {
  getYoutubeVideoContentDetails,
  parseISO8601Duration,
} from '../utils/youtube';

dotenv.config({ path: './.env.production' });

const apiKey = process.env.YOUTUBE_DATA_API_KEY ?? '';

/** youtube video music data에 duration을 추가해주는 script */
(async () => {
  const fileNames = getFileNames('content/musics');

  fileNames.forEach(async (fileName) => {
    const fullPath = path.join(process.cwd(), `content/musics/${fileName}`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const items = JSON.parse(fileContents);
    const itemsWithDuration = await Promise.all(
      items.map(async (item: any) => {
        if (!item.videoId) throw new Error('videoId is required.');
        if (!item.title) throw new Error('title is required.');
        if (item.duration) return item;
        const videos = await getYoutubeVideoContentDetails({
          videoId: item.videoId,
          apiKey,
        });
        const duration = parseISO8601Duration(
          videos.items[0]?.contentDetails.duration
        );
        return {
          ...item,
          duration,
        };
      })
    );

    fs.writeFileSync(fullPath, JSON.stringify(itemsWithDuration, null, 2));
  });

  console.log('😆 작업이 완료되었습니다.');
})();
