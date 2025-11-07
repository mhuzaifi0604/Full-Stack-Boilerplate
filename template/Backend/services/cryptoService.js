const CryptoJS = require('crypto-js');

const AES_KEY = process.env.PASSWORD_ENCRYPTION_KEY;

if (!AES_KEY) {
  console.warn('PASSWORD_ENCRYPTION_KEY not set in env. Decryption will fail.');
}

exports.decrypt = (encryptedString) => {
  if (!AES_KEY) throw new Error('Server encryption key is not configured');
  const bytes = CryptoJS.AES.decrypt(encryptedString, AES_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
