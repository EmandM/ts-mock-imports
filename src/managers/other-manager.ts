import { IModule } from '../types';
import { Manager } from './manager';

export class OtherManager<T> extends Manager {
  protected original!: T;
  private replaceWith!: T;

  constructor(protected module: IModule, protected importName: string, replaceWith?: any) {
    super(module, importName);
    this.replace(replaceWith);
  }

  public set(replaceWith: T): void {
    this.replace(replaceWith);
  }
  public getValue(): T {
    return this.replaceWith;
  }

  private replace(replaceWith: T) {
    this.replaceWith = replaceWith;
    this.module[this.importName] = replaceWith;
  }
}
