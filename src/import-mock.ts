import * as sinonModule from 'sinon';
import { MockManager, StaticMockManager } from './managers';
import { IConstruct } from './types';
const sinon = sinonModule as sinonModule.SinonStatic;

export default class ImportMock {
  public static mockClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): MockManager<T> {
    return new MockManager<T>(module, importName as string);
  }

  public static mockStaticClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): StaticMockManager<T> {
    return new StaticMockManager<T>(module, importName as string);
  }

  public static mockFunction<K extends IModule>(module: { [importName: string]: () => any } | K, importName: keyof K = 'default', returns?: any): sinon.SinonStub {
    return sinon.stub(module, importName as string).returns(returns);
  }
}
