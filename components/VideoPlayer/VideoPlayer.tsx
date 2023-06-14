import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import getYouTubeID from 'get-youtube-id';
import React, { useEffect, useState } from 'react';
import { useMount } from 'react-use';
import YouTube from 'react-youtube';
import { useAppSelector } from 'redux/hooks';
import { getJsonValue } from 'utils/persist';

const WIDTH = 200;
const HEIGHT = 113;

const opts = {
  height: HEIGHT,
  width: WIDTH,
  playerVars: {
    autoplay: 1,
  },
};

const VideoPlayer = () => {
  const open = useAppSelector((state) => state.video.open);

  const [touched, setTouched] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [videoId, setVideoId] = useState('f742p7mQ0Ic'); // default videoId
  const [videoIds, setVideoIds] = useState<string[]>([]);

  // 저장된 videoId를 불러온다.
  useMount(() => {
    const videoUrls = getJsonValue('videoUrls') as string[] | null;
    if (!videoUrls || !Array.isArray(videoUrls)) return;
    const videoIds = videoUrls
      .filter((url) => getYouTubeID(url))
      .map((url) => getYouTubeID(url)) as string[];
    setVideoIds(videoIds);
    const videoId = videoIds[0];
    if (!videoId) return;
    setVideoId(videoId);
  });

  useEffect(() => {
    if (open) {
      setTouched(true);
    }
  }, [open]);

  const handleReady = () => {
    setLoaded(true);
  };

  const handleEnd = () => {
    const currentIndex = videoIds.findIndex((id) => id === videoId);
    if (currentIndex < 0) return;
    // 마지막 곡인 경우
    if (currentIndex === videoIds.length - 1) {
      setVideoId(videoIds[0]);
    } else {
      setVideoId(videoIds[currentIndex + 1]);
    }
  };

  return (
    <Box
      position="fixed"
      top={(theme) => `calc(${GLOBAL_HEADER_HEIGHT} + ${theme.spacing(1)})`}
      right={(theme) => theme.spacing(1)}
      sx={{
        width: WIDTH,
        height: HEIGHT,
        visibility: open ? 'visible' : 'hidden',
        borderRadius: 3,
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {touched ? (
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
          onEnd={handleEnd}
        />
      ) : null}
      {!loaded ? (
        <Skeleton
          variant="rectangular"
          width={WIDTH}
          height={HEIGHT}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      ) : null}
    </Box>
  );
};

export default VideoPlayer;
