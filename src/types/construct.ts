export interface IConstruct<T> {
  new(...args: any[]): T;
  [key: string]: any;
}
