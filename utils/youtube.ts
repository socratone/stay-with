import axios from 'axios';

type GetYoutubeVideosParams = {
  videoId: string;
  apiKey: string;
};

type YoutubeVideosSnippetData = {
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

export const getYoutubeVideosSnippet = ({
  videoId,
  apiKey,
}: GetYoutubeVideosParams) => {
  return axios
    .get<YoutubeVideosSnippetData>(
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

type YoutubeVideoContentDetailsData = {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    contentDetails: {
      duration: string;
      dimension: string;
      definition: string;
      caption: string;
      licensedContent: boolean;
      contentRating: any;
      projection: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export const parseISO8601Duration = (duration: string) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (match) {
    const hours = match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  }
};

export const getYoutubeVideoContentDetails = async ({
  videoId,
  apiKey,
}: GetYoutubeVideosParams) => {
  return axios
    .get<YoutubeVideoContentDetailsData>(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`
    )
    .then((value) => value.data);
};
