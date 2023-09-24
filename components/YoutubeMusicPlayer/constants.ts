export enum PlaybackState {
  /**
   * The video has not started playing yet.
   * This state typically occurs before the video begins playing,
   * or if it's been paused and hasn't been resumed yet.
   */
  Unstarted = -1,
  /**
   * The video has ended, either because it reached the end of the content
   * or because it was stopped programmatically.
   */
  Ended = 0,
  /**
   * The video is currently playing.
   * This state is triggered when the video starts playing,
   * either due to user interaction or programmatically.
   */
  Playing = 1,
  /**
   * The video has been paused, either by user interaction or programmatically.
   * This state means the video is currently not playing but can be resumed.
   */
  Paused = 2,
  /**
   * The video is buffering, which means it's loading the content before it can play smoothly.
   * This state can occur during playback when the video encounters buffering issues.
   */
  Buffering = 3,
  /**
   * The video is cued but not yet started.
   * This state is similar to "Unstarted,"
   * but it indicates that the video has been loaded and is ready to play, but it hasn't started yet.
   */
  VideoCued = 4,
}

export const YOUTUBE_OPTS = {
  height: 1080,
  width: 1920,
  playerVars: {
    /** Set to 0 to hide the controls */
    controls: 0,
  },
};
