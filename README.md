# Typescript Mock Imports

#### Intuitive mocking for Typescript imports.

[![npm](https://img.shields.io/npm/v/ts-mock-imports.svg)](https://www.npmjs.com/package/ts-mock-imports) [![Build Status](https://travis-ci.org/EmandM/ts-mock-imports.svg)](https://travis-ci.org/EmandM/ts-mock-imports)

## About

ts-mock-imports leverages the ES6 `import` syntax to mock out imported code with stub versions of the imported objects. This allows ES6 code to be easily unit-tested without the need for an explicit dependency injection library.

ts-mock-imports is built on top of sinon. [Sinon stub documentation](https://sinonjs.org/releases/latest/stubs/)

Mocked classes take all of the original class functions, and replace them with noop functions (functions returning `undefined`) while maintaining type safety.

This library needs to be run on TypeScript 2.6.1 or later.

- [Typescript Mock Imports](#typescript-mock-imports)
      - [Intuitive mocking for Typescript imports.](#intuitive-mocking-for-typescript-imports)
  - [About](#about)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
    - [ImportMock](#importmock)
    - [MockManager (and MockStaticManager)](#mockmanager-and-mockstaticmanager)
    - [OtherManager](#othermanager)
  - [Limitations](#limitations)
  - [`TypeError: Cannot set property TestClass of #<Object> which has only a getter`](#typeerror-cannot-set-property-testclass-of-object-which-has-only-a-getter)
    - [InPlaceMockManager](#inplacemockmanager)
    - [InPlaceMockManager API](#inplacemockmanager-api)
  - [Test](#test)

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
```typescript
export class Foo {
  private count: number;
  constructor() {
    throw new Error();
  }

  public getCount(): number {
    return count;
  }
}
```

`src/bar.ts`
```typescript
import { Foo } from './foo';

export class Bar {
  constructor() {
    const foo = new Foo();
  }
}
```

`test/bar.spec.ts`
```typescript
import { ImportMock } from 'ts-mock-imports';
import { Bar } from './Bar';
import * as fooModule from '../src/foo';

// Throws error
const bar = new Bar();

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

// No longer throws an error
const bar = new Bar();

// Easily add mock responses for testing
mockmanager.mock('getCount', 3)

// Call restore to reset all mocked objects to original imports
ImportMock.restore();
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
```typescript
// export class Foo
import * as fooModule from '../src/foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');
```

Default imports:
```typescript
// export default Foo
import * as foo from '../foo';

const mockManager = ImportMock.mockClass(foo);
```

Import mock will infer the type of `Foo` if it is the only item exported out of it's file. If more things are exported, you will need to  explicitly provide types to Import mock.

Explicit typing:
```typescript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass<fooModule.Foo>(fooModule, 'Foo');
```

If you wish to ensure that `Foo` is the correct name for the mocked class, give import mock the type of your module.

Explicit typing with full type assurance
```typescript
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
```typescript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockStaticClass(fooModule, 'Foo');
```

---

**`mockFunction(module: <import * as>, importName?: string, returns?: any): SinonStub`**

Returns a SinonStub that is set up to return the optional argument.

Call restore on the stub object to restore the original export.

Function exports:
```typescript
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
```typescript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockOther(fooModule, 'fooName', 'fakeName');
// import { fooName } from './foo' now returns 'fakeName'
```

**replaceWith:**

Requires an object that matches Partial<OriginalType>. This argument is an optional shorthand, and the value can be updated using mockManager.set().

---

**`restore(): void`**

`restore()` will restore all mocked items. Allows `ImportMock` to be used as a sandbox.

Useful for restoring when multiple mocks have been created.

Variable mocking:
```typescript
import * as fooModule from '../foo';
import * as bazModule from '../baz';

ImportMock.mockClass(fooModule, 'Foo');
ImportMock.mockClass(fooModule, 'Bar');
ImportMock.mockFunction(bazModule, 'mainFunction')

// <run tests>

ImportMock.restore()

// all mocked imports will now be restored to their original values
```


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
```typescript
import * as fooModule from '../foo';

const fooManager = ImportMock.mockClass(fooModule, 'Foo');

// Will throw a type error if bar() does not exist on Foo
fooManager.mock('bar');
// new Foo().bar() will return undefined
```

Mocking functions with a return object:
```typescript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

mockManager.mock('bar', 'Bar');
// new Foo().bar() now returns 'Bar'
```

If you wish to run modified code when the mocked function is called, you can use `sinon.callsFake()`
```typescript
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
```typescript
import * as fooModule from '../foo';

const mockManager = ImportMock.mockClass(fooModule, 'Foo');

const newVal = 5;
mockManager.set('count', newVal);
// new Foo().count now returns 5
```

---

**`MockManager<T>.getMockInstance(): T`**

Returns an instance of the mocked class.
```typescript
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
```typescript
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
```typescript
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


## `TypeError: Cannot set property TestClass of #<Object> which has only a getter`


Typescript 3.9 introduced new functionality that blocks the key functionality of this library. With certain compilation structures, it is no longer possible to replace module exports.

There is no true workaround for this issue. A partial workaround has been implemented and is in an alpha testing stage.

**Warning: The following functions are potentially risky and can lead to unexpected behaviour**


### InPlaceMockManager

```typescript
// export class Foo
import * as fooModule from '../src/foo';

const mockManager = ImportMock.mockClassInPlace(fooModule, 'Foo');
```

This replacement for `mockManager` does not replace the entire class, but instead replaces all functions on the given class **In Place**. This means the original constructor and any local class variables are left on the mocked class. `restore()` will replace all functions back to their original state, however it cannot guarantee that all internal variables are restored. As such, this function should be used with caution as memory can potentially leak between tests.

`set()` is also not available on this manager.

For more information: [Issue 24](https://github.com/EmandM/ts-mock-imports/issues/24)

### InPlaceMockManager API

**`InPlaceMockManager<T>.mock(functionName: string, returns?: any): SinonStub`**

Returns a sinon stub object.

**functionName:**

The name of the function you would like to mock.

If using MockManager, Typescript expects the functionName to match functions available on the original class.

MockStaticManager allows any string.

**returns:**

The value returned when the mocked function is called.

Mocking functions:
(Returns a sinon stub)

```typescript
const mockManager = ImportMock.mockClassInPlace(fooModule, 'Foo');
const sinonStub = mockManager.mock('bar');
```


**`MockManager<T>.restore()`**

Restores the import back to the original class.

It is important that this is called so future imports work as expected.

**Warning: It is not guaranteed that `restore()` will completely restore the class definition**



## Test

This library contains two types of tests. 
1. Typescript tests to ensure typing works as intended: `npm run dtslint`
2. Unit tests to check the runtime functionality of the library: `npm run unit-test`

Both test suites are run when using `npm run test`
