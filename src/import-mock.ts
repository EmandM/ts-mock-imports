import * as sinonModule from 'sinon';
import { MockManager, OtherManager, StaticMockManager, InPlaceMockManager } from './managers/index';
import { IConstruct, IModule, IManager } from './types';
const sinon = sinonModule as sinonModule.SinonStatic;

export class ImportMock {
  private static sandboxedItems: IManager[] = [];

  private static sandbox<T extends IManager>(mock: T): T {
    ImportMock.sandboxedItems.push(mock);
    return mock;
  }

  public static mockClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): MockManager<T> {
    return ImportMock.sandbox(new MockManager<T>(module, importName as string));
  }

  public static mockClassInPlace<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): InPlaceMockManager<T> {
    return ImportMock.sandbox(new InPlaceMockManager<T>(module, importName as string));
  }

  public static mockStaticClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): StaticMockManager<T> {
    return ImportMock.sandbox(new StaticMockManager<T>(module, importName as string));
  }

  public static mockFunction<K extends IModule>(module: { [importName: string]: () => any } | K, importName: keyof K = 'default', returns?: any): sinon.SinonStub {
    return ImportMock.sandbox(sinon.stub(module, importName as string).returns(returns));
  }

  public static mockOther<T extends IModule, K extends keyof T>(module: { [importName: string]: T[K] } | T, importName?: K, replaceWith?: Partial<T[K]>): OtherManager<T[K]> {
    return ImportMock.sandbox(new OtherManager<T[K]>(module, importName as string || 'default', replaceWith));
  }

  public static restore(): void {
    ImportMock.sandboxedItems.forEach(item => item.restore());
    ImportMock.sandboxedItems = [];
  }
}
