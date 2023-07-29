export const findIndexByRegex = (text: string, regex: RegExp) => {
  const matches = text.match(regex);

  if (matches) {
    return text.indexOf(matches[0]);
  }

  return -1;
};
