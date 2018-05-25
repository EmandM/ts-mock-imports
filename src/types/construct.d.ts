declare interface IConstruct<T> {
  new(...args: any[]): T;
  [staticFuncName: string]: any;
}


