import CryptoJS from 'crypto-js';

const AES_KEY = import.meta.env.VITE_PASSWORD_ENCRYPTION_KEY;

// Encrypt plain password -> return base64-like string
export function encryptPassword(password) {
  if (!AES_KEY) {
    throw new Error('Encryption key not configured in VITE_PASSWORD_ENCRYPTION_KEY');
  }
  return CryptoJS.AES.encrypt(password, AES_KEY).toString();
}
