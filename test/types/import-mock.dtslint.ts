import * as testClass from '../resources/classes/test-class';
import * as test from '../resources/classes/multiple-exports';
import * as testDefault from '../resources/classes/test-default-export';
import { ImportMock } from '../../src/import-mock';

// $ExpectType MockManager<TestClass>
ImportMock.mockClass(testClass, 'TestClass');

// $ExpectError
ImportMock.mockClass(testClass, 'class');

// $ExpectType MockManager<Test1>
ImportMock.mockClass<test.Test1>(test, 'Test1');

// $ExpectType MockManager<Test2>
ImportMock.mockClass<test.Test2, typeof test>(test, 'Test2');

// $ExpectError
ImportMock.mockClass<test.test3, typeof test>(test, 'test3');

// $ExpectType MockManager<DefaultClass>
ImportMock.mockClass(testDefault);
