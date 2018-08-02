import { IConstruct } from '../types';
import { ClassManager } from './class-manager';

export interface IMockOptions {
  returns?: any;
}

export class MockManager<T> extends ClassManager {
  protected original: IConstruct<T>;
  protected stubClass: IConstruct<T>;

  public mock(funcName: keyof T, returns?: any): sinon.SinonStub {
    return super.mock(funcName, returns);
  }

  public set<K extends keyof T>(varName: K, replaceWith?: T[K]): void {
    super.replace(varName as string, replaceWith);
  }

  public getMockInstance(): T {
    return new this.stubClass();
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
}
