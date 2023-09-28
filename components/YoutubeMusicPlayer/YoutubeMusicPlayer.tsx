import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';

import ArrowIcon from './ArrowIcon';
import { PlaybackState, YOUTUBE_OPTS } from './constants';
import NextIcon from './NextIcon';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import PlayList from './PlayList';
import PreviousIcon from './PreviousIcon';
import RepeatIcon from './RepeatIcon';
import ShuffleIcon from './ShuffleIcon';
import SmallPlayer from './SmallPlayer';
import TimeProgress from './TimeProgress';
import { PlayerSize, YoutubeVideo } from './types';

type YoutubeMusicPlayerProps = {
  video: YoutubeVideo | null;
  playList: YoutubeVideo[];
  onChange: (video: YoutubeVideo) => void;
  size?: PlayerSize;
  onSizeChange?: (size: PlayerSize) => void;
  height?: string;
};

const YoutubeMusicPlayer: React.FC<YoutubeMusicPlayerProps> = ({
  video,
  playList,
  onChange,
  size,
  onSizeChange,
  height,
}) => {
  const playerRef = useRef<YouTube>(null);

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playListOpen, setPlayListOpen] = useState(false);

  const isSquare = video?.thumbnailShape === 'square';

  const handleReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    event.target?.playVideo();
    // 아래 코드를 넣으면 ios mobile에서도 두 번째 재생시에 자동으로 재생된다.
    playerRef.current?.internalPlayer.playVideo();
  };

  const previous = () => {
    const index = playList.findIndex((item) => item.videoId === video?.videoId);

    if (index === 0) {
      onChange(playList[playList.length - 1]);
    } else {
      onChange(playList[index - 1]);
    }
  };

  const next = () => {
    const index = playList.findIndex((item) => item.videoId === video?.videoId);

    if (index === playList.length - 1) {
      isRepeat && onChange(playList[0]);
    } else {
      onChange(playList[index + 1]);
    }
  };

  const handleEnd = () => {
    next();
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

  const handleStateChange = (event: YouTubeEvent<number>) => {
    const playbackState = event.data;

    switch (playbackState) {
      case PlaybackState.Playing:
      case PlaybackState.Buffering:
        setIsPlaying(true);
        break;

      case PlaybackState.Unstarted:
      case PlaybackState.Paused:
      case PlaybackState.Ended:
      case PlaybackState.VideoCued:
        setIsPlaying(false);
        break;
    }
  };

  const handlePlayListClick = () => {
    setPlayListOpen((open) => !open);
  };

  return (
    <Box position="relative" height={height} overflow="auto">
      {size === 'small' ? (
        <SmallPlayer
          video={video}
          onSizeChange={onSizeChange}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      ) : null}
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
        <IconButton
          onClick={() => onSizeChange && onSizeChange('small')}
          disabled={!onSizeChange}
        >
          <ArrowIcon />
        </IconButton>
        <Typography color="text.primary" fontWeight={500} variant="body2">
          Now Playing
        </Typography>
        <IconButton
          onClick={handlePlayListClick}
          disabled={playList.length === 0}
        >
          <QueueMusicIcon />
        </IconButton>
      </Stack>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={isSquare ? '16%' : '3%'}
        mb={4}
        sx={{
          aspectRatio: '350 / 238',
        }}
      >
        <Box
          borderRadius={6}
          overflow="hidden"
          width="100%"
          sx={{
            aspectRatio: isSquare ? '1 / 1' : '1920 / 1080',
            iframe: {
              width: '100%',
              height: '100%',
              aspectRatio: isSquare ? '1 / 1' : '1920 / 1080',
            },
          }}
        >
          {video ? (
            <YouTube
              ref={playerRef}
              key={video.videoId}
              videoId={video?.videoId}
              opts={YOUTUBE_OPTS}
              onReady={handleReady}
              onEnd={handleEnd}
              onStateChange={handleStateChange}
            />
          ) : null}
        </Box>
      </Box>

      {playListOpen ? (
        <PlayList
          items={playList}
          video={video}
          onChange={onChange}
          player={player}
        />
      ) : (
        <>
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
              {video?.title}
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
            {video?.artist}
          </Typography>

          <TimeProgress player={player} duration={video?.duration ?? 0} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            px="6%"
            mx={-1}
            pb={2} // bottom padding
          >
            {/* TODO: shuffle */}
            <IconButton disabled>
              <ShuffleIcon />
            </IconButton>
            <IconButton
              onClick={previous}
              disabled={
                playList.findIndex(
                  (item) => item.videoId === video?.videoId
                ) === 0
              }
            >
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
            <IconButton
              onClick={next}
              disabled={
                playList.findIndex(
                  (item) => item.videoId === video?.videoId
                ) ===
                playList.length - 1
              }
            >
              <NextIcon />
            </IconButton>
            <IconButton
              onClick={() => setIsRepeat((isRepeat) => !isRepeat)}
              sx={{
                color: (theme) =>
                  isRepeat ? undefined : theme.palette.action.disabled,
              }}
            >
              <RepeatIcon />
            </IconButton>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default YoutubeMusicPlayer;
