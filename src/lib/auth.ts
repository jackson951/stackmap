export const getToken = (): string | null => {
  return localStorage.getItem('stackmap_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('stackmap_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('stackmap_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getLoginUrl = (): string => {
  return `${process.env.NEXT_PUBLIC_API_URL}/api/auth/github`;
};

export const getDashboardUrl = (token: string): string => {
  return `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?token=${token}`;
};