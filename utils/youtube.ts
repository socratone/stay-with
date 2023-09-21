import axios from 'axios';

type GetYoutubeVideosParams = {
  videoId: string;
  apiKey: string;
};

type GetYoutubeVideosData = {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: {
          url: string;
          width: number;
          height: number;
        };
        medium: {
          url: string;
          width: number;
          height: number;
        };
        high: {
          url: string;
          width: number;
          height: number;
        };
        standard: {
          url: string;
          width: number;
          height: number;
        };
        maxres: {
          url: string;
          width: number;
          height: number;
        };
      };
      channelTitle: string;
      categoryId: string;
      liveBroadcastContent: string;
      localized: {
        title: string;
        description: string;
      };
      defaultAudioLanguage: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export const getYoutubeVideos = ({
  videoId,
  apiKey,
}: GetYoutubeVideosParams) => {
  return axios
    .get<GetYoutubeVideosData>(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`,
      {
        params: {
          part: 'snippet',
          id: videoId,
          apiKey,
        },
      }
    )
    .then((value) => value.data);
};
