class EFKW extends Error {
  constructor(msg: string) {
    super(msg);

    this.name = 'error at [__PACKAGE_NAME]';
  }
}

export default EFKW;