export const saveToLS = (key: string, value: any) => {
  localStorage.setItem(key, value);
};

export const getFromLS = (key: string) => {
  return localStorage.getItem(key);
};
