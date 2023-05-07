export const getUrlPath = (url: string) => {
  const [path] = url.split('?');
  return path;
};
