import { IModule } from '../types';
import { Manager } from './manager';

export class OtherManager<T> extends Manager {
  protected original!: T;
  private replaceWith!: Partial<T>;

  constructor(protected module: IModule, protected importName: string, replaceWith?: Partial<T>) {
    super(module, importName);
    if (replaceWith) {
      this.replace(replaceWith);
    }
  }

  public set(replaceWith: Partial<T>): void {
    this.replace(replaceWith);
  }
  public getValue(): Partial<T> {
    return this.replaceWith;
  }

  private replace(replaceWith: Partial<T>) {
    this.replaceWith = replaceWith;
    this.module[this.importName] = replaceWith;
  }
}
