import queryString from 'query-string';

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

export const addQuery = (url: string, query: string) => {
  const [path, rawQueryString] = url.split('?');
  const parsedQuery = queryString.parse(rawQueryString);
  const addedQuery = { ...parsedQuery, ...queryString.parse(query) };
  const stiringifiedQuery = queryString.stringify(addedQuery);
  return `${path}?${stiringifiedQuery}`;
};
