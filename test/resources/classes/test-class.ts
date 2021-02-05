export class TestClass {
  public count: number = 1;
  public someProp: propFunc  = { someFunc: () => 5, foo: 'bar' };
  public foo() {
    return 'bar';
  }
}

type propFunc = {
  someFunc: ()=>number
  foo: string
}
