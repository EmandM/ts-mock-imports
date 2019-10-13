import * as sinonModule from 'sinon';
import { IConstruct, IModule, StringKeyOf } from '../types';
import { Manager } from './manager';
const sinon = sinonModule as sinonModule.SinonStatic;

export interface IMockOptions {
  returns?: any;
}

export class MockManager<T> extends Manager {
  protected original!: IConstruct<T>;
  protected stubClass!: IConstruct<T>;

  constructor(protected module: IModule, protected importName: string) {
    super(module, importName);
    this.createStubClass();
    this.module[this.importName] = this.stubClass;
  }

  public mock(funcName: StringKeyOf<T>, returns?: any): sinon.SinonStub {
    return this.mockFunction(funcName, returns);
  }

  public set<K extends keyof T & string>(varName: K, replaceWith?: T[K]): void {
    this.replace(varName as string, replaceWith);
  }

  public getMockInstance(): T {
    return new this.stubClass();
  }

  protected mockFunction(funcName: string, returns?: any): sinon.SinonStub {
    const spy = sinon.stub();
    spy.returns(returns);
    this.replaceFunction(funcName as string, spy);
    return spy;
  }

  public replaceFunction(funcName: string, newFunc: () => any) {
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
    return funcNames;
  }

  protected createStubClass() {
    // tslint:disable-next-line:max-classes-per-file
    this.stubClass = class {
      constructor() {
        return;
      }
    } as any;

    this.getAllFunctionNames(this.original)
      .forEach((funcName) => {
        this.mock(funcName as Extract<keyof T, string>);
      });
  }
}
