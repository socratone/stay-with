/* eslint-disable no-console */
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { getFileNames } from '../utils/file';
import { getYoutubeVideos } from '../utils/youtube';

dotenv.config({ path: './.env.production' });

const apiKey = process.env.YOUTUBE_DATA_API_KEY ?? '';

/** thumbnailUrl을 추가해주는 script */
(async () => {
  const fileNames = getFileNames('content/musics');

  fileNames.forEach(async (fileName) => {
    const fullPath = path.join(process.cwd(), `content/musics/${fileName}`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const items = JSON.parse(fileContents);
    const itemsWithThumbnail = await Promise.all(
      items.map(async (item: any) => {
        if (!item.videoId) throw new Error('videoId is required.');
        if (!item.title) throw new Error('title is required.');
        if (item.thumbnailUrl) return item;
        const videos = await getYoutubeVideos({
          videoId: item.videoId,
          apiKey,
        });
        const thumbnailUrl = videos.items[0]?.snippet.thumbnails.maxres.url;
        return {
          ...item,
          thumbnailUrl,
        };
      })
    );

    fs.writeFileSync(fullPath, JSON.stringify(itemsWithThumbnail, null, 2));
  });

  console.log('😆 작업이 완료되었습니다.');
})();
