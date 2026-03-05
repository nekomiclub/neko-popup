class EFKW extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = 'error at [neko-popup]';
  }
}

export default EFKW;