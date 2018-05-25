import { MockManager, StaticMockManager } from './managers';

export default class ImportMock {
  public static stubClass<K extends IModule, T>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): MockManager<T> {
    return new MockManager<T>(module, importName);
  }

  public static stubStaticClass<K extends IModule, T>(
    module: { [importName: string]: IConstruct<T> } | K, importName: keyof K = 'default'): StaticMockManager<T> {
    return new StaticMockManager<T>(module, importName);
  }
}
