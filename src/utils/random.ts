export function random6Digits(): string {
    const  token = Math.ceil(10000 + Math.random() * 999999);
    const tokenStr = `${token}`;
    return tokenStr.length < 6 ? `0${tokenStr}` : tokenStr;
};