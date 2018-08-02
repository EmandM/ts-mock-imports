import { SinonStub } from 'sinon';
import { MockManager } from '.';
import { IConstruct, StringKeyOf } from '../types';

export class StaticMockManager<T> extends MockManager<T> {
  public mock(funcName: StringKeyOf<IConstruct<T>>, ...args: any[]): SinonStub {
    return super.mockFunction(funcName, ...args);
  }

  public set(varName: string, replaceWith: any): void {
    return super.replace(varName, replaceWith);
  }

  protected replace(name: string, arg: any) {
    (this.stubClass as any)[name] = arg;
  }

  protected getAllFunctionNames(obj: any): string[] {
    let funcNames: string[] = [];

    do {
      // Get all properties on this object
      funcNames = funcNames.concat(Object.getOwnPropertyNames(obj)
        .filter(property => typeof obj[property] === 'function'));

      // Get the parent class
      obj = Object.getPrototypeOf(obj);
    } while (obj && obj.prototype && obj.prototype !== Object.prototype);

    // Remove duplicate methods
    return funcNames;
  }
}
