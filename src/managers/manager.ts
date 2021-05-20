import { IManager, IModule } from '../types';

export class Manager implements IManager {
  protected original: any;

  constructor(protected module: IModule, protected importName: string) {
    this.original = this.module[this.importName];
  }

  public restore() {
    this.module[this.importName] = this.original;
  }
}
