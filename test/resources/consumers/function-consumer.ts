import defaultTestFunction from '../functions/default-test-function';
import { testFunction } from '../functions/test-function';

export class FunctionConsumer {
  public foo() {
    return testFunction();
  }

  public defaultFoo() {
    return defaultTestFunction();
  }
}
