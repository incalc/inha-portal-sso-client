import { COOKIE_VALUE_REGEX } from './constants';
import { CookieSentHeader, CookieReceivedHeader } from './types';

export function getValueFromCookie(cookie: string): string {
  const [, cookieValue] = COOKIE_VALUE_REGEX.exec(cookie) as RegExpExecArray;
  return cookieValue;
}

/**
 * 주어진 세션 아이디로 세션 헤더를 생성합니다.
 * @ignore
 * @param sessionId 세션 아이디
 * @returns 세션 헤더
 */
export function createSessionHeader(sessionId: string): CookieSentHeader {
  return { cookie: `JSESSIONID=${sessionId}` };
}

export function findCookie(cookies: string[], cookieName: string): string | undefined {
  return cookies.find((cookie) => cookie.includes(cookieName));
}

/**
 * 요청 헤더에서 쿠키 값을 찾아 반환합니다.
 * @ignore
 * @param header 요청 헤더
 * @param cookieName 쿠키 이름
 * @returns 쿠키 값
 */
export function findCookieValueFromHeader<Header extends CookieReceivedHeader>(
  headers: Header, cookieName: string,
): string | undefined {
  const cookie = findCookie(headers['set-cookie'], cookieName);
  return cookie && getValueFromCookie(cookie);
}
