import { TestClass } from '../classes/test-class';

export class TestClassConsumer {
  private testClass: TestClass;
  constructor() {
    this.testClass = new TestClass();
  }

  public foo() {
    return this.testClass.foo();
  }
}
