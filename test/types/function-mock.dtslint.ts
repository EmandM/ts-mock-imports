import * as funcModule from '../resources/functions/test-function';
import * as defaultFuncModule from '../resources/functions/default-test-function';
import MockImport from '../../src/import-mock';

// $ExpectType SinonStub
MockImport.mockFunction(funcModule, 'testFunction');

// $ExpectType SinonStub
MockImport.mockFunction(defaultFuncModule);

// $ExpectError
MockImport.mockFunction(funcModule, 'otherFunction');
