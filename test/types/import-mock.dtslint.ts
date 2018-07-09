import * as testClass from '../resources/classes/test-class';
import * as test from '../resources/classes/multiple-exports';
import * as testDefault from '../resources/classes/test-default-export';
import MockImport from '../../src/import-mock';

// $ExpectType MockManager<TestClass>
MockImport.mockClass(testClass, 'TestClass');

// $ExpectError
MockImport.mockClass(testClass, 'class');

// $ExpectType MockManager<Test1>
MockImport.mockClass<test.Test1>(test, 'Test1');

// $ExpectType MockManager<Test2>
MockImport.mockClass<test.Test2, typeof test>(test, 'Test2');

// $ExpectError
MockImport.mockClass<test.test3, typeof test>(test, 'test3');

// $ExpectType MockManager<DefaultClass>
MockImport.mockClass(testDefault);
