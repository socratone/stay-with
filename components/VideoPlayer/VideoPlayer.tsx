import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import getYouTubeID from 'get-youtube-id';
import useResizeListener from 'hooks/dom/useResizeListener';
import useRemToPxNumber from 'hooks/theme/useRemToPxNumer';
import React, { useCallback, useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useMount } from 'react-use';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { toggleVideoOpen } from 'redux/videoSlice';
import { getJsonValue } from 'utils/persist';

const WIDTH = 200;
const HEIGHT = 113;
const MARGIN = 8;

const opts = {
  height: HEIGHT,
  width: WIDTH,
};

const VideoPlayer = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.video.open);
  const globalHeaderHeight = useRemToPxNumber(GLOBAL_HEADER_HEIGHT);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const [played, setPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState('f742p7mQ0Ic'); // default videoId
  const [videoIds, setVideoIds] = useState<string[]>([]);

  const moveToTopLeft = () => {
    setPosition({ x: MARGIN, y: globalHeaderHeight + MARGIN });
  };

  const moveToTopRight = useCallback(() => {
    setPosition({
      x: window.innerWidth - WIDTH - MARGIN,
      y: globalHeaderHeight + MARGIN,
    });
  }, [globalHeaderHeight]);

  const moveToBottomLeft = () => {
    setPosition({ x: MARGIN, y: window.innerHeight - HEIGHT - MARGIN });
  };

  const moveToBottomRight = () => {
    setPosition({
      x: window.innerWidth - WIDTH - MARGIN,
      y: window.innerHeight - HEIGHT - MARGIN,
    });
  };

  useResizeListener({
    onResize: moveToTopRight,
  });

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

  // 초기값
  useEffect(() => {
    moveToTopRight();
  }, [globalHeaderHeight, moveToTopRight]);

  useEffect(() => {
    if (open) {
      setPlayed(true);
    }
  }, [open]);

  const handlePlayReady = (event: YouTubeEvent) => {
    setIsLoading(false);
    event.target?.playVideo();
  };

  const handlePlayEnd = () => {
    const currentIndex = videoIds.findIndex((id) => id === videoId);
    if (currentIndex < 0) return;
    // 마지막 곡인 경우
    if (currentIndex === videoIds.length - 1) {
      setVideoId(videoIds[0]);
    } else {
      setVideoId(videoIds[currentIndex + 1]);
    }
  };

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    const { x, y } = data;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const widthOffset = WIDTH / 2;
    const heightOffset = HEIGHT / 2;

    if (x + widthOffset < viewportWidth / 2) {
      if (y + heightOffset < viewportHeight / 2) {
        moveToTopLeft();
      } else {
        moveToBottomLeft();
      }
    } else {
      if (y + heightOffset < viewportHeight / 2) {
        moveToTopRight();
      } else {
        moveToBottomRight();
      }
    }
  };

  const handleClose = () => {
    dispatch(toggleVideoOpen());
  };

  return (
    <Draggable
      handle=".handle"
      position={position}
      scale={1}
      onStop={handleDragStop}
    >
      <Box
        position="fixed"
        zIndex={(theme) => theme.zIndex.modal}
        sx={{
          visibility: open ? 'visible' : 'hidden',
        }}
      >
        <Box
          width={WIDTH}
          height={HEIGHT}
          borderRadius={3}
          overflow="hidden"
          position="relative"
          bgcolor={(theme) => theme.palette.background.paper}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            position="absolute"
            top={0}
            left={0}
          >
            <IconButton size="large" className="handle" sx={{ color: '#fff' }}>
              <DragIndicatorIcon />
            </IconButton>
            <IconButton
              size="large"
              onClick={handleClose}
              sx={{ color: '#fff' }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          {played ? (
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={handlePlayReady}
              onEnd={handlePlayEnd}
            />
          ) : null}
          {isLoading ? (
            <Skeleton variant="rectangular" width={WIDTH} height={HEIGHT} />
          ) : null}
        </Box>
      </Box>
    </Draggable>
  );
};

export default VideoPlayer;
