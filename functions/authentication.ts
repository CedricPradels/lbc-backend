import randomstring from "randomstring";
import { SHA256 } from "crypto-js";
import encBase64 from "crypto-js/enc-base64";

interface authenticationDatas {
  hash: string;
  salt: string;
  token: string;
}

export const createAuthenticationDatas = (
  password: string
): authenticationDatas => {
  const salt: string = createSalt();
  return {
    salt,
    hash: createHash(salt)(password),
    token: randomstring.generate(64)
  };
};
export const createSalt = () => randomstring.generate(64);
export const createHash = (salt: string) => (password: string) =>
  SHA256(salt + password).toString(encBase64);

export const checkPassword = (salt: string) => (hash: string) => (
  password: string
) => {
  console.log("Password ", createHash(salt)(password));
  console.log("USer ", hash);
  return createHash(salt)(password) === hash;
};
