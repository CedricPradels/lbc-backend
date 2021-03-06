import { Document, Model } from "mongoose";

export const isEmail = (email: string): boolean =>
  /[a-z0-9]+([-+._][a-z0-9]+){0,2}@.*?(\.(a(?:[cde@gilmnoqrstuwxz]|ero|(?:rp|si)a)|b(?:[abdefghijmnorstvwyz]iz)|c(?:[acdfghiklmnoruvxyz]|at|o(?:m|op))|d[ejkmoz]|e(?:[ceghrstu]|du)|f[ijkmor]|g(?:[abdefghilmnpqrstuwy]|ov)|h[kmnrtu]|i(?:[delmnoqrst]|n(?:fo|t))|j(?:[emop]|obs)|k[eghimnprwyz]|l[abcikrstuvy]|m(?:[acdeghklmnopqrstuvwxyz]|il|obi|useum)|n(?:[acefgilopruz]|ame|et)|o(?:m|rg)|p(?:[aefghklmnrstwy]|ro)|qa|r[eosuw]|s[abcdeghijklmnortuvyz]|t(?:[cdfghjklmnoprtvwz]|(?:rav)?el)|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw])\b){1,2}/.test(
    email
  );

export const isFilled = (str: string) => str !== "";

export const isKeyValueFreeInCollection = (model: Model<Document, {}>) => (
  key: string
) => async (val: string) => {
  try {
    const result = await model.countDocuments({ [key]: val });
    return result === 0;
  } catch {}
};
