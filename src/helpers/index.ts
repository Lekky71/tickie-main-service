export * from './CustomError';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const strContains = (str: string, find: string) => str.indexOf(find) !== -1;
export const equalsIgnoreCase = (str1: string, str2: string) => str1.toUpperCase() === str2.toUpperCase();
