import axios from 'axios';
import {
  SSO_URL, INFO_URL,
  HTML_NAME_REGEX, HTML_MAJOR_LIST_REGEX, PASSWORD_ERROR_REGEX,
} from './constants';
import InhaAuthError from './InhaAuthError';
import { CookieReceivedHeader, RedirectHeader, StudentInfo } from './types';
import { createSessionHeader, findCookieValueFromHeader } from './utils';

Object.assign(axios.defaults, {
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  validateStatus(status: number) {
    return status < 500;
  },
  maxRedirects: 0,
});

/** 인하대 포털 로그인 클래스 */
export default class InhaAuth {
  /** 학번 */
  private readonly sid: string;

  /** 통합인증 서비스 로그인 세션 아이디 */
  private readonly serviceSessionId: string;

  /** 포털 메인 로그인 세션 아이디 */
  private readonly loginSessionId: string;

  /** 한웨이(한진그룹 사내 그룹웨어 시스템) 쿠키 */
  private readonly hanwayCookie: string;

  /**
   * 주어진 학번과 비밀번호로 로그인하고 클라이언트를 반환합니다.
   * @async
   * @param sid 학번
   * @param password 비밀번호
   * @returns 로그인 클라이언트
   */
  static async init(sid: string, password: string): Promise<InhaAuth> {
    type CredentialRedirectHeader = CookieReceivedHeader & RedirectHeader;

    const loginForm = `user_id=${encodeURIComponent(sid)}&user_password=${encodeURIComponent(password)}`;

    const serviceResponse = await axios.post<string>(SSO_URL, loginForm);
    if (serviceResponse.status === 200) { // login fail
      if (PASSWORD_ERROR_REGEX.test(serviceResponse.data)) {
        const [, errorCount] = PASSWORD_ERROR_REGEX.exec(serviceResponse.data) as RegExpExecArray;
        throw new InhaAuthError(`SID or password is incorrect (error: ${errorCount})`);
      }
    }
    if (serviceResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const serviceResponseHeaders = serviceResponse.headers as CredentialRedirectHeader;
    const serviceSessionId = findCookieValueFromHeader(serviceResponseHeaders, 'JSESSIONID');
    if (!serviceSessionId) {
      throw new InhaAuthError('Service session ID is not found');
    }
    const serviceRedirectUrl = serviceResponseHeaders.location;

    const federateResponse = await axios.get<string>(serviceRedirectUrl);
    if (federateResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const federateResponseHeaders = federateResponse.headers as RedirectHeader;
    const federateRedirectUrl = federateResponseHeaders.location;

    const loginResponse = await axios.get<string>(federateRedirectUrl, {
      headers: createSessionHeader(serviceSessionId),
    });
    if (loginResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const loginResponseHeaders = loginResponse.headers as CredentialRedirectHeader;
    const loginSessionId = findCookieValueFromHeader(loginResponseHeaders, 'JSESSIONID');
    if (!loginSessionId) {
      throw new InhaAuthError('Login session ID is not found');
    }
    const loginRedirectUrl = loginResponseHeaders.location;

    const portalResponse = await axios.get<string>(loginRedirectUrl, {
      headers: createSessionHeader(loginSessionId),
      maxRedirects: 3,
    });
    if (portalResponse.status !== 200) {
      throw new InhaAuthError('Portal access is denied');
    }
    const portalHtml = portalResponse.data;
    const [, hanwayCookie] = /https:\/\/portal\.inha\.ac\.kr\/setCookie\.jsp\?([^"]+)\s*"/.exec(portalHtml) as RegExpExecArray;
    return new InhaAuth(sid, serviceSessionId, loginSessionId, hanwayCookie);
  }

  private constructor(
    sid: string,
    serviceSessionId: string, loginSessionId: string, hanwayCookie: string,
  ) {
    this.sid = sid;
    this.serviceSessionId = serviceSessionId;
    this.loginSessionId = loginSessionId;
    this.hanwayCookie = hanwayCookie;
  }

  /**
   * 학번을 반환합니다.
   * @returns 학번
   */
  getStudentId(): string {
    const { sid } = this;
    return sid;
  }

  /**
   * 학생 정보를 반환합니다.
   * @async
   * @returns 학생 정보
   */
  async getStudentInfo(): Promise<StudentInfo> {
    const { sid, loginSessionId } = this;
    const infoResponse = await axios.get<string>(INFO_URL, {
      headers: createSessionHeader(loginSessionId),
    });
    if (infoResponse.status !== 200) {
      throw new InhaAuthError('Invalid login session');
    }
    const infoHtml = infoResponse.data;
    const [, name] = HTML_NAME_REGEX.exec(infoHtml) as RegExpExecArray;
    const matchMap = (m: string[]): string => m[1];
    const majorList = Array.from(infoHtml.matchAll(HTML_MAJOR_LIST_REGEX), matchMap);
    const [college, department, grade] = majorList;
    return {
      sid,
      name,
      college,
      department,
      grade,
    };
  }
}
