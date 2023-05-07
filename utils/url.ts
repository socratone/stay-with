import queryString from 'query-string';

export const getUrlPath = (url: string) => {
  const [path] = url.split('?');
  return path;
};

export const removeQuery = (url: string, query: string) => {
  const [path, rawQueryString] = url.split('?');
  const parsedQuery = queryString.parse(rawQueryString);
  delete parsedQuery[query];
  const stiringifiedQuery = queryString.stringify(parsedQuery);

  if (stiringifiedQuery) {
    return `${path}?${stiringifiedQuery}`;
  }

  return path;
};
