export class TestReadonlyClass {
  private readonly config: { [p: string]: any };

  public getConfig = (): { [p: string]: any } => {
      return this.config;
  }
}
