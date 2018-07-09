import * as otherModule from '../resources/other/test';
import MockImport from '../../src/import-mock';

// $ExpectType OtherManager<string>
MockImport.mockOther(otherModule, 'testConst', 'bar');

// $ExpectType OtherManager<string>
MockImport.mockOther(otherModule);

// $ExpectError
MockImport.mockOther(otherModule, 'otherValue');

// $ExpectError
MockImport.mockOther(otherModule, 'testConst', 100);
