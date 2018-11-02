import * as otherModule from '../resources/other/test';
import * as complexModule from '../resources/other/complex-test';
import { ImportMock } from '../../src/import-mock';

// $ExpectType OtherManager<string>
ImportMock.mockOther(otherModule, 'testConst', 'bar');

// $ExpectType OtherManager<string>
ImportMock.mockOther(otherModule);

// $ExpectError
ImportMock.mockOther(otherModule, 'otherValue');

// $ExpectError
ImportMock.mockOther(otherModule, 'testConst', 100);

// $ExpectType OtherManager<{ keyOne: number; keyTwo: number; }>
ImportMock.mockOther(complexModule, 'complexTest', { keyOne: 4 });
