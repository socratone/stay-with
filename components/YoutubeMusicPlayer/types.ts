export type YoutubeVideo = {
  title: string;
  artist: string;
  videoId: string;
  thumbnailUrl: string;
  thumbnailShape?: 'square';
  duration: number;
};

export type PlayerSize = 'full' | 'small';
