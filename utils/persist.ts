export const saveValue = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getValue = <T>(key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) as T | null;
  }
  return null;
};

export const removeValue = (key: string) => {
  localStorage.removeItem(key);
};
