import { uniq } from 'lodash';
import { SinonStub } from 'sinon';
import { MockManager } from '.';

export class StaticMockManager<T> extends MockManager<T> {
  public mock(funcName: keyof IConstruct<T>, ...args: any[]): SinonStub {
    return super.mock(funcName as keyof T, ...args);
  }

  protected replaceFunction(funcName: string, newFunc: () => any) {
    (this.stubClass as any)[funcName] = newFunc;
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
    return uniq(funcNames);
  }
}
