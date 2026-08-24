const ACCESS_TOKEN_KEY = "access_token";

export const tokenStorage = {
  setToken: (accessToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};