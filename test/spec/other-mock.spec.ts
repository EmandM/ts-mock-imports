import 'mocha';
import { OtherManager } from './../../src/managers/other-manager';

import { expect } from 'chai';
import { ImportMock } from '../../src/import-mock';
import * as otherModule from '../resources/other/test';
import { OtherConsumer } from './../resources/consumers/other-consumer';

describe('Other Mock', () => {
  let manager: OtherManager<string>;
  let newVal: string;

  beforeEach(() => {
    newVal = 'bar';
    manager = ImportMock.mockOther(otherModule, 'testConst', newVal);
  });

  afterEach(() => {
    manager.restore();
  });

  describe('Mock Other', () => {
    it('should replace the original export with given value', () => {
      const consumer = new OtherConsumer();
      expect(consumer.foo()).not.to.be.undefined;
      expect(consumer.foo()).to.equal(newVal);
    });
  });

  describe('Other Manager', () => {
    it('should update the value when set is called', () => {
      const consumer = new OtherConsumer();
      expect(consumer.foo()).to.equal(newVal);

      const secondVal = 'baz';
      manager.set(secondVal);

      expect(consumer.foo()).to.equal(secondVal);
    });

    it('should return the current mocked value when getValue is called', () => {
      expect(manager.getValue()).to.equal(newVal);
    });

    it('should restore back to the original import', () => {
      manager.restore();
      const consumer = new OtherConsumer();
      expect(consumer.foo()).to.equal('foo');
    });
  });
});
