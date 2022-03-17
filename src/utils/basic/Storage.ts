export default {
  set: (key: string, value: any) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get: (key: string) => {
    return JSON.parse(sessionStorage.getItem(key));
  },
  remove: (key: string) => {
    sessionStorage.removeItem(key);
  },
  clear: () => {
    sessionStorage.clear();
  },
}
