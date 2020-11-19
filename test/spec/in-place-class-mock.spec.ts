import 'mocha';

import { expect } from 'chai';
import { ImportMock } from '../../src/import-mock';
import { InPlaceMockManager } from '../../src/managers';
import * as brokenTestClass from 'broken-ts-repro';
import * as brokenDefaultClass from 'broken-ts-repro/dist/test-default-class';
import * as testClass from '../resources/classes/test-class';
import { BrokenTestClassConsumer, BrokenDefaultClassConsumer, TestClassConsumer } from '../resources/consumers';

describe('In Place Class Mock', () => {
  describe('In Place Mock Class', () => {
    it('should replace the original export with mock class following new TS 3.9 restrictions', () => {
      const manager = ImportMock.mockClassInPlace(brokenTestClass, 'TestClass');
      const consumer = new BrokenTestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('should replace default export with mock class following new TS 3.9 restrictions', () => {
      const manager = ImportMock.mockClassInPlace(brokenDefaultClass);
      const consumer = new BrokenDefaultClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });

    it('should replace the original export with mock class for old class compilation pattern', () => {
      const manager = ImportMock.mockClassInPlace(testClass, 'TestClass');
      const consumer = new TestClassConsumer();
      expect(consumer.foo).not.to.be.undefined;
      expect(consumer.foo()).to.be.undefined;
      manager.restore();
    });
  });

  describe('In Place Mock Manager', () => {
    let manager: InPlaceMockManager<brokenTestClass.TestClass>;

    beforeEach(() => {
      manager = ImportMock.mockClassInPlace(brokenTestClass, 'TestClass');
    });

    afterEach(() => {
      manager.restore();
    });

    it('should return given value when mocking a function', () => {
      const consumer = new BrokenTestClassConsumer();
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      expect(consumer.foo()).to.equal(newReturnVal);
    });

    it('should leave variables unchanged', () => {
      const consumer = new BrokenTestClassConsumer();
      expect(consumer.getCount()).to.equal(1);
    });

    it('should return a instance of the mocked class when asked', () => {
      const newReturnVal = 'baz';
      manager.mock('foo', newReturnVal);
      const instance = manager.getMockInstance();
      expect(instance.foo()).to.equal(newReturnVal);
    });

    it('should restore back to the original import', () => {
      manager.restore();
      const consumer = new BrokenTestClassConsumer();
      expect(consumer.foo()).to.equal('bar');
    });
  });
});
