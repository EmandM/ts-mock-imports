export class OtherManager<T> {
  private original: T;
  private replaceWith: T;

  constructor(private module: IModule, private importName: string, replaceWith?: any) {
    this.original = this.module[this.importName];
    this.replace(replaceWith);
  }

  public set(replaceWith: T): void {
    this.replace(replaceWith);
  }

  public restore() {
    this.module[this.importName] = this.original;
  }

  public getValue(): T {
    return this.replaceWith;
  }

  private replace(replaceWith: T) {
    this.replaceWith = replaceWith;
    this.module[this.importName] = replaceWith;
  }
}
