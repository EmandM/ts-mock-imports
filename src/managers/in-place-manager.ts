import { IModule, IManager, StringKeyOf } from '../types';
import * as sinonModule from 'sinon';
const sinon = sinonModule as sinonModule.SinonStatic;

interface IOriginal {
  [key: string]: any;
}

export class InPlaceMockManager<T> implements IManager {
  protected original: IOriginal;
  protected classFunctionNames: string[]

  constructor(protected module: IModule, protected importName: string) {
    this.classFunctionNames = this.getAllFunctionNames(this.module[this.importName])
    this.original = this.saveOriginal(this.classFunctionNames)
    this.mockMethods(this.classFunctionNames);
  }

  public mock(funcName: StringKeyOf<T>, returns?: any): sinon.SinonStub {
    return this.mockFunction(funcName, returns);
  }

  public getMockInstance(): T {
    return new this.module[this.importName];
  }

  protected mockFunction(funcName: string, returns?: any): sinon.SinonStub {
    const spy = sinon.stub();
    spy.returns(returns);
    this.replaceFunction(funcName, spy);
    return spy;
  }

  protected replaceFunction(funcName: string, newFunc: () => any) {
    this.replace(funcName, newFunc);
  }

  protected replace(name: string, arg: any) {
    this.module[this.importName].prototype[name] = arg;
  }

  protected getAllFunctionNames(obj: any) {
    let funcNames: string[] = [];

    do {
      // Get all properties on this object
      funcNames = funcNames.concat(Object.getOwnPropertyNames(obj.prototype)
        .filter(property => typeof obj.prototype[property] === 'function'));

      // Get the parent class
      obj = Object.getPrototypeOf(obj);
    } while (obj && obj.prototype && obj.prototype !== Object.prototype);

    // Remove duplicate methods
    return funcNames;
  }
  
  protected saveOriginal(functionNames: string[]): IOriginal {
    var original: IOriginal = {}
    functionNames.forEach((funcName) => {
      original[funcName] = this.module[this.importName].prototype[funcName]
    })
    return original
  }

  protected mockMethods(functionNames: string[]) {
    functionNames.forEach((funcName) => {
      // Skip the constructor
      if (funcName === 'constructor') {
        return
      }
      this.mock(funcName as Extract<keyof T, string>);
    });
  }

  public restore() {
    this.classFunctionNames.forEach((funcName) => {
      if (this.original[funcName]) {
        this.module[this.importName].prototype[funcName] = this.original[funcName]
      }
    });
  }
}
