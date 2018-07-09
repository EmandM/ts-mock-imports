import 'mocha';

import { expect } from 'chai';
import importMock from '../../src/import-mock';
import { MockManager } from '../../src/managers';
import * as staticTestClass from '../resources/classes/static-test-class';
import * as testClass from '../resources/classes/test-class';
import * as defaultClass from '../resources/classes/test-default-export';
import { DefaultClassConsumer, StaticTestClassConsumer, TestClassConsumer } from '../resources/consumers';

describe('Class Mock', () => {
  describe('Mock Class', () => {
    it('should replace the original export with mock class', () => {
      const manager = importMock.mockClass(testClass, 'TestClass');
      const consumer = new TestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('should replace default export with mock class', () => {
      const manager = importMock.mockClass(defaultClass);
      const consumer = new DefaultClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

  });

  describe('Mock Static Class', () => {
    it('should replicate all static functions', () => {
      const manager = importMock.mockStaticClass(staticTestClass, 'StaticTestClass');
      const consumer = new StaticTestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });
  });

  describe('Mock Manager', () => {
    let manager: MockManager<testClass.TestClass>;

    beforeEach(() => {
      manager = importMock.mockClass(testClass, 'TestClass');
    });

    afterEach(() => {
      manager.restore();
    });

    it('should return given value when mocking a function', () => {
      const consumer = new TestClassConsumer();
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      expect(consumer.foo()).to.equal(newReturnVal);
    });

    it('should contain given value when setting a variable', () => {
      const consumer = new TestClassConsumer();
      const newVal = 2;
      manager.set('count', newVal);
      expect(consumer.getCount()).to.equal(newVal);
    });

    it('should return a instance of the mocked class when asked', () => {
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      const instance = manager.getMockInstance();
      expect(instance.foo()).to.equal(newReturnVal);
    });

    it('should restore back to the original import', () => {
      manager.restore();
      const consumer = new TestClassConsumer();
      expect(consumer.foo()).to.equal('bar');
      expect(consumer.getCount()).to.equal(1);
    });
  });
});
