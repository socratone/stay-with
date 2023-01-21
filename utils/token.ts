export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken);
};

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};
