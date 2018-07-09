import * as testClass from '../resources/classes/test-class';
import * as staticTestClass from '../resources/classes/static-test-class';
import ImportMock from '../../src/import-mock';

const manager = ImportMock.mockClass(testClass, 'TestClass');
const staticManager = ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');

// $ExpectType SinonStub
manager.mock('foo');

// $ExpectType SinonStub
manager.mock('foo', { bar: 'Bar' });

// $ExpectError
manager.mock('bar');

// $ExpectType TestClass
manager.getMockInstance();

// $ExpectType SinonStub
staticManager.mock('foo');

// Static functions on a class cannot be inferred
// $ExpectType SinonStub
staticManager.mock('bar');

// $ExpectType void
manager.set('count', 1);

// $ExpectError
manager.set('bar', 1);

// $ExpectError
manager.set('count', 'one');

// $ExpectType void
staticManager.set('count', 1);

// Static variables on a class cannot be inferred
// $ExpectType void
staticManager.set('bar', 1);
