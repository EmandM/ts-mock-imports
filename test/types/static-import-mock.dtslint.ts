import * as staticTestClass from '../resources/classes/static-test-class';
import * as test from '../resources/classes/multiple-exports';
import * as TestClass from '../resources/classes/test-default-export';
import { ImportMock } from '../../src/import-mock';

// $ExpectType StaticMockManager<StaticTestClass>
ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');

// $ExpectError
ImportMock.mockStaticClass(staticTestClass, 'class');

// $ExpectType StaticMockManager<Test1>
ImportMock.mockStaticClass<test.Test1>(test, 'Test1');

// $ExpectType StaticMockManager<Test2>
ImportMock.mockStaticClass<test.Test2, typeof test>(test, 'Test2');

// $ExpectError
ImportMock.mockStaticClass<test.test3, typeof test>(test, 'test3');
