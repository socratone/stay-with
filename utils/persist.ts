export const saveValue = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getValue = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const setJsonValue = (key: string, value: object) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getJsonValue = <T>(key: string) => {
  if (typeof window !== 'undefined') {
    const stringifiedValue = localStorage.getItem(key);
    if (stringifiedValue === null) return null;
    try {
      return JSON.parse(stringifiedValue) as Partial<T>;
    } catch {
      return null;
    }
  }
  return null;
};

export const removeValue = (key: string) => {
  localStorage.removeItem(key);
};
