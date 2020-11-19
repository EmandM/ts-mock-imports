import testDefault from 'broken-ts-repro/dist/test-default-class';

export class BrokenDefaultClassConsumer {
  private testClass: testDefault;
  constructor() {
    this.testClass = new testDefault();
  }

  public foo() {
    return this.testClass.foo();
  }
}
