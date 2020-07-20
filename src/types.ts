export interface CookieReceivedHeader {
  'set-cookie': string[]
}

export interface CookieSentHeader {
  cookie: string
}

export interface RedirectHeader {
  location: string,
}

/** 학생 정보 */
export interface StudentInfo {
  /** 학번 */
  sid: string;

  /** 이름 */
  name: string;

  /** 단과대학명 */
  college: string;

  /** 학과명 */
  department: string;

  /** 학년 */
  grade: string;
}
