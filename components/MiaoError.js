export default class MiaoError extends Error {

  constructor(message) {
    // 允许返回特殊消息，需传递数组，例如 [segment.image()]
    if (Array.isArray(message)) {
      super()
      this._message = message
    } else {
      super(message);
    }
  }

  get message() {
    return this._message ? this._message : super.message;
  }

}