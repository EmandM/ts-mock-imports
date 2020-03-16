import 'mocha';

import { expect, assert } from 'chai';
import { ImportMock } from '../../src/import-mock';
import * as staticTestClass from '../resources/classes/static-test-class';
import * as testClass from '../resources/classes/test-class';
import * as funcModule from '../resources/functions/test-function';
import * as otherModule from '../resources/other/test';
import { StaticTestClassConsumer, TestClassConsumer, FunctionConsumer, OtherConsumer } from '../resources/consumers';

describe('Import Mock', () => {
  beforeEach(() => {
    ImportMock.restore()
  });

  it('should restore single mocked item back to default', () =>{
    ImportMock.mockClass(testClass, 'TestClass');
    ImportMock.restore();
    const consumer = new TestClassConsumer();
    expect(consumer.foo()).to.equal('bar');
    expect(consumer.getCount()).to.equal(1);
  });

  it('should restore all mocked items back to default', () => {
    ImportMock.mockClass(testClass, 'TestClass');
    ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');
    ImportMock.mockFunction(funcModule, 'testFunction', 'bar');
    ImportMock.mockOther(otherModule, 'testConst', 'bar');

    ImportMock.restore();
    
    const consumer = new TestClassConsumer();
    const staticConsumer = new StaticTestClassConsumer();
    const functionConsumer = new FunctionConsumer();
    const otherConsumer = new OtherConsumer();

    assert(consumer.foo() === 'bar', 'test class restores correctly');
    expect(consumer.getCount()).to.equal(1);
    assert(staticConsumer.foo() === 'bar', 'static test class restores correctly');
    assert(functionConsumer.foo() === 'foo', 'function restores correctly');
    assert(otherConsumer.foo() ==='foo', 'other restores correctly');
  });
});
