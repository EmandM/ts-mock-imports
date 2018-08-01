import * as otherModule from '../resources/other/test';
import { ImportMock } from '../../src/import-mock';

// $ExpectType OtherManager<string>
ImportMock.mockOther(otherModule, 'testConst', 'bar');

// $ExpectType OtherManager<string>
ImportMock.mockOther(otherModule);

// $ExpectError
ImportMock.mockOther(otherModule, 'otherValue');

// $ExpectError
ImportMock.mockOther(otherModule, 'testConst', 100);
