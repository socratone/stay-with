import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { useAppSelector } from 'redux/hooks';

const WIDTH = 200;
const HEIGHT = 113;

const VideoPlayer = () => {
  const open = useAppSelector((state) => state.video.open);

  const [touched, setTouched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const videoId = 'f742p7mQ0Ic'; // Replace with your YouTube video ID

  const opts = {
    height: HEIGHT,
    width: WIDTH,
  };

  useEffect(() => {
    if (open) {
      setTouched(true);
    }
  }, [open]);

  const handleReady = () => {
    setLoaded(true);
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
        <YouTube videoId={videoId} opts={opts} onReady={handleReady} />
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
