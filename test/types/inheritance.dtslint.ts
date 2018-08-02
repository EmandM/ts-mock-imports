import * as testClass from '../resources/classes/test-class';
import * as staticTestClass from '../resources/classes/static-test-class';
import * as otherModule from '../resources/other/test';
import { ImportMock, Manager, MockManager } from '../../src';

const mockManager = ImportMock.mockClass(testClass, 'TestClass');
const staticManager = ImportMock.mockStaticClass(staticTestClass, 'StaticTestClass');
const otherManager = ImportMock.mockOther(otherModule, 'testConst', 'bar');

let manager: Manager;
let mockManagerTest: MockManager<any>;

// $ExpectType MockManager<TestClass>
manager = mockManager;

// $ExpectType StaticMockManager<StaticTestClass>
manager = staticManager;

// $ExpectType OtherManager<string>
manager = otherManager;

// $ExpectType StaticMockManager<StaticTestClass>
mockManagerTest = staticManager;

// $ExpectError
mockManagerTest = otherManager;
