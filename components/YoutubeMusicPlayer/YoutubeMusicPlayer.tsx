import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

import ArrowIcon from './ArrowIcon';
import { PlaybackState, YOUTUBE_OPTS } from './constants';
import NextIcon from './NextIcon';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import PreviousIcon from './PreviousIcon';
import RepeatIcon from './RepeatIcon';
import ShuffleIcon from './ShuffleIcon';
import TimeProgress from './TimeProgress';
import { MusicItem } from './types';

type YoutubeMusicPlayerProps = {
  selectedItem: MusicItem | null;
  onClose: () => void;
};

const YoutubeMusicPlayer: React.FC<YoutubeMusicPlayerProps> = ({
  selectedItem,
  onClose,
}) => {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isSquare = selectedItem?.thumbnailShape === 'square';

  useEffect(() => {
    if (player && selectedItem?.videoId) {
      player.playVideo();
    }
  }, [player, selectedItem?.videoId]);

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
  };

  const handleEnd = () => {
    // TODO: play list 기능
    // const currentIndex = videoIds.findIndex((id) => id === videoId);
    // if (currentIndex < 0) return;
    // // 마지막 곡인 경우
    // if (currentIndex === videoIds.length - 1) {
    //   setVideoId(videoIds[0]);
    // } else {
    //   setVideoId(videoIds[currentIndex + 1]);
    // }
  };

  const handlePlay = () => {
    if (player) {
      player.playVideo();
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const handleClose = () => {
    setPlayer(null);
    onClose();
  };

  const handleStateChange = (event: YouTubeEvent<number>) => {
    const playbackState = event.data;

    switch (playbackState) {
      case PlaybackState.Playing:
      case PlaybackState.Buffering:
        setIsPlaying(true);
        break;

      case PlaybackState.Unstarted:
      case PlaybackState.Ended:
      case PlaybackState.Paused:
      case PlaybackState.VideoCued:
        setIsPlaying(false);
        break;
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
        pt={1}
        pb={0.5}
        px="6%"
        mx={-1}
      >
        <IconButton onClick={handleClose}>
          <ArrowIcon />
        </IconButton>
        <Typography color="text.primary" fontWeight={500} variant="body2">
          Now Playing
        </Typography>
        <IconButton disabled>
          <QueueMusicIcon />
        </IconButton>
      </Stack>
      <Box px={isSquare ? '16%' : '3%'} mb={4}>
        <Box
          borderRadius={6}
          overflow="hidden"
          sx={{
            aspectRatio: isSquare ? '1 / 1' : '1920 / 1080',
            iframe: {
              width: '100%',
              height: '100%',
              aspectRatio: isSquare ? '1 / 1' : '1920 / 1080',
            },
          }}
        >
          {selectedItem ? (
            <YouTube
              key={selectedItem.videoId}
              videoId={selectedItem?.videoId}
              opts={YOUTUBE_OPTS}
              onReady={handleReady}
              onEnd={handleEnd}
              onStateChange={handleStateChange}
            />
          ) : null}
        </Box>
      </Box>
      <Stack
        justifyContent="space-between"
        alignItems="center"
        direction="row"
        px="6%"
        mx={-1}
      >
        <IconButton disabled>
          <FavoriteBorderIcon />
        </IconButton>
        <Typography
          color="text.primary"
          variant="h5"
          fontWeight={700}
          textOverflow="ellipsis"
          overflow="hidden"
          noWrap
        >
          {selectedItem?.title}
        </Typography>
        <IconButton disabled>
          <MoreHorizIcon />
        </IconButton>
      </Stack>

      <Typography
        color="text.secondary"
        textAlign="center"
        textOverflow="ellipsis"
        overflow="hidden"
        noWrap
        px="6%"
        mb={2}
      >
        {selectedItem?.artist}
      </Typography>

      <TimeProgress player={player} duration={selectedItem?.duration ?? 0} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        px="6%"
        mx={-1}
        pb={2} // bottom padding
      >
        <IconButton disabled>
          <ShuffleIcon />
        </IconButton>
        <IconButton disabled>
          <PreviousIcon />
        </IconButton>
        {isPlaying ? (
          <IconButton
            onClick={handlePause}
            sx={{
              color: (theme) => theme.palette.common.white,
              width: 76,
              height: 76,
              bgcolor: (theme) => theme.palette.primary.main,
            }}
          >
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={handlePlay}
            sx={{
              color: (theme) => theme.palette.common.white,
              width: 76,
              height: 76,
              bgcolor: (theme) => theme.palette.primary.main,
            }}
          >
            <PlayIcon />
          </IconButton>
        )}

        <IconButton disabled>
          <NextIcon />
        </IconButton>
        <IconButton disabled>
          <RepeatIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default YoutubeMusicPlayer;
