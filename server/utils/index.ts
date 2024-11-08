import CryptoJS from "crypto-js";

// export const createCryptoHelper = (password: string) => {
//   if (!password) {
//     throw createError({
//       statusCode: 500,
//       message: "createCryptoHelper undefined password",
//     });
//   }
//   return {
//     decrypt: (value: string) => {
//       return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
//     },
//     encrypt: (value: string) => {
//       return CryptoJS.AES.encrypt(value, password).toString();
//     },
//   };
// };

// export const getDbCryptoHelper = () => {
//   const password = process.env.DATABASE_CRYPTO_PASSWORD;
//   if (!password) {
//     throw createError({
//       statusCode: 500,
//       message: "undefined DATABASE_CRYPTO_PASSWORD",
//     });
//   }
//   return createCryptoHelper(password);
// };
