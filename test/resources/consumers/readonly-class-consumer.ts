import { TestReadonlyClass } from '../classes/class-with-readonly';

export class ReadonlyClassConsumer {
  private readonlyClass: TestReadonlyClass;
  constructor() {
    this.readonlyClass = new TestReadonlyClass();
  }

  public getConfig(): { [val: string]:  any } {
    return this.readonlyClass.getConfig();
  }
}
