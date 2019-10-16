# Typescript Mock Imports

#### Intuitive mocking for Typescript imports.

[![npm](https://img.shields.io/npm/v/ts-mock-imports.svg)](https://www.npmjs.com/package/ts-mock-imports) [![Build Status](https://travis-ci.org/EmandM/ts-mock-imports.svg)](https://travis-ci.org/EmandM/ts-mock-imports)

## About

ts-mock-imports is useful if you want to replace imports with stub versions of those imports. This allows ES6 code to be easily unit-tested without the need for an explicit dependency injection library.

ts-mock-imports is built on top of sinon. [Sinon stub documentation](https://sinonjs.org/releases/latest/stubs/)

Mocked classes take all of the original class functions, and replace them with noop functions (functions returning `undefined`).

This library needs to be run on TypeScript 2.6.1 or later.


- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
    - [ImportMock](#importmock)
    - [MockManager (and MockStaticManager)](#mockmanager-and-mockstaticmanager)
    - [OtherManager](#othermanager)
- [Test](#test)
    - [Typescript Tests](#typescript-tests)
    - [Unit Tests](#unit-tests)

## Installation

ts-mock-imports is built on top of Sinon and TypeScript. Ensure you have both installed.

```bash
npm install typescript

npm install sinon --save-dev
```

Install the library

```
npm install ts-mock-imports --save-dev
```

## Usage

`src/foo.ts`
```javascript
export class Foo {
  constructor() {
    throw new Error();
  }
}
```

`src/bar.ts`
```javascript
import { Foo } from './foo';

export class Bar {
  constructor() {
    const foo = new Foo();
  }
}
```

`test/bar.spec.ts`
```javascript
import { ImportMock } from 'ts-mock-imports';
import { Bar } from './Bar';
import * as fooModule from '../src/foo';

// Throws error
const bar = new Bar();

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

// No longer throws an error
const bar = new Bar();

// Call restore to reset to original imports
mockManager.restore();
```

## API

### ImportMock

**`mockClass(module: <import * as>, importName?: string ): MockManager<T>`**

**module:**

The module containing the class you would like to mock.

Both the source file and test file need to use the same path to import the mocked module. I.e. Cannot use `'src/index'` to import into the `.spec.ts` file and then use `'src/foo'` to import into `bar.ts`. Both files need to use either `'src/foo'` or `'src/index'`.

**importName:**

What the class is exported as. If exported using `export default` then this parameter is not needed.

Using importName:
```javascript
// export class Foo
import * as fooModule from '../src/foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');
```

Default imports:
```javascript
// export default Foo
import * as foo from '../foo';

const mockManager = ImportMock.mockClass(foo);
```

Import mock will infer the type of `Foo` if it is the only item exported out of it's file. If more things are exported, you will need to  explicitly provide types to Import mock.

Explicit typing:
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass<fooModule.Foo>(fooModule, 'Foo');
```

If you wish to ensure that `Foo` is the correct name for the mocked class, give import mock the type of your module.

Explicit typing with full type assurance
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass<fooModule.Foo, typeof fooModule>(fooModule, 'Foo');

// Will result in a TS Error as Bar is not exported by Foo
const mockManager = ImportMock.mockClass<fooModule.Foo, typeof fooModule>(fooModule, 'Bar');
```

`mockClass` replaces the original export with a fake class. All original functions exist on the fake class as noop functions (functions returning `undefined`).

---

**`mockStaticClass(module: <import * as>, importName?: string ): MockStaticManager<T>`**

Takes the same arguments as `mockClass` but only replaces static functions on the original class.

Static classes:
(Only recreates static methods)
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockStaticClass(fooModule, 'Foo');
```

---

**`mockFunction(module: <import * as>, importName?: string, returns?: any): SinonStub`**

Returns a SinonStub that is set up to return the optional argument.

Call restore on the stub object to restore the original export.

Function exports:
```javascript
import * as fooModule from '../foo';

const stub = ImportMock.mockFunction(fooModule, 'fooFunction', 'bar');
// fooFunction will now return bar

stub.restore()
```

---

**`mockOther(module: <import * as>, importName?: string, replaceWith: Partial<typeof module.importName>): OtherManager<T>`**

`mockOther()` uses the replaceWith argument to entirely replace the original exported item.

Useful for mocking out or removing variables and enums.

Variable mocking:
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockOther(fooModule, 'fooName', 'fakeName');
// import { fooName } from './foo' now returns 'fakeName'
```

**replaceWith:**

Requires an object that matches Partial<OriginalType>. This argument is an optional shorthand, and the value can be updated using mockMangaer.set().

---

### MockManager (and MockStaticManager)

**`MockManager<T>.mock(functionName: string, returns?: any): SinonStub`**

Returns a sinon stub object.

**functionName:**

The name of the function you would like to mock.

If using MockManager, Typescript expects the functionName to match functions available on the original class.

MockStaticManager allows any string.

**returns:**

The value returned when the mocked function is called.

Mocking functions:
(Returns a sinon stub)
```javascript
import * as fooModule from '../foo';

const fooManager = ImportMock.mockClass(fooModule, 'Foo');

// Will throw a type error if bar() does not exist on Foo
fooManager.mock('bar');
// new Foo().bar() will return undefined
```

Mocking functions with a return object:
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

mockManager.mock('bar', 'Bar');
// new Foo().bar() now returns 'Bar'
```

If you wish to run modified code when the mocked function is called, you can use `sinon.callsFake()`
```javascript
const mockManager = ImportMock.mockClass(fooModule, 'Foo');
const sinonStub = mockManager.mock('bar');
sinonStub.callsFake(() => {
  // custom code here
})
```

---

**`MockManager<T>.set(varName: string, replaceWith?: any): void`**

Replaces a property with a given value.

**varName**

The name of the property you would like to mock.

If using MockManager, Typescript expects the varName to match properties available on the original class.

MockStaticManager allows any string.

**replaceWith:**

The mock value of the property.


Mocking variable with a return object:
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

const newVal = 5;
mockManager.set('count', newVal);
// new Foo().count now returns 5
```

---

**`MockManager<T>.getMockInstance(): T`**

Returns an instance of the mocked class.
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

const sinonStub = mockManager.mock('bar', 'Bar');
const mockFoo = mockManager.getMockInstance();
mockFoo.bar() // returns 'Bar'
```
---

**`MockManager<T>.restore()`**

Restores the import back to the original class.

It is important that this is called so future imports work as expected.

---

### OtherManager

**`OtherManager<T>.set(replaceWith?: T): void`**

Replaces an exported property with a given value.

This value must match the type of the original export.

**replaceWith:**

The mock value of the export.


Mocking variable with a return object:
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockOther(fooModule, 'FooName', 'fakeName');
// import { FooName } from './foo' imports 'fakeName'

const newVal = 'newName';
mockManager.set(newVal);
// import { FooName } from './foo' now imports 'newName'
```

---

**`OtherManager<T>.getValue(): T`**

Returns the current mockValue
```javascript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockOther(fooModule, 'FooName', 'fakeName');

mockManager.getValue(); // returns 'fakeName'
```
---

**`OtherManager<T>.restore()`**

Restores the import back to the original class.

It is important that this is called so future imports work as expected.


## Limitations

Import mock works best when mocking es6 exports. Due to JavaScript's sometimes winding development history, there are some modules that use alternate export patterns that may not work correctly when mocked using Import mock. To reduce the chance of issues, all production code should aim to use `import { item } from 'module';` syntax. This allows the test code to use `import * as object from 'module';` syntax seamlessly.

Requirejs is not currently compatible with this library.



## Test

This library contains two types of tests. Typescript tests ensure the typing systems work as intended, while unit tests check the runtime functionality of the library.

### All tests

```
npm run test
```

### Typescript Tests

```
npm run dtslint
```

### Unit Tests

```
npm run unit-test
```
