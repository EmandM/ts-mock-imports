import * as funcModule from '../resources/functions/test-function';
import * as defaultFuncModule from '../resources/functions/default-test-function';
import { ImportMock } from '../../src/import-mock';

// $ExpectType SinonStub
ImportMock.mockFunction(funcModule, 'testFunction');

// $ExpectType SinonStub
ImportMock.mockFunction(defaultFuncModule);

// $ExpectError
ImportMock.mockFunction(funcModule, 'otherFunction');
