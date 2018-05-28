import testDefaultExport from '../classes/test-default-export';

export class DefaultClassConsumer {
  private testClass: testDefaultExport;
  constructor() {
    this.testClass = new testDefaultExport();
  }

  public foo() {
    return this.testClass.foo();
  }
}
