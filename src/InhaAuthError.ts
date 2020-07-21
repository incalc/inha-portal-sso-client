/** 인하대 포털 로그인 오류 클래스 */
export default class InhaAuthError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InhaAuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
