import { IManager, IModule } from '../types';

export class Manager<T> implements IManager {
  protected original: T;

  constructor(protected module: IModule, protected importName: string) {
    this.original = this.module[this.importName] as T;
  }

  public restore() {
    this.module[this.importName] = this.original;
  }
}
