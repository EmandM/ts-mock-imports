import * as testClass from '../resources/classes/test-class';
import * as test from '../resources/classes/multiple-exports';
import * as testDefault from '../resources/classes/test-default-export';
import { ImportMock } from '../../src/import-mock';

// $ExpectType InPlaceMockManager<TestClass>
ImportMock.mockClassInPlace(testClass, 'TestClass');

// $ExpectError
ImportMock.mockClassInPlace(testClass, 'class');

// $ExpectType InPlaceMockManager<Test1>
ImportMock.mockClassInPlace<test.Test1>(test, 'Test1');

// $ExpectType InPlaceMockManager<Test2>
ImportMock.mockClassInPlace<test.Test2, typeof test>(test, 'Test2');

// $ExpectError
ImportMock.mockClassInPlace<test.test3, typeof test>(test, 'test3');

// $ExpectType InPlaceMockManager<DefaultClass>
ImportMock.mockClassInPlace(testDefault);
