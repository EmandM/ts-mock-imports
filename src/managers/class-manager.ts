import * as sinonModule from 'sinon';
import { IModule } from '../types';
const sinon = sinonModule as sinonModule.SinonStatic;

export interface IMockOptions {
  returns?: any;
}

export class ClassManager {
  protected original: any;
  protected stubClass: any;

  constructor(private module: IModule, private importName: string) {
    this.original = this.module[this.importName];
    this.createStub();
    this.module[this.importName] = this.stubClass;
  }

  public mock(funcName: any, returns?: any): sinon.SinonStub {
    const spy = sinon.stub();
    spy.returns(returns);
    this.replaceFunction(funcName as string, spy);
    return spy;
  }

  public set(varName: any, replaceWith?: any): void {
    this.replace(varName as string, replaceWith);
  }

  public restore() {
    this.module[this.importName] = this.original;
  }

  public getMockInstance(): any {
    return new this.stubClass();
  }

  protected replaceFunction(funcName: string, newFunc: () => any) {
    this.replace(funcName, newFunc);
  }

  protected replace(name: string, arg: any) {
    this.stubClass.prototype[name] = arg;
  }

  protected getAllFunctionNames(obj: any): string[] {
    return obj ? [] : undefined;
  }

  protected createStub(): void {
    // tslint:disable-next-line:max-classes-per-file
    this.stubClass = class {
      constructor() {
        return;
      }
    } as any;

    this.getAllFunctionNames(this.original)
      .forEach((funcName) => {
        this.mock(funcName);
      });
  }
}
