export const parseSecondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const secondsString = String(remainingSeconds).padStart(2, '0');
  return `${minutes}:${secondsString}`;
};
