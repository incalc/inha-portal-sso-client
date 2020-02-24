import axios from 'axios';
import InhaAuthError from './InhaAuthError';

const HTML_NAME_REGEX = /<font class=\\"name\\">(.+?)<\/font>/;
const HTML_MAJOR_LIST_REGEX = /<p class=\\"major-list\\">(.+?)<\/p>/g;

const SSO_URL = 'https://portal.inha.ac.kr/inha/SsoTokenService.do';
const INFO_URL = 'https://portal.inha.ac.kr/portalctnt/studPage!00015';

Object.assign(axios.defaults, {
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  validateStatus(status: number) {
    return status < 500;
  },
  maxRedirects: 0,
});

/**
 * 주어진 세션 아이디로 쿠키 헤더를 생성합니다.
 * @param sessionId 세션 아이디
 * @returns 세션 쿠키 헤더
 */
const createSessionHeader = (sessionId: string): { 'cookie': string } => ({
  cookie: `JSESSIONID=${sessionId}`,
});

/**
 * Axios 헤더에서 쿠키 값을 찾아 반환합니다.
 * @param headers
 * @param cookieName
 */
const findCookie = (headers: any, cookieName: string): string | null => headers['set-cookie']
  ?.find((value: string) => value.includes(cookieName))
  ?.match(/^[^=]+=([^;]*);/)[1]
  ?? null;

interface StudentInfo {
  sid: string;
  name: string;
  college: string;
  department: string;
  grade: string;
}

export default class InhaAuth {
  /**
   * 학번
   */
  private readonly sid: string;

  /**
   * 통합인증 서비스 로그인 세션 아이디
   */
  private readonly serviceSessionId: string;

  /**
   * 포털 메인 로그인 세션 아이디
   */
  private readonly loginSessionId: string;

  /**
   * 한웨이(한진그룹 사내 그룹웨어 시스템) 쿠키
   */
  private readonly hanwayCookie: string;

  /**
   * @async
   * @param sid 학번
   * @param password 비밀번호
   * @returns 클래스 인스턴스
   */
  static async init(sid: string, password: string): Promise<InhaAuth> {
    const loginForm = `user_id=${encodeURIComponent(sid)}&user_password=${encodeURIComponent(password)}`;
    const serviceResponse = await axios.post(SSO_URL, loginForm);
    if (serviceResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const serviceSessionId = findCookie(serviceResponse.headers, 'JSESSIONID');
    if (!serviceSessionId) {
      throw new InhaAuthError('Service session ID is not found');
    }
    const serviceRedirectUrl = serviceResponse.headers.location;
    const federateResponse = await axios.get(serviceRedirectUrl);
    if (federateResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const federateRedirectUrl = federateResponse.headers.location;
    const loginResponse = await axios.get(federateRedirectUrl, {
      headers: createSessionHeader(serviceSessionId),
    });
    if (loginResponse.status !== 302) {
      throw new InhaAuthError('Redirect Fail');
    }
    const loginSessionId = findCookie(loginResponse.headers, 'JSESSIONID');
    if (!loginSessionId) {
      throw new InhaAuthError('Login session ID is not found');
    }
    const loginRedirectUrl = loginResponse.headers.location;
    const portalResponse = await axios.get(loginRedirectUrl, {
      headers: createSessionHeader(loginSessionId),
      maxRedirects: 3,
    });
    if (portalResponse.status !== 200) {
      throw new InhaAuthError('Portal access is denied');
    }
    const portalHtml = portalResponse.data;
    const [, hanwayCookie] = portalHtml.match(/https:\/\/portal\.inha\.ac\.kr\/setCookie\.jsp\?([^"]+)\s*"/);
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
    const infoResponse = await axios.get(INFO_URL, {
      headers: createSessionHeader(loginSessionId),
    });
    if (infoResponse.status !== 200) {
      throw new InhaAuthError('Login Fail');
    }
    const infoHtml = infoResponse.data;
    const [, name] = infoHtml.match(HTML_NAME_REGEX);
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
