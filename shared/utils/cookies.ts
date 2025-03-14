import Cookies from 'js-cookie';

export const setTokenCookie = (token: string) => {
  Cookies.set('hyna_token', token, { 
    expires: 10 / (24 * 60),
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }); 
};

export const getTokenFromCookie = () => {
  return Cookies.get('hyna_token') || null;
};

export const removeTokenCookie = () => {
  Cookies.remove('hyna_token', { path: '/' });
};