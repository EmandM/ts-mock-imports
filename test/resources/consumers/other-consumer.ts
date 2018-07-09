import test, { testConst } from '../other/test';

export class OtherConsumer {
  public foo() {
    return testConst;
  }

  public defaultFoo() {
    return test;
  }
}
