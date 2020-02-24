export default class InhaAuthError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InhaAuthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
