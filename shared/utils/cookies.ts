import Cookies from 'js-cookie';

export const setTokenCookie = (token: string) => {
  Cookies.set('access_token', token, { 
    expires: 1,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getTokenFromCookie = () => {
  return Cookies.get('access_token') || null;
};

export const removeTokenCookie = () => {
  Cookies.remove('access_token', { path: '/' });
};