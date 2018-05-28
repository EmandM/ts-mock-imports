import { MockManager, StaticMockManager } from './managers';
import { IConstruct } from './types';

export default class ImportMock {
  public static mockClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): MockManager<T> {
    return new MockManager<T>(module, importName);
  }

  public static mockStaticClass<T, K extends IModule = any>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): StaticMockManager<T> {
    return new StaticMockManager<T>(module, importName);
  }
}
