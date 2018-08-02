import { IModule } from '../types';

export class Manager {
  protected original: any;

  constructor(protected module: IModule, protected importName: string) {
  }

  public restore() {
    this.module[this.importName] = this.original;
  }
}
