import { TestClass } from 'broken-ts-repro'

export class BrokenTestClassConsumer {
  private testClass: TestClass;
  constructor() {
    this.testClass = new TestClass();
  }

  public foo() {
    return this.testClass.foo();
  }

  public getCount() {
    return this.testClass.count;
  }
}
