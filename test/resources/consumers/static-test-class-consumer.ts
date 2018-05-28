import { StaticTestClass } from '../classes/static-test-class';

export class StaticTestClassConsumer {
  public foo() {
    return StaticTestClass.foo();
  }
}
