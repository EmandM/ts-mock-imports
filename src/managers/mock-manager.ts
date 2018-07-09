import { forEach, uniq } from 'lodash';
import * as sinonModule from 'sinon';
const sinon = sinonModule as sinonModule.SinonStatic;

export interface IMockOptions {
  returns?: any;
}

export class MockManager<T> {
  protected original: IConstruct<T>;
  protected stubClass: IConstruct<T>;

  constructor(private module: IModule, private importName: string) {
    this.original = this.module[this.importName];
    this.createStubClass();
    this.module[this.importName] = this.stubClass;
  }

  public mock(funcName: keyof T, returns?: any): sinon.SinonStub {
    const spy = sinon.stub();
    spy.returns(returns);
    this.replaceFunction(funcName as string, spy);
    return spy;
  }

  public set<K extends keyof T>(varName: K, replaceWith?: T[K]): void {
    this.replace(varName as string, replaceWith);
  }

  public restore() {
    this.module[this.importName] = this.original;
  }

  public getMockInstance(): T {
    return new this.stubClass();
  }

  protected replaceFunction(funcName: string, newFunc: () => any) {
    this.replace(funcName, newFunc);
  }

  protected replace(name: string, arg: any) {
    this.stubClass.prototype[name] = arg;
  }

  protected getAllFunctionNames(obj: any) {
    let funcNames: string[] = [];

    do {
      // Get all properties on this object
      funcNames = funcNames.concat(Object.getOwnPropertyNames(obj.prototype));

      // Get the parent class
      obj = Object.getPrototypeOf(obj);
    } while (obj && obj.prototype && obj.prototype !== Object.prototype);

    // Remove duplicate methods
    return uniq(funcNames);
  }

  protected createStubClass() {
    // tslint:disable-next-line:max-classes-per-file
    this.stubClass = class {
      constructor() {
        return;
      }
    } as any as IConstruct<T>;

    const functions = this.getAllFunctionNames(this.original);
    forEach(functions, (funcName) => {
      this.mock(funcName as keyof T);
    });
  }
}
