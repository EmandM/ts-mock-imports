import { TestClass } from '../classes/test-class';

export class TestClassConsumer {
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

  public callInner() {
    return this.testClass.someProp.someFunc()
  }
}
