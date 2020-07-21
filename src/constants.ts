/** SSO 서버 로그인 주소 */
export const SSO_URL = 'https://portal.inha.ac.kr/inha/SsoTokenService.do';
/** 학생 정보 서버 주소 */
export const INFO_URL = 'https://portal.inha.ac.kr/portalctnt/studPage!00015';

/** 쿠키 값 추출 정규식 */
export const COOKIE_VALUE_REGEX = /^[^=]+=([^;]*);/;
/** 학생 이름 추출 정규식 */
export const HTML_NAME_REGEX = /<font class=\\"name\\">(.+?)<\/font>/;
/** 학생 단과대/학부/학년 추출 정규식 */
export const HTML_MAJOR_LIST_REGEX = /<p class=\\"major-list\\">(.+?)<\/p>/g;
/** 비밀번호 오류 횟수 추출 정규식 */
export const PASSWORD_ERROR_REGEX = /비밀번호 (\d+)회 오류입니다/;
