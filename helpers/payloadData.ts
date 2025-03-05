import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js';

export const RSA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6nm0LIIj6xjxct7f1Pgi
1cVMKtQV+tgCyiNlEnHkmR9IpZcRmj01qs5kQ1JGJj+HU/VfQSligPQEXMdUwija
XHgLoFAU6gMoMNjgLJSNuxI0sEhEAlYPs+lb1l2DI5o5QVRQ7cLn3f5jVWqYdJaN
9I8tB4eADm+BFt7WEjVZ3Yl2ZIlH05C2693HQ5e/o6NeHqUujdrKuYjJSTv4/whl
29LeE77WVNi/eBQsqpSetWffzSrUPwCHSgcxwUjTxnnxr6tWVgKftoapAe3v8QCk
gT52zgBDJsKNTiY5r3nzGYHzzFFyD0y5hclHwcQ3XzJJL9hK0LVQQCXpMHC24tcW
gQIDAQAB
-----END PUBLIC KEY-----
`;

export const encryptData = (data: any) => {
  const jsonString = JSON.stringify(data);
  const aesKey = CryptoJS.lib.WordArray.random(32);
  const iv = CryptoJS.lib.WordArray.random(16);
  
  const encrypted = CryptoJS.AES.encrypt(jsonString, aesKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  const aesKeyString = aesKey.toString(CryptoJS.enc.Hex);
  
  const rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(RSA_PUBLIC_KEY);
  const encryptedKey = rsaEncrypt.encrypt(aesKeyString);
  
  if (!encryptedKey) {
    throw new Error('RSA encryption failed. Check the public key or data size.');
  }
  
  return {
    encryptedData: encrypted.toString(),    
    encryptedKey: encryptedKey,             
    iv: iv.toString(CryptoJS.enc.Base64)    
  };
};